const passport = require('koa-passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('../models/users');
const bcrypt = require('bcrypt');

passport.use(new BasicStrategy(
  async (username, password, done) => {
    try {
      const user = await users.findByUsername(username);
      if (!user) {
        return done(null, false);
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

module.exports = passport.authenticate('basic', { session: false });
