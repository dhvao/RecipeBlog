const db = require('../helpers/database');

// Get a recipe by its ID, including its ingredients
exports.getById = async function getById(id) {
  const query = "SELECT * FROM recipes WHERE recipe_id = ?;";
  const data = await db.run_query(query, [id]);

  if (data.length > 0) {
    const ingredientQuery = "SELECT name, amount FROM ingredients WHERE recipe_id = ?;";
    const ingredients = await db.run_query(ingredientQuery, [id]);
    data[0].ingredients = ingredients;
  }

  return data;
};

// Get all recipes with pagination and order, including their ingredients
exports.getAll = async function getAll(page = 1, limit = 10, order = 'created_at', direction = 'ASC') {
  const offset = (page - 1) * limit;
  let query;
  if (direction === 'DESC') {
    query = "SELECT * FROM recipes ORDER BY ?? DESC LIMIT ? OFFSET ?;";
  } else {
    query = "SELECT * FROM recipes ORDER BY ?? ASC LIMIT ? OFFSET ?;";
  }

  // Validate the order parameter
  if (!['created_at', 'updated_at', 'title', 'recipe_id'].includes(order)) {
    order = 'created_at'; // Default to a valid column
  }

  const values = [order, limit, offset];
  const data = await db.run_query(query, values);

  for (let recipe of data) {
    const ingredientQuery = "SELECT name, amount FROM ingredients WHERE recipe_id = ?;";
    const ingredients = await db.run_query(ingredientQuery, [recipe.recipe_id]);
    recipe.ingredients = ingredients;
  }

  return data;
};

// Add a new recipe, including its ingredients if provided
exports.add = async function add(recipe) {
  const recipeQuery = "INSERT INTO recipes (title, instructions, summary, published, authorID) VALUES (?, ?, ?, ?, ?);";
  const recipeValues = [recipe.title, recipe.instructions, recipe.summary, recipe.published, recipe.authorID];
  const recipeData = await db.run_query(recipeQuery, recipeValues);

  if (recipeData.affectedRows) {
    const recipeID = recipeData.insertId;

    // Handle ingredients if they are provided
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      const ingredients = recipe.ingredients.map(ing => [ing.name, ing.amount, recipeID]);
      const ingredientsQuery = "INSERT INTO ingredients (name, amount, recipe_id) VALUES ?";
      await db.run_query(ingredientsQuery, [ingredients]);
    }

    return recipeData;
  }
  return null;
};

const update = async (id, data) => {
  const { title, instructions, summary, published, ingredients } = data;
  const query = 'UPDATE recipes SET title = ?, instructions = ?, summary = ?, published = ? WHERE recipe_id = ?';
  const values = [title, instructions, summary, published, id];

  try {
    const result = await db.run_query(query, values);

    // Handle ingredients
    if (ingredients && Array.isArray(ingredients)) {
      // Delete existing ingredients
      await db.run_query('DELETE FROM ingredients WHERE recipe_id = ?', [id]);

      // Insert new ingredients
      const ingredientQueries = ingredients.map(ingredient => {
        return db.run_query('INSERT INTO ingredients (recipe_id, name, amount) VALUES (?, ?, ?)', [id, ingredient.name, ingredient.amount]);
      });

      await Promise.all(ingredientQueries);
    }

    return { updated: true };
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};


// Delete a recipe by its ID, including its ingredients
exports.delById = async function delById(id) {
  const deleteIngredientQuery = "DELETE FROM ingredients WHERE recipe_id = ?;";
  await db.run_query(deleteIngredientQuery, [id]);

  const query = "DELETE FROM recipes WHERE recipe_id = ?;";
  const data = await db.run_query(query, [id]);
  return data;
};
