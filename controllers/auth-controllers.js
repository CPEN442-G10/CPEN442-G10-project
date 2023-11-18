const crypto = require("crypto");
const db = require("../db");
const { createUserDatabase } = require('../helpers/database-create');

exports.redirectLogInPage = (req, res) => {
    res.redirect("/login");
}

exports.getLogInPage = (req, res) => {
  if (req.user)
  {
    return res.redirect("/forum");
  }
  res.render("login", {
      pageTitle: "Log In",
      path: "login",
  })
}

exports.logoutAction = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect("/login")
    })
}

exports.signupAction = (req, res, next) => {
    // console.log(req.body);
    // return;
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.signupPassword, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return next(err); }
      db.run('INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
        req.body.signupUsername,
        hashedPassword,
        salt
      ], function(err) {
        if (err) { return next(err); }
        createUserDatabase(req.body.signupUsername);
        var user = {
          id: this.lastID,
          username: req.body.signupUsername
        };
        req.login(user, function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
      });
    });
}