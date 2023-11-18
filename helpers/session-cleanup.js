const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

const sessionDbPath = path.join(__dirname, '..', 'db', 'sessions.db');
const userDbDirectory = path.join(__dirname, '..', 'db', 'user-db');
const sessionDb = new sqlite3.Database(sessionDbPath);
// TODO: change the code to clean up by usernames 
const cleanUpSessions = () => {
    // Query to find expired sessions
    sessionDb.all("SELECT sid FROM sessions WHERE expires < ?", Date.now(), (err, rows) => {
        if (err) {
            console.error('Error fetching expired sessions', err);
            return;
        }
        rows.forEach(row => {
            let sessionDbFilePath = path.join(userDbDirectory, row.sid + '.db');
            fs.unlink(sessionDbFilePath, (err) => {
                if (err) console.error(`Error deleting database for session ${row.sid}`, err);
                else console.log(`Deleted database for expired session: ${row.sid}`);
            });
        });
    });
};

module.exports = cleanUpSessions;
