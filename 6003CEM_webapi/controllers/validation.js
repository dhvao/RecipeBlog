const { Validator, ValidationError } = require('jsonschema');

const articleSchema = require('../schemas/article.json').definitions.article;
const recipeSchema = require('../schemas/recipes.json').definitions.recipe;
const ingredientsSchema = require('../schemas/ingredients.json').definitions.ingredient;
const categorySchema = require('../schemas/category.json').definitions.category;
const commentSchema = require('../schemas/comment.json').definitions.comment;
const userSchema = require('../schemas/user.json').definitions.user;
const userUpdateSchema = require('../schemas/user.json').definitions.userUpdate;

const makeKoaValidator = (schema, resource) => {
  const v = new Validator();
  const validationOptions = {
    throwError: true,
    propertyName: resource
  };

  const handler = async (ctx, next) => {
    const body = ctx.request.body;
    try {
      console.log(`Validating ${resource}:`, body); // Log the data being validated
      v.validate(body, schema, validationOptions);
      await next();
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error(error);
        ctx.status = 400;
        ctx.body = error;
      } else {
        throw error;
      }
    }
  }
  return handler;
}

exports.validateArticle = makeKoaValidator(articleSchema, 'article');
exports.validateIngredient = makeKoaValidator(ingredientsSchema, 'ingredient');
exports.validateRecipe = makeKoaValidator(recipeSchema, 'recipe');
exports.validateCategory = makeKoaValidator(categorySchema, 'category');
exports.validateComment = makeKoaValidator(commentSchema, 'comment');
exports.validateUser = makeKoaValidator(userSchema, 'user');
exports.validateUserUpdate = makeKoaValidator(userUpdateSchema, 'userUpdate');
