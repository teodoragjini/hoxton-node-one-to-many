import Database from "better-sqlite3";
const db = Database('./db/data.db',{ verbose: console.log })

const createMuseumsTable = db.prepare(``)