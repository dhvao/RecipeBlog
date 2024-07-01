const db = require('../helpers/database');

/**
 * Retrieves all categories from the database.
 * @author Toma
 * @returns {Promise} A Promise resolving to an array of category objects.
 */
exports.getAll = async function getAll () {
  const query = "SELECT * FROM categories;";
  const data = await db.run_query(query);
  return data;
}

/**
 * Retrieves a single category by its ID.
 * @author Toma
 * @param {number} id - The ID of the category.
 * @returns {Promise} A Promise resolving to the category data.
 */
exports.getById = async function getById (id) {
  const query = "SELECT * FROM categories WHERE category_id = ?;"; // Use the correct column name
  const data = await db.run_query(query, [id]);
  return data;
}

/**
 * Creates a new category in the database.
 * @author Toma
 * @param {Object} category - An object containing category data.
 * @returns {Promise} A Promise resolving to the result of the database operation.
 */
exports.add = async function add (category) {
  const query = "INSERT INTO categories (name, description) VALUES (?, ?);"; // Use the correct column names
  const values = [category.name, category.description];
  const data = await db.run_query(query, values);
  return data;
}

/**
 * Updates an existing category in the database.
 * @author Toma
 * @param {Object} category - An object containing updated category data (including the ID).
 * @returns {Promise} A Promise resolving to the result of the database operation.
 */
exports.update = async function update (category) {
  const query = "UPDATE categories SET name = ?, description = ? WHERE category_id = ?;"; // Use the correct column names
  const values = [category.name, category.description, category.category_id];
  const data = await db.run_query(query, values);
  return data;
}

/**
 * Deletes a category from the database by its ID.
 * @author Toma
 * @param {number} id - The ID of the category.
 * @returns {Promise} A Promise resolving to the result of the database operation.
 */
exports.delById = async function delById (id) {
  const query = "DELETE FROM categories WHERE category_id = ?;"; // Use the correct column name
  const data = await db.run_query(query, [id]);
  return data;
}
