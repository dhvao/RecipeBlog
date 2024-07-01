const db = require('../helpers/database');

// Get all ingredients
exports.getAll = async function getAll() {
  const query = "SELECT * FROM ingredients;";
  const data = await db.run_query(query);
  return data;
}

// Get an ingredient by its ID
exports.getById = async function getById(id) {
  const query = "SELECT * FROM ingredients WHERE ingredient_id = ?;"; // Use the correct column name
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

// Add a new ingredient
exports.add = async function add(ingredient) {
  const query = "INSERT INTO ingredients (name, amount, recipe_id) VALUES (?, ?, ?);";
  const values = [ingredient.name, ingredient.amount, ingredient.recipe_id];
  const data = await db.run_query(query, values);
  return data;
}

// Update an ingredient
exports.update = async function update(ingredient) {
  const query = "UPDATE ingredients SET name = ?, amount = ?, recipe_id = ? WHERE ingredient_id = ?;"; // Use the correct column name
  const values = [ingredient.name, ingredient.amount, ingredient.recipe_id, ingredient.ingredient_id];
  const data = await db.run_query(query, values);
  return data;
}

// Delete an ingredient by its ID
exports.delById = async function delById(id) {
  const query = "DELETE FROM ingredients WHERE ingredient_id = ?;"; // Use the correct column name
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}
