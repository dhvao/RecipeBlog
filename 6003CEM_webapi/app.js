// app.js or equivalent
const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const app = new Koa();

app.use(cors({
  origin: 'https://genuineplato-investgenetic-3001.codio-box.uk', // Replace with your frontend URL
  credentials: true, // Allow credentials (cookies)
}));

app.use(bodyParser());
app.use(passport.initialize());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
    console.error('Server Error:', err);
  }
});

// Routes setup
const special = require('./routes/special.js');
const articles = require('./routes/articles.js');
const users = require('./routes/users.js');
const ingredients = require('./routes/ingredients.js');
const categories = require('./routes/categories.js');
const comments = require('./routes/comments.js');
const recipes = require('./routes/recipes.js');
const uploads = require('./routes/uploads.js');

app.use(special.routes());
app.use(articles.routes());
app.use(users.routes());
app.use(ingredients.routes());
app.use(categories.routes());
app.use(comments.routes());
app.use(uploads.routes());
app.use(recipes.routes());

module.exports = app;
