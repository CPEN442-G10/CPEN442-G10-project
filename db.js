var sqlite3 = require('sqlite3');
var crypto = require('crypto');
const { createUserDatabase } = require('./helpers/database-create');

var db = new sqlite3.Database('./db/g10.db');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB \
  )");
  
  db.run("CREATE TABLE IF NOT EXISTS posts ( \
    post_id INTEGER PRIMARY KEY AUTOINCREMENT, \
    user_id INTEGER, \
    username TEXT, \
    content TEXT, \
    is_safe INTEGER, \
    is_bank_post INTEGER DEFAULT 0, \
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
    FOREIGN KEY (user_id) REFERENCES users(id), \
    FOREIGN KEY (username) REFERENCES users(username) \
  )");

  // create an initial user (username: alice, password: letmein)
  var salt = crypto.randomBytes(16);
  db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
    'alice',
    crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256'),
    salt
  ]);
  createUserDatabase('alice');
});

module.exports = db;