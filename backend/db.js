const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'nsosyal.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');


// ======================================================
// NORMAL NSOSYAL MODERATION DATA
// ======================================================

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


// ======================================================
// USABILITY TEST — BEHAVIORAL DATA
// ======================================================

db.exec(`
  CREATE TABLE IF NOT EXISTS usability_test_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    participant_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    scenario_id TEXT NOT NULL,

    original_text TEXT NOT NULL,
    suggested_rewrite TEXT,

    ml_tier INTEGER,
    ml_confidence REAL,
    final_tier INTEGER,
    decided_by TEXT,

    user_action TEXT,
    published_text TEXT,

    response_time_ms INTEGER,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);


// ======================================================
// USABILITY TEST — QUESTIONNAIRE
// ======================================================

db.exec(`
  CREATE TABLE IF NOT EXISTS usability_survey (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    participant_id TEXT NOT NULL,
    session_id TEXT NOT NULL,

    warning_clarity INTEGER,
    rewrite_quality INTEGER,
    intervention_appropriateness INTEGER,
    ease_of_use INTEGER,
    real_platform_acceptance INTEGER,

    confusing_feedback TEXT,
    improvement_feedback TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);


// ======================================================
// EXPORT DATABASE
// ======================================================
// ======================================================
// ADD PARTICIPANT ID COLUMN IF IT DOES NOT EXIST
// ======================================================

const columns = db.prepare("PRAGMA table_info(moderation_logs)").all();

const hasParticipantId = columns.some(
  column => column.name === 'participant_id'
);

if (!hasParticipantId) {
  db.exec(`
    ALTER TABLE moderation_logs
    ADD COLUMN participant_id TEXT
  `);

  console.log("participant_id column added.");
}
module.exports = db;