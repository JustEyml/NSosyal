const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'nsosyal.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS moderation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    original_text TEXT NOT NULL,
    suggested_rewrite TEXT,

    ml_tier INTEGER,
    ml_confidence REAL,
    final_tier INTEGER,
    decided_by TEXT,

    user_action TEXT,
    published_text TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;