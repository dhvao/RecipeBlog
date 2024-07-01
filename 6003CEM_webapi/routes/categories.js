const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/categories');
const auth = require('../controllers/auth');
const {validateCategory} = require('../controllers/validation');

const router = Router({prefix: '/api/v1/categories'});

router.get('/', auth, getAll);
router.post('/', auth, bodyParser(), validateCategory, createCategory);
router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateCategory, updateCategory);
router.del('/:id([0-9]{1,})', auth, deleteCategory);

async function getAll(ctx) {
  const result = await model.getAll();
  ctx.body = result;
}

async function getById(ctx) {
  const id = ctx.params.id;
  const result = await model.getById(id);
  if (result.length) {
    const category = result[0];
    ctx.body = category;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Category not found' };
  }
}

async function createCategory(ctx) {
  const body = ctx.request.body;
  const result = await model.add(body);
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = { ID: id, created: true, link: `${ctx.request.path}/${id}` };
  } else {
    ctx.status = 500;
    ctx.body = { error: 'Failed to create category' };
  }
}

async function updateCategory(ctx) {
  const id = ctx.params.id;
  let result = await model.getById(id);
  if (result.length) {
    let category = result[0];
    const newData = ctx.request.body;
    Object.assign(category, newData);
    result = await model.update(category);
    if (result.affectedRows) {
      ctx.body = { ID: id, updated: true, link: ctx.request.path };
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Failed to update category' };
    }
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Category not found' };
  }
}

async function deleteCategory(ctx) {
  const id = ctx.params.id;
  const result = await model.delById(id);
  if (result.affectedRows) {
    ctx.body = { ID: id, deleted: true };
  } else {
    ctx.status = 500;
    ctx.body = { error: 'Failed to delete category' };
  }
}

module.exports = router;
