const express = require("express");
const authControllers = require("../controllers/auth-controllers");
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const db = require("../db");

passport.use(new LocalStrategy(function verify(username, password, cb) {
  //   console.log(username, password, "hah");
  db.get('SELECT * FROM users WHERE username = ?', [username], function (err, row) {
    if (err) { return cb(err); }
    if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, row);
    });
  });
}));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const loginAuthenticator = passport.authenticate("local", {
  successRedirect: "/forum",
  failureRedirect: "/login"
})

const routeProtector = (req, res, next) => {
  console.log(req.user);
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
}


router.get('/', authControllers.redirectLogInPage);
router.get('/login', authControllers.getLogInPage);
router.post('/login', loginAuthenticator);
router.post('/logout', authControllers.logoutAction);
router.post('/signup', authControllers.signupAction);



module.exports =
{
  router,
  routeProtector
};