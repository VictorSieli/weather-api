import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

/**
 * Opens a connection to the SQLite database.
 *
 * @returns {Promise<Database>} A promise that resolves to the database connection.
 */
export async function openDb(): Promise<
  Database<sqlite3.Database, sqlite3.Statement>
> {
  return open({
    filename: "./weather.db",
    driver: sqlite3.Database,
  });
}
