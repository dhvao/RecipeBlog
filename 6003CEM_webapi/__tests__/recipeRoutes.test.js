const request = require('supertest');
const app = require('../app');
const auth = { user: 'alice', pass: 'password' }; // Basic Auth credentials

describe('Recipe Endpoints', () => {
  let recipeIdToDelete;

  beforeAll(async () => {
    // Create a recipe to test
    const res = await request(app.callback())
      .post('/api/v1/recipes')
      .auth(auth.user, auth.pass) // Using Basic Auth for creation
      .send({
        title: 'Recipe to Test',
        instructions: 'Steps for recipe to test',
        summary: 'This is a recipe to be tested',
        published: 1, // or true if it's a boolean in your schema
        authorID: 1 // assuming Alice's ID is 1
      });

    // Capture the ID of the created recipe
    recipeIdToDelete = res.body.ID;
    console.log(`Created recipe with ID: ${recipeIdToDelete}`);
    expect(res.statusCode).toEqual(201);
  });

  it('should create a new recipe', async () => {
    const res = await request(app.callback())
      .post('/api/v1/recipes')
      .auth(auth.user, auth.pass) // Using Basic Auth for creation
      .send({
        title: 'Unique Recipe',
        instructions: 'Unique steps',
        summary: 'This is a unique recipe',
        published: 1, // or true if it's a boolean in your schema
        authorID: 1 // assuming Alice's ID is 1
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('ID');
    expect(res.body).toHaveProperty('created', true);
  });

  it('should fetch all recipes', async () => {
    const res = await request(app.callback())
      .get('/api/v1/recipes')
      .auth(auth.user, auth.pass); // Using Basic Auth

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch a single recipe by ID', async () => {
    const res = await request(app.callback())
      .get(`/api/v1/recipes/${recipeIdToDelete}`)
      .auth(auth.user, auth.pass); // Using Basic Auth

    console.log('Fetch single recipe response:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('recipe_id', recipeIdToDelete);
  });

  it('should update a recipe by ID', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/recipes/${recipeIdToDelete}`)
      .auth(auth.user, auth.pass) // Using Basic Auth
      .send({
        title: 'Updated Recipe Title',
        instructions: 'Updated steps',
        summary: 'Updated summary',
        published: 1 // or true if it's a boolean in your schema
      });

    console.log('Update response:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('updated', true);
  });

  it('should delete a recipe by ID', async () => {
    console.log(`Attempting to delete recipe with ID: ${recipeIdToDelete}`);
    const res = await request(app.callback())
      .delete(`/api/v1/recipes/${recipeIdToDelete}`)
      .auth(auth.user, auth.pass); // Using Basic Auth

    console.log('Delete response:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('deleted', true);
  });
});
