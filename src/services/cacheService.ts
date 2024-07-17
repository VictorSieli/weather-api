import { openDb } from "../database";

interface WeatherCache {
  city: string;
  date: string;
  celsius: number;
  fahrenheit: number;
  timestamp: number;
}

export type CacheResponse = WeatherCache | undefined;

export async function getCachedWeather(
  city: string,
  date: string
): Promise<CacheResponse> {
  const db = await openDb();

  const result = await db.get(
    "SELECT * FROM weather_cache WHERE city = ? AND date = ?",
    [city, date]
  );

  if (!result) {
    await db.close();
    return undefined;
  }

  const currentTime = Date.now();

  if (currentTime - result.timestamp < 10000) {
    // 10 seconds expiration
    await db.close();
    return result;
  } else {
    try {
      db.run(`DELETE FROM weather_cache WHERE city = ? AND date = ?`, [
        city,
        date,
      ]);

      await db.close();
      return undefined;
    } catch (error) {
      await db.close();
      throw error;
    }
  }
}

export async function cacheWeather(
  city: string,
  date: string,
  celsius: number,
  fahrenheit: number,
  timestamp: number
) {
  const db = await openDb();

  await db.run(
    "INSERT OR REPLACE INTO weather_cache (city, date, celsius, fahrenheit, timestamp) VALUES (?, ?, ?, ?, ?)",
    [city, date, celsius, fahrenheit, timestamp]
  );

  await db.close();
}
