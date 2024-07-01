const db = require('../helpers/database');

// Get all comments on a given recipe
exports.getAll = async function getAll(recipeID) {
  const query = "SELECT * FROM comments WHERE recipeID = ?;";
  const data = await db.run_query(query, [recipeID]);
  return data;
}

// Create a new comment and associate it with a recipe
exports.add = async function add(comment) {
  const query = "INSERT INTO comments SET ?";
  const data = await db.run_query(query, comment);
  return data;
}

// Delete a specific comment by its ID
exports.deleteById = async function deleteById(id) {
  const query = "DELETE FROM comments WHERE id = ?;";
  const data = await db.run_query(query, [id]);
  return data;
}
