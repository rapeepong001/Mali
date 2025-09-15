const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'data', 'memory.db');
const fs = require('fs');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new sqlite3.Database(dbPath);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, data TEXT, updated INTEGER)`);
});

function saveUserName(name, extra = {}) {
  const now = Date.now();
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(extra || {});
    db.run(`INSERT INTO users (name, data, updated) VALUES (?, ?, ?) ON CONFLICT(name) DO UPDATE SET data=excluded.data, updated=excluded.updated`, [name, data, now], function(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, name, data: extra, updated: now });
    });
  });
}

function getUserByName(name) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE name = ?`, [name], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve(null);
      try { row.data = JSON.parse(row.data || '{}'); } catch(e) { row.data = {}; }
      resolve(row);
    });
  });
}

module.exports = { saveUserName, getUserByName };
