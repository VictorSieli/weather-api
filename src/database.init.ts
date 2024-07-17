import { openDb } from "./database";
import { Database } from "sqlite";
import sqlite3 from "sqlite3";

/**
 * Initializes the database by creating necessary tables if they do not exist.
 *
 * @returns {Promise<void>} A promise that resolves when the database initialization is complete.
 */
async function initDb(): Promise<void> {
  try {
    const db: Database<sqlite3.Database, sqlite3.Statement> = await openDb();
    await db.exec(`
      CREATE TABLE IF NOT EXISTS weather_cache (
        location TEXT,
        date TEXT,
        celsius REAL,
        fahrenheit REAL,
        timestamp INTEGER,
        PRIMARY KEY (location, date)
      )
    `);
    await db.close();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error; // Re-throw the error after logging it
  }
}

// Initialize the database and catch any unhandled errors
initDb().catch((error) => {
  console.error("Unhandled error during database initialization:", error);
  process.exit(1);
});
