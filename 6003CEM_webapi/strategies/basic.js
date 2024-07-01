const passport = require('koa-passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('../models/users');
const bcrypt = require('bcrypt');

const verifyPassword = function (user, password) {
  console.log("Password provided by user:", password);
  console.log("Hashed password from database:", user ? user.password : "undefined");

  if (!password || !user || !user.password) {
    console.error("Password or hashed password is missing.");
    throw new Error('data and hash arguments required');
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  console.log("Password match:", isMatch);
  return isMatch;
}

const checkUserAndPass = async (username, password, done) => {
  let user;

  try {
    username = username.trim().toLowerCase();
    console.log(`Normalized username: ${username}`);
    user = await users.findByUsername(username);
    console.log(`User found: ${JSON.stringify(user)}`);
  } catch (error) {
    console.error(`Error during authentication for user ${username}:`, error);
    return done(error);
  }

  if (user) {
    console.log(`Verifying password for user: ${username}`);
    if (verifyPassword(user, password)) {
      console.log(`Successfully authenticated user ${username}`);
      return done(null, user);
    } else {
      console.log(`Password incorrect for user ${username}`);
      return done(null, false);
    }
  } else {
    console.log(`No user found with username ${username}`);
    return done(null, false);
  }
}

const strategy = new BasicStrategy((username, password, done) => {
  console.log(`Authenticating user: ${username}`);
  checkUserAndPass(username, password, done);
});

module.exports = strategy;
