// models/recipeCategories.js
const db = require('../helpers/database');

// Add a new category to a recipe
exports.add = async function add(recipeID, categoryID) {
  const query = "INSERT INTO recipeCategories (recipe_id, category_id) VALUES (?, ?);";
  const data = await db.run_query(query, [recipeID, categoryID]);
  return data;
};

// Delete a category from a recipe
exports.delete = async function del(recipeID, categoryID) {
  const query = "DELETE FROM recipeCategories WHERE recipe_id = ? AND category_id = ?;";
  const data = await db.run_query(query, [recipeID, categoryID]);
  return data;
};

// Get all categories for a recipe
exports.getAll = async function getAll(recipeID) {
  const query = "SELECT * FROM recipeCategories WHERE recipe_id = ?;";
  const data = await db.run_query(query, [recipeID]);
  return data;
};
