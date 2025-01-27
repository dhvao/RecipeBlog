const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const auth = require('../controllers/auth');
const can = require('../permissions/articles');
const articles = require('../models/articles');
const articleViews = require('../models/articleViews');
const articleCategories = require('../models/articleCategories');
const comments = require('../models/comments');
const likes = require('../models/likes');
const { validateArticle, validateComment } = require('../controllers/validation');

const prefix = '/api/v1/articles';
const router = Router({ prefix: prefix });

// Article routes
router.get('/', getAll);
router.post('/', auth, bodyParser(), validateArticle, createArticle);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateArticle, updateArticle);
router.del('/:id([0-9]{1,})', auth, deleteArticle);

// Likes routes
router.get('/:id([0-9]{1,})/likes', likesCount);
router.post('/:id([0-9]{1,})/likes', auth, likePost);
router.del('/:id([0-9]{1,})/likes', auth, dislikePost);

// Views route
router.get('/:id([0-9]{1,})/views', getViewCount);

// Categories routes
router.get('/:id([0-9]{1,})/categories', getAllCategories);
router.post('/:id([0-9]{1,})/categories/:cid([0-9]{1,})', auth, addCategory);
router.del('/:id([0-9]{1,})/categories/:cid([0-9]{1,})', auth, removeCategory);

// Comments routes
router.get('/:id([0-9]{1,})/comments', getAllComments);
router.post('/:id([0-9]{1,})/comments', auth, bodyParser(), addCommentIds, validateComment, addComment);

async function getAll(ctx) {
  let { page = 1, limit = 10, order = 'dateCreated', direction = 'DESC' } = ctx.request.query;

  // Ensure params are integers
  limit = parseInt(limit);
  page = parseInt(page);

  // Validate pagination values to ensure they are sensible
  limit = limit > 100 ? 100 : limit;
  limit = limit < 1 ? 10 : limit;
  page = page < 1 ? 1 : page;

  // Ensure order and direction make sense
  order = ['dateCreated', 'dateModified'].includes(order) ? order : 'dateCreated';
  direction = ['ASC', 'DESC'].includes(direction) ? direction : 'ASC';

  const result = await articles.getAll(page, limit, order, direction);
  if (result.length) {
    const body = result.map(post => {
      // Extract the post fields we want to send back (summary details)
      const { ID, title, summary, imageURL, authorID } = post;
      // Add links to the post summaries for HATEOAS compliance
      // Clients can follow these to find related resources
      const links = {
        likes: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}/likes`,
        self: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}`
      }
      return { ID, title, summary, imageURL, authorID, links };
    });
    ctx.body = body;
  }
}

function addCommentIds(ctx, next) {
  const articleID = parseInt(ctx.params.id);
  const authorID = ctx.state.user.ID;
  Object.assign(ctx.request.body, { articleID, authorID });
  return next();
}

async function likesCount(ctx) {
  // TODO: add error handling
  const id = ctx.params.id;
  const result = await likes.count(id);
  ctx.body = result ? result : 0;
}

async function likePost(ctx) {
  // TODO: add error handling
  const id = parseInt(ctx.params.id);
  const uid = ctx.state.user.ID;
  const result = await likes.like(id, uid);
  console.log(result);
  ctx.body = result.affectedRows ? { message: "liked" } : { message: "error" };
}

async function dislikePost(ctx) {
  // TODO: remove error handling
  const id = parseInt(ctx.params.id);
  const uid = ctx.state.user.ID;
  const result = await likes.dislike(id, uid);
  console.log(result);
  ctx.body = result.affectedRows ? { message: "disliked" } : { message: "error" };
}

async function getById(ctx) {
  const id = ctx.params.id;
  const result = await articles.getById(id);
  if (result.length) {
    await articleViews.add(id);  // Add a record of being viewed
    const article = result[0];
    ctx.body = article;
  }
}

async function createArticle(ctx) {
  const body = ctx.request.body;
  const result = await articles.add(body);
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = { ID: id, created: true, link: `${ctx.request.path}/${id}` };
  }
}

async function updateArticle(ctx) {
  const id = ctx.params.id;
  let result = await articles.getById(id);  // Check it exists
  if (result.length) {
    let article = result[0];
    const permission = can.update(ctx.state.user, article);
    console.log('Permission Result:', permission); // Add this line
    if (!permission.granted) {
      ctx.status = 403;
      ctx.body = { error: 'You do not have permission to update this article' };
      return;
    } else {
      // Exclude fields that should not be updated
      const { ID, dateCreated, dateModified, authorID, ...body } = ctx.request.body;
      // Overwrite updatable fields with remaining body data
      Object.assign(article, body);
      result = await articles.update(article);
      if (result.affectedRows) {
        ctx.body = { ID: id, updated: true, link: ctx.request.path };
      } else {
        ctx.status = 500;
        ctx.body = { error: 'Failed to update article' };
      }
    }
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Article not found' };
  }
}

async function deleteArticle(ctx) {
  const permission = can.delete(ctx.state.user);
  console.log('Permission Result:', permission); // Add this line
  if (!permission.granted) {
    ctx.status = 403;
    ctx.body = { error: 'You do not have permission to delete this article' };
  } else {
    const id = ctx.params.id;
    const result = await articles.delById(id);
    if (result.affectedRows) {
      ctx.body = { ID: id, deleted: true };
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Failed to delete article' };
    }
  }
}

async function getViewCount(ctx) {
  const id = ctx.params.id;
  const result = await articleViews.count(id);
  if (result.length) {
    ctx.body = { ID: id, views: result[0].views };
  }
}

async function addCategory(ctx) {
  const articleID = ctx.params.id;
  const categoryID = ctx.params.cid;
  const result = await articleCategories.add(articleID, categoryID);
  if (result.affectedRows) {
    ctx.status = 201;
    ctx.body = { added: true };
  }
}

async function removeCategory(ctx) {
  const articleID = ctx.params.id;
  const categoryID = ctx.params.cid;
  const result = await articleCategories.delete(articleID, categoryID);
  if (result.affectedRows) {
    ctx.body = { deleted: true };
  }
}

async function getAllCategories(ctx) {
  const id = ctx.params.id;
  const result = await articleCategories.getAll(id);
  if (result.length) {
    ctx.body = result;
  }
}

async function getAllComments(ctx) {
  const articleID = ctx.params.id;
  const result = await comments.getAll(articleID);
  if (result.length) {
    ctx.body = result;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'No comments found for this article' };
  }
}

async function addComment(ctx) {
  const articleID = ctx.params.id;
  const authorID = ctx.state.user.ID;
  const comment = ctx.request.body;
  comment.articleID = articleID;
  comment.authorID = authorID;

  const result = await comments.add(comment);
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = { ID: id, created: true, link: `${ctx.request.path}/${id}` };
  } else {
    ctx.status = 500;
    ctx.body = { error: 'Failed to create comment' };
  }
}



module.exports = router;
