const db = require('../helpers/database');

//get a single article by its id  
exports.getById = async function getById (id) {
  const query = "SELECT * FROM articles WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}
/**
 * Retrieves a paginated list of articles from the database.
 * @author Toma
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of articles to return per page.
 * @param {string} order - The column name to order the results by.
 * @param {string} direction - The ordering direction ('ASC' or 'DESC').
 * @returns {Promise} A Promise resolving to an array of article objects.
 */
exports.getAll = async function getAll (page, limit, order, direction) {
  const offset = (page - 1) * limit;
  let query;
  if (direction === 'DESC') {
    query = "SELECT * FROM articles ORDER BY ?? DESC LIMIT ? OFFSET ?;";
  } else {
    query = "SELECT * FROM articles ORDER BY ?? ASC LIMIT ? OFFSET ?;";    
  }
  const values = [order, limit, offset];
  const data = await db.run_query(query, values);
  return data;
}

//create a new article in the database
exports.add = async function add (article) {
  const query = "INSERT INTO articles SET ?";
  const data = await db.run_query(query, article);
  return data;
}

//delete an article by its id
exports.delById = async function delById (id) {
  const query = "DELETE FROM articles WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

/**
 * Creates a new article in the database.
 * @author Toma
 * @param {Object} article - An object containing article data.
 * @returns {Promise} A Promise resolving to the result of the database operation.
 */exports.update = async function update (article) {
  const query = "UPDATE articles SET ? WHERE ID = ?;";
  const values = [article, article.ID];
  const data = await db.run_query(query, values);
  return data;
}