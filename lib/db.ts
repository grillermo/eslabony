import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data');
const dbFile = path.join(dbPath, 'links.db');

// Ensure data directory exists
const fs = require('fs');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

const db = new Database(dbFile);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    note TEXT,
    read INTEGER DEFAULT 0,
    timestamp INTEGER NOT NULL
  )
`);

export default db;
