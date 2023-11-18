const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const createUserDatabase = (username) => {
  // Assuming you want to create the database in a 'user-db' directory
  const dbDirectory = path.join(__dirname, '..', 'db', 'user-db');
  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
  }

  const dbPath = path.join(dbDirectory, `${username}.db`);
  // Check if the database already exists
  if (!fs.existsSync(dbPath)) {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Could not create database for user', err);
        throw err; // Or handle it as per your application's error handling policy
      } else {
        initializeDatabase(db);
        console.log(`Database created for user: ${username}`);
      }
    });
    return db;
  } else {
    console.log(`Database already exists for user: ${username}`);
  }
};

const initializeDatabase = (db) => {
  // SQL statement to create the 'user' table
  const createUserTableSql = `
      CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
      );
  `;

  // SQL statement to create the 'merchandise' table
  const createMerchandiseTableSql = `
      CREATE TABLE IF NOT EXISTS merchandise (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          hidden BOOLEAN NOT NULL DEFAULT FALSE
      );
  `;

  db.serialize(() => {
    db.run(createUserTableSql);
    db.run(createMerchandiseTableSql);

    // Insert initial users
    const initialDataPath = path.join(__dirname, '..', 'initial-data.json');
    if (fs.existsSync(initialDataPath)) {
      const initialData = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));

      initialData.users.forEach(user => {
        const insertUserSql = `INSERT INTO user (username, password) VALUES (?, ?)`;
        const password = crypto.randomBytes(8).toString('hex');
        db.run(insertUserSql, [user, password]);
      });

      initialData.merchandise.forEach(item => {
        const insertMerchandiseSql = `INSERT INTO merchandise (name, quantity, price, hidden) VALUES (?, ?, ?, ?)`;
        db.run(insertMerchandiseSql, [item.name, item.quantity, item.price, item.hidden]);
      });
    } else {
      console.error('Initial data file not found:', initialDataPath);
    }
  });
};

module.exports = {
  createUserDatabase
};
