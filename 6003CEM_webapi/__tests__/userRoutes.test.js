const request = require('supertest');
const app = require('../app');
const auth = { user: 'alice', pass: 'password' }; // Basic Auth credentials

describe('User Endpoints', () => {
  let userIdToDelete = 2;

  beforeAll(async () => {
    // Create a user to delete
    const res = await request(app.callback())
      .post('/api/v1/users')
      .auth(auth.user, auth.pass) // Using Basic Auth for creation
      .send({
        username: 'user_to_delete',
        password: 'password',
        email: 'user_to_delete@example.com',
        role: 'user'
      });

    // Capture the ID of the created user
    userIdToDelete = res.body.ID;
    expect(res.statusCode).toEqual(201);
  });

  it('should create a new user', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .auth(auth.user, auth.pass) // Using Basic Auth for creation
      .send({
        username: 'unique_112233',
        password: 'password',
        email: 'unique_email@example.com',
        role: 'user'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('ID');
    expect(res.body).toHaveProperty('created', true);
  });

  it('should fetch all users', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users')
      .auth(auth.user, auth.pass); // Using Basic Auth

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch a single user by ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/1')
      .auth(auth.user, auth.pass); // Using Basic Auth

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ID');
  });

  it('should update a user by ID', async () => {
    const res = await request(app.callback())
      .put('/api/v1/users/1')
      .auth(auth.user, auth.pass) // Using Basic Auth
      .send({ email: 'updated_email@example.com', role: 'admin' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('updated', true);
  });

  it('should delete a user by ID', async () => {
    const res = await request(app.callback())
      .delete(`/api/v1/users/${userIdToDelete}`)
      .auth(auth.user, auth.pass); // Using Basic Auth

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('deleted', true);
  });
});
