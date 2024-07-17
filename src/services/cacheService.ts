import { openDb } from "../database";

interface WeatherCache {
  location: string;
  date: string;
  celsius: number;
  fahrenheit: number;
  timestamp: number;
}

export type CacheResponse = WeatherCache | undefined;

/**
 * Retrieves cached weather data from the database.
 *
 * @param {string} location - The location to retrieve cached weather data for.
 * @param {string} date - The date to retrieve cached weather data for.
 * @returns {Promise<CacheResponse>} A promise that resolves to the cached weather data or undefined if not found.
 * @throws {Error} Throws an error if the database operation fails.
 */
export async function getCachedWeather(
  location: string,
  date: string
): Promise<CacheResponse> {
  const db = await openDb();

  try {
    const result = await db.get(
      "SELECT * FROM weather_cache WHERE location = ? AND date = ?",
      [location, date]
    );

    if (!result) {
      return undefined;
    }

    const currentTime = Date.now();

    if (currentTime - result.timestamp < 10000) {
      // 10 seconds expiration
      return result;
    } else {
      await db.run(
        "DELETE FROM weather_cache WHERE location = ? AND date = ?",
        [location, date]
      );
      return undefined;
    }
  } catch (error) {
    console.error("Error retrieving cached weather data:", error);
    throw error;
  } finally {
    await db.close();
  }
}

/**
 * Caches weather data in the database.
 *
 * @param {string} location - The location of the weather data.
 * @param {string} date - The date of the weather data.
 * @param {number} celsius - The temperature in Celsius.
 * @param {number} fahrenheit - The temperature in Fahrenheit.
 * @param {number} timestamp - The timestamp of the data.
 * @returns {Promise<void>} A promise that resolves when the data is cached.
 * @throws {Error} Throws an error if the database operation fails.
 */
export async function cacheWeather(
  location: string,
  date: string,
  celsius: number,
  fahrenheit: number,
  timestamp: number
): Promise<void> {
  const db = await openDb();

  try {
    await db.run(
      "INSERT OR REPLACE INTO weather_cache (location, date, celsius, fahrenheit, timestamp) VALUES (?, ?, ?, ?, ?)",
      [location, date, celsius, fahrenheit, timestamp]
    );
  } catch (error) {
    console.error("Error caching weather data:", error);
    throw error;
  } finally {
    await db.close();
  }
}
