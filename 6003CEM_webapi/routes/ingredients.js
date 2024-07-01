const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/ingredients');
const auth = require('../controllers/auth');

// Initialize router with a prefix for all ingredient routes
const prefix = '/api/v1/ingredients';
const router = Router({ prefix: prefix });

// Define routes for CRUD operations on ingredients
router.get('/', auth, getAll);
router.post('/', auth, bodyParser(), createIngredient);
router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), updateIngredient);
router.del('/:id([0-9]{1,})', auth, deleteIngredient);

// Function to get all ingredients
async function getAll(ctx) {
  const result = await model.getAll();
  if (result.length) {
    ctx.body = result;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'No ingredients found' };
  }
}

// Function to get an ingredient by its ID
async function getById(ctx) {
  const id = ctx.params.id;
  const result = await model.getById(id);
  if (result.length) {
    ctx.body = result[0];
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Ingredient not found' };
  }
}

// Function to create a new ingredient
async function createIngredient(ctx) {
  const { name, amount, recipe_id } = ctx.request.body;

  if (!name || !amount || !recipe_id) {
    ctx.status = 400;
    ctx.body = { error: 'Missing required fields: name, amount, recipe_id' };
    return;
  }

  const body = ctx.request.body;
  const result = await model.add(body);

  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = { ID: id, created: true, link: `${ctx.request.path}/${id}` };
  } else {
    ctx.status = 500;
    ctx.body = { error: 'Failed to create ingredient' };
  }
}

// Function to update an ingredient
async function updateIngredient(ctx) {
  const id = ctx.params.id;
  let result = await model.getById(id);
  if (result.length) {
    let ingredient = result[0];
    const newData = ctx.request.body;
    Object.assign(ingredient, newData);
    result = await model.update(ingredient);
    if (result.affectedRows) {
      ctx.body = { ID: id, updated: true, link: ctx.request.path };
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Failed to update ingredient' };
    }
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Ingredient not found' };
  }
}

// Function to delete an ingredient
async function deleteIngredient(ctx) {
  const id = ctx.params.id;
  const result = await model.delById(id);
  if (result.affectedRows) {
    ctx.body = { ID: id, deleted: true };
  } else {
    ctx.status = 500;
    ctx.body = { error: 'Failed to delete ingredient' };
  }
}

module.exports = router;
