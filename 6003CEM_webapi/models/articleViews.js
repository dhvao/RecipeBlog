const db = require('../helpers/database');

/**
 * Records a new view for a given article.
 * @author Toma
 * @param {number} id - The ID of the article.
 */
exports.add = async function add (id) {
  let query = "INSERT INTO articleViews SET articleId=?; ";
  await db.run_query(query, [id]);
}

/**
 * Retrieves the total view count for a given article.
 * @author Toma
 * @param {number} id - The ID of the article.
 * @returns {Promise} A Promise resolving to an object containing the 'views' count. 
 */exports.count = async function count (id) {
  let query = "SELECT count(1) as views FROM articleViews WHERE articleId=?;";
  const result = await db.run_query(query, [id]);
  return result;
}
