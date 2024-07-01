const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/recipes');
const auth = require('../controllers/auth');
const can = require('../permissions/recipes');

const prefix = '/api/v1/recipes';
const router = Router({ prefix: prefix });

router.get('/', getAll);
router.post('/', auth, bodyParser(), createRecipe);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), updateRecipe);
router.del('/:id([0-9]{1,})', auth, deleteRecipe);

async function getAll(ctx) {
    const result = await model.getAll();
    if (result.length) {
        ctx.body = result;
    } else {
        ctx.status = 404;
        ctx.body = { error: 'No recipes found' };
    }
}

async function getById(ctx) {
    const id = ctx.params.id;
    const result = await model.getById(id);
    if (result.length) {
        ctx.body = result[0];
    } else {
        ctx.status = 404;
        ctx.body = { error: 'Recipe not found' };
    }
}

async function createRecipe(ctx) {
    const body = ctx.request.body;
    const result = await model.add(body);
    if (result && result.affectedRows) {
        const id = result.insertId;
        ctx.status = 201;
        ctx.body = { ID: id, created: true, link: `${ctx.request.path}/${id}` };
    } else {
        ctx.status = 500;
        ctx.body = { error: 'Failed to create recipe' };
    }
}

async function updateRecipe(ctx) {
    const id = ctx.params.id;
    let result = await model.getById(id);
    if (result.length) {
        let recipe = result[0];
        const permission = can.update(ctx.state.user, recipe);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = { error: 'You do not have permission to update this recipe' };
            return;
        } else {
            const { recipe_id, ...body } = ctx.request.body;
            body.recipe_id = id;
            result = await model.update(body);
            if (result.affectedRows) {
                ctx.body = { ID: id, updated: true, link: ctx.request.path };
            } else {
                ctx.status = 500;
                ctx.body = { error: 'Failed to update recipe' };
            }
        }
    } else {
        ctx.status = 404;
        ctx.body = { error: 'Recipe not found' };
    }
}

async function deleteRecipe(ctx) {
    const id = ctx.params.id;
    let result = await model.getById(id);
    if (result.length) {
        let recipe = result[0];
        const permission = can.delete(ctx.state.user, recipe);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = { error: 'You do not have permission to delete this recipe' };
            return;
        } else {
            result = await model.deleteById(id);
            if (result.affectedRows) {
                ctx.body = { ID: id, deleted: true };
            } else {
                ctx.status = 500;
                ctx.body = { error: 'Failed to delete recipe' };
            }
        }
    } else {
        ctx.status = 404;
        ctx.body = { error: 'Recipe not found' };
    }
}

module.exports = router;
