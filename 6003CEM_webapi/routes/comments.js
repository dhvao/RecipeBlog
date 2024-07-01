// routes/comments.js
const Router = require('koa-router');
const auth = require('../controllers/auth');
const validate = require('../controllers/validation');
const comments = require('../models/comments');

const router = Router({ prefix: '/api/v1/comments' });

router.get('/', getCommentsByRecipeID);
router.post('/', auth, validate.validateComment, add);
router.del('/:id([0-9]{1,})', auth, deleteById);

async function getCommentsByRecipeID(ctx) {
  const recipeID = ctx.query.recipeID;
  if (!recipeID) {
    ctx.status = 400;
    ctx.body = { error: 'recipeID is required' };
    return;
  }
  const result = await comments.getAll(recipeID);
  ctx.body = result;
}

async function add(ctx) {
  const body = ctx.request.body;
  const result = await comments.add(body);
  ctx.status = 201;
  ctx.body = result;
}

async function deleteById(ctx) {
  const id = ctx.params.id;
  const result = await comments.deleteById(id);
  if (result.affectedRows) {
    ctx.body = { ID: id, deleted: true };
  }
}

module.exports = router;
