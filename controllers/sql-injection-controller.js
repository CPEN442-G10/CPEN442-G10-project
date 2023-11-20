const sqlite3 = require('sqlite3');
const path = require('path');
const { initializeDatabase } = require('../helpers/database-create')

exports.getSqlInjectionLoginPage = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    res.render('sql-injection/login', {
        pageTitle: "SQL Injection Log In",
        path: '/sql-injection/login'
    });
};

exports.postSqlInjectionLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const dbPath = path.join(__dirname, '..', 'db', 'user-db', req.user.username + '.db');
    const db = new sqlite3.Database(dbPath);

    // Vulnerable SQL query for educational purposes
    let query = `SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`;

    db.get(query, (err, row) => {
        if (err) {
            res.status(500).send("Database error" + err);
            return;
        }
        if (row) {
            req.sql_injection_user = { id: row.id, username: row.username };
            res.redirect('/sql-injection/');
        } else {
            res.send("Login Failed");
        }
    });
};

exports.getSqlInjectionKnowledgePage = (req, res, next) => {
    res.render('sql-injection/knowledge', {
        pageTitle: "SQL Injection Knowledge",
        path: '/sql-injection/knowledge'
    });
};

exports.getSqlInjectionIndexPage = (req, res, next) => {
    const searchQuery = req.body.search || '';

    const dbPath = path.join(__dirname, '..', 'db', 'user-db', req.user.username + '.db');
    const db = new sqlite3.Database(dbPath);

    db.all("SELECT * FROM merchandise WHERE hidden = false", [], (err, rows) => {
        if (err) {
            // Handle the error appropriately
            res.status(500).send("Database error");
            return;
        }

        res.render('sql-injection/index', {
            pageTitle: "SQL Injection",
            path: '/sql-injection',
            merchandise: rows || [],
            search: searchQuery || '',
            userName: req.user.username,
            progress: 0
        });
        db.close();
    });
};

exports.postSqlInjectionIndexPage = (req, res, next) => {
    let query = "SELECT * FROM merchandise";

    // If there's a search query, modify the SQL query for search
    if (req.body.search) {
        query += ` WHERE name LIKE '%${req.body.search}%' AND hidden = false`;
    } else {
        query += ` WHERE hidden = false`;
    }

    const dbPath = path.join(__dirname, '..', 'db', 'user-db', req.user.username + '.db');
    const db = new sqlite3.Database(dbPath);

    const queries = query.split(';').map(statement => statement.trim()).filter(statement => statement.length);
    executeQueries(req, res, db, queries);
};

async function executeQueries(req, res, db, queries) {
    try {
        // First SELECT query
        const firstQuery = queries[0];
        const firstQueryResult = await new Promise((resolve, reject) => {
            db.all(firstQuery, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        // Execute the remaining queries
        for (let i = 1; i < queries.length; i++) {
            const query = queries[i];
            if (query.startsWith('--')) {
                continue;
            }
            await new Promise((resolve, reject) => {
                db.run(query, [], function (err) {
                    if (err) reject(err);
                    resolve(this);
                });
            });
        }

        // Additional db.all call
        const additionalResult = await new Promise((resolve, reject) => {
            db.all("SELECT name FROM sqlite_master WHERE type='table' AND (name=? OR name=?)", 
                ['user', 'merchandise'], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        // Conditional rendering based on additionalResult
        if (additionalResult.length != 2) {
            initializeDatabase(db);
            // Render with different progress if condition is met
            res.render('sql-injection/index', {
                pageTitle: "SQL Injection",
                path: '/sql-injection',
                merchandise: firstQueryResult || [],
                search: req.body.search || '',
                userName: req.user.username,
                progress: 2
            });
        } else {
            // Regular render
            res.render('sql-injection/index', {
                pageTitle: "SQL Injection",
                path: '/sql-injection',
                merchandise: firstQueryResult || [],
                search: req.body.search || '',
                userName: req.user.username,
                progress: 1
            });
        }
    } catch (error) {
        res.status(500).send("Database error" + error);
        return;
    } finally {
        db.close();
    }
}
