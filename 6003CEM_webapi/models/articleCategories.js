const db = require('../helpers/database');

/**
 * Adds a category to an article, gracefully handling duplicates. 
 * @author Toma
 * @param {number} id - The ID of the article.
 * @param {number} categoryID - The ID of the category.
 * @returns {Promise} A Promise resolving to the result of the database operation.
 */
exports.add = async function add (id, categoryID) {
  let query = "INSERT INTO articleCategories SET articleID=?, categoryID=?";
      query += " ON DUPLICATE KEY UPDATE articleID=articleID; ";
  const result = await db.run_query(query, [id, categoryID]);
  return result;
}

/**
 * Removes a category from an article, gracefully handling non-existent associations. 
 * @author Toma
 * @param {number} id - The ID of the article.
 * @param {number} categoryID - The ID of the category.
 * @returns {Promise} A Promise resolving to the result of the database operation.
 */
exports.delete = async function delete_ (id, categoryID) {
  let query = "DELETE FROM articleCategories WHERE articleID=? AND categoryID=?;";
  const result = await db.run_query(query, [id, categoryID]);
  return result;
}

/**
 * Retrieves all categories associated with a given article. 
 * @author Toma
 * @param {number} id - The ID of the article.
 * @returns {Promise} A Promise resolving to an array of category objects.
 */
exports.getAll = async function getAll (id) {
  let query = "SELECT c.ID, c.name FROM articleCategories as ac INNER JOIN categories AS c";
      query += " ON ac.categoryID = c.ID WHERE ac.articleID = ?;";
  const result = await db.run_query(query, id);
  return result;
}
