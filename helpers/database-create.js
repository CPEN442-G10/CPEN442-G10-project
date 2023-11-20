const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const initializeDatabase = (db) => {
  // SQL statements to create tables
  // Ensure you have UNIQUE constraints where appropriate
  const createUserTableSql = `
      CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
      );
  `;

  const createMerchandiseTableSql = `
      CREATE TABLE IF NOT EXISTS merchandise (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          hidden BOOLEAN NOT NULL DEFAULT FALSE
      );
  `;

  db.serialize(() => {
      // Create tables
      db.run(createUserTableSql);
      db.run(createMerchandiseTableSql);

      const initialDataPath = path.join(__dirname, '..', 'initial-data.json');
      // Insert initial data if the file exists
      if (fs.existsSync(initialDataPath)) {
          const initialData = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));

          // Insert initial users with INSERT OR IGNORE to avoid duplicates
          const insertUserSql = `INSERT OR IGNORE INTO user (username, password) VALUES (?, ?)`;
          initialData.users.forEach(user => {
              const password = crypto.randomBytes(8).toString('hex'); // Random password
              db.run(insertUserSql, [user.username, password]);
          });

          // Insert initial merchandise with INSERT OR IGNORE to avoid duplicates
          const insertMerchandiseSql = `INSERT OR IGNORE INTO merchandise (name, quantity, price, hidden) VALUES (?, ?, ?, ?)`;
          initialData.merchandise.forEach(item => {
              db.run(insertMerchandiseSql, [item.name, item.quantity, item.price, item.hidden]);
          });
      } else {
          console.error('Initial data file not found:', initialDataPath);
      }
  });
};

const createUserDatabase = (username) => {
  // Assuming you want to create the database in a 'user-db' directory
  const dbDirectory = path.join(__dirname, '..', 'db', 'user-db');
  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
  }

  const dbPath = path.join(dbDirectory, `${username}.db`);
  
  // Check if the database already exists
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
};

module.exports = {
  initializeDatabase,
  createUserDatabase
};