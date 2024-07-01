const db = require('../helpers/database');
const bcrypt = require('bcrypt');

// Find a user by their username
exports.findByUsername = async function findByUsername(username) {
  const query = "SELECT * FROM users WHERE username = ?;";
  const values = [username];
  console.log("Executing query:", query, values);
  const data = await db.run_query(query, values);
  console.log("User fetched from database:", data);
  return data[0];
};

// Get a user by their ID
exports.getById = async function getById(id) {
  const query = "SELECT * FROM users WHERE ID = ?;";
  const values = [id];
  console.log("Executing query:", query, values);
  const data = await db.run_query(query, values);
  console.log("User fetched from database:", data);
  return data;
};

// Add a new user
exports.add = async function add(user) {
  const query = "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)";
  const password = user.password;
  const hash = bcrypt.hashSync(password, 10);
  const values = [user.username, hash, user.email, user.role];
  console.log("Executing add query:", query, values);
  const data = await db.run_query(query, values);
  return data;
};

// Update a user
exports.update = async function update(user) {
  const query = "UPDATE users SET username = ?, email = ?, role = ? WHERE ID = ?";
  const values = [user.username, user.email, user.role, user.ID];
  console.log("Executing update query:", query, values);
  const data = await db.run_query(query, values);
  console.log("User update result:", data);
  return data;
};

// Get articles by a user's ID
exports.getArticlesByUserId = async function getArticlesByUserId(userId) {
  const query = "SELECT * FROM articles WHERE authorID = ?;";
  const values = [userId];
  const data = await db.run_query(query, values);
  return data;
};

// Get comments by a user's ID
exports.getCommentsByUserId = async function getCommentsByUserId(userId) {
  const query = "SELECT * FROM comments WHERE authorID = ?;";
  const values = [userId];
  const data = await db.run_query(query, values);
  return data;
};

// Get recipes by a user's ID
exports.getRecipesByUserId = async function getRecipesByUserId(userId) {
  const query = "SELECT * FROM recipes WHERE authorID = ?;";
  const values = [userId];
  const data = await db.run_query(query, values);
  return data;
};

// Delete a user by their ID
exports.delById = async function delById(id) {
  const query = "DELETE FROM users WHERE ID = ?";
  const values = [id];
  console.log("Executing delete query:", query, values);
  const data = await db.run_query(query, values);
  console.log("User delete result:", data);
  return data;
};

// Search for users by email
exports.emailSearch = async function emailSearch(q) {
  const query = "SELECT * FROM users WHERE email LIKE ?;";
  const values = [`%${q}%`];
  console.log("Executing email search query:", query, values);
  const data = await db.run_query(query, values);
  console.log("Email search result:", data);
  return data;
};

// Get all users with pagination
exports.getAll = async function getAll(limit, page) {
  const offset = (page - 1) * limit;
  const query = "SELECT * FROM users LIMIT ?, ?";
  const values = [offset, limit];
  console.log("Executing getAll query:", query, values);
  const data = await db.run_query(query, values);
  console.log("getAll result:", data);
  return data;
};
