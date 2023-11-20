var sqlite3 = require('sqlite3');
var crypto = require('crypto');

var db = new sqlite3.Database('./db/g10.db');

db.serialize(function () {
  db.run("CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB, \
    name TEXT, \
    email TEXT UNIQUE, \
    email_verified INTEGER, \
    balance INTEGER \
  )");

  // create an initial user (username: alice, password: letmein)
  var salt = crypto.randomBytes(16);
  db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt, balance) VALUES (?, ?, ?, 10000)', [
    'alice',
    crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256'),
    salt
  ], function () {
    var salt = crypto.randomBytes(16);
    db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt, balance) VALUES (?, ?, ?, 10000)', [
      'bob',
      crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256'),
      salt
    ]);
  });
});

module.exports = db;