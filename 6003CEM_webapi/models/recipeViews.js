// models/recipeViews.js
const db = require('../helpers/database');

// Add a new view record for a recipe
exports.add = async function add(recipeID) {
  const query = "INSERT INTO recipeViews (recipe_id) VALUES (?);";
  const data = await db.run_query(query, [recipeID]);
  return data;
};

// Count the number of views for a recipe
exports.count = async function count(recipeID) {
  const query = "SELECT COUNT(*) as views FROM recipeViews WHERE recipe_id = ?;";
  const data = await db.run_query(query, [recipeID]);
  return data;
};
