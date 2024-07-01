const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const bcrypt = require('bcrypt');
const etag = require('etag');
const model = require('../models/users');
const passport = require('koa-passport');
const can = require('../permissions/users');
const auth = require('../controllers/auth');
const { validateUser, validateUserUpdate } = require('../controllers/validation');

// Initialize router with a prefix for all user routes
const prefix = '/api/v1/users';
const router = Router({ prefix: prefix });

// Define routes for user operations
router.get('/', auth, getAll);
router.post('/', bodyParser(), validateUser, createUser);
router.post('/login', bodyParser(), login);
router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUserUpdate, updateUser);
router.del('/:id([0-9]{1,})', auth, deleteUser);
router.get('/search', auth, emailSearch);
router.get('/account', auth, getAccountDetails);  

// Function to search users by email
async function emailSearch(ctx, next) {
  const permission = can.readAll(ctx.state.user);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    let { q } = ctx.request.query;

    if (q && q.length < 3) {
      ctx.status = 400;
      ctx.body = { message: "Search string length must be 3 or more." };
      return next();
    }

    let result = await model.emailSearch(q);
    if (result.length) {
      ctx.body = result;
    }
  }
}

// Function to handle user login
async function login(ctx) {
  const { username, password } = ctx.request.body;

  try {
    const user = await model.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid username or password' };
      return;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid username or password' };
      return;
    }

    ctx.state.user = user;  // Set user in state
    const { ID, email, avatarURL } = user;
    const links = {
      self: `${ctx.protocol}://${ctx.host}${prefix}/${ID}`
    };
    ctx.body = { ID, username, email, avatarURL, links };
  } catch (error) {
    console.error('Login error:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
}

// Function to get all users
async function getAll(ctx) {
  const permission = can.readAll(ctx.state.user);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    console.log(ctx.request.query);

    let { limit = 10, page = 1, fields = null } = ctx.request.query;

    limit = parseInt(limit);
    page = parseInt(page);

    limit = limit > 100 ? 100 : limit;
    limit = limit < 1 ? 10 : limit;
    page = page < 1 ? 1 : page;

    let result = await model.getAll(limit, page);
    if (result.length) {
      if (fields !== null) {
        if (!Array.isArray(fields)) {
          fields = [fields];
        }
        result = result.map(record => {
          let partial = {};
          for (let field of fields) {
            partial[field] = record[field];
          }
          return partial;
        });
      }
      ctx.body = result;
    }
  }
}

// Function to get user by ID
async function getById(ctx, next) {
  const id = ctx.params.id;
  const result = await model.getById(id);
  if (result.length) {
    const data = result[0];
    const permission = can.read(ctx.state.user, data);
    if (!permission.granted) {
      ctx.status = 403;
    } else {
      console.log(ctx.headers);

      const body = permission.filter(data);
      const Etag = etag(JSON.stringify(body));
      const modified = new Date(data.modified);

      let is304 = false;

      const { ['if-none-match']: if_none_match } = ctx.headers;
      if (if_none_match === Etag) is304 = true;

      const { ['if-modified-since']: if_modified_since } = ctx.headers;
      if (modified < Date.parse(if_modified_since)) is304 = true;

      if (is304) {
        ctx.status = 304;
        return next();
      }

      ctx.body = body;
      ctx.set('Last-Modified', modified.toUTCString());
      ctx.set('Etag', Etag);
    }
  } else {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
    console.log("User not found with ID:", id);
  }
}

// Function to create a new user
async function createUser(ctx) {
  const body = ctx.request.body;
  body.role = 'user';  // Automatically set the role to 'user'
  const result = await model.add(body);
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = { ID: id, created: true, link: `${ctx.request.path}/${id}` };
  }
}

// Function to get account details of the logged-in user
async function getAccountDetails(ctx) {
  const userId = ctx.state.user.ID; // Assuming user ID is stored in ctx.state.user

  try {
    const result = await model.getById(userId);

    if (!result.length) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }

    const user = result[0];

    const permission = can.read(ctx.state.user, user);
    if (!permission.granted) {
      ctx.status = 403;
      ctx.body = { error: 'You do not have permission to access this account' };
      return;
    }

    const recipes = await model.getRecipesByUserId(userId) || [];

    ctx.body = {
      user,
      recipes: recipes.length ? recipes : 'No data'
    };
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
}

// Function to update a user
async function updateUser(ctx) {
  const id = ctx.params.id;
  let result = await model.getById(id);  // check it exists
  if (result.length) {
    let data = result[0];
    const permission = can.update(ctx.state.user, data);
    if (!permission.granted) {
      ctx.status = 403;
    } else {
      const newData = permission.filter(ctx.request.body);
      Object.assign(newData, { ID: id });

      // Ensure required fields are present
      if (!newData.email || !newData.role) {
        ctx.status = 400;
        ctx.body = { error: 'Missing required fields: email or role' };
        return;
      }

      // Fetch current username if not provided
      if (!newData.username) {
        newData.username = data.username;
      }

      console.log("Updating user with data:", newData); // Log the new data
      result = await model.update(newData);
      if (result.affectedRows) {
        ctx.body = { ID: id, updated: true, link: ctx.request.path };
      } else {
        ctx.status = 500;
        ctx.body = { error: 'Failed to update user' };
      }
    }
  } else {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
  }
}

// Function to delete a user
async function deleteUser(ctx) {
  const id = ctx.params.id;
  let result = await model.getById(id);
  if (result.length) {
    const data = result[0];
    console.log("trying to delete", data);
    const permission = can.delete(ctx.state.user, data);
    if (!permission.granted) {
      ctx.status = 403;
    } else {
      result = await model.delById(id);
      if (result.affectedRows) {
        ctx.body = { ID: id, deleted: true };
      }
    }
  }
}

module.exports = router;
