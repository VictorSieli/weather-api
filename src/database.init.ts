import { openDb } from "./database";

async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS weather_cache (
      city TEXT,
      date TEXT,
      celsius REAL,
      fahrenheit REAL,
      timestamp INTEGER,
      PRIMARY KEY (city, date)
    )
  `);
  await db.close();
}

initDb().catch(console.error);
