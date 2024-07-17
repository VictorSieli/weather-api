import {
  getCachedWeather,
  cacheWeather,
} from "../../src/services/cacheService";
import { openDb } from "../../src/database";

describe("Cache Service", () => {
  beforeAll(async () => {
    const db = await openDb();
    await db.exec(
      "CREATE TABLE IF NOT EXISTS weather_cache (location TEXT, date TEXT, celsius REAL, fahrenheit REAL, timestamp INTEGER, PRIMARY KEY (location, date))"
    );
    await db.close();
  });

  it("should cache weather data", async () => {
    const timestamp = Date.now();
    await cacheWeather("London", "2024-07-16", 25, 77, timestamp);

    const result = await getCachedWeather("London", "2024-07-16");
    expect(result).toEqual({
      location: "London",
      date: "2024-07-16",
      celsius: 25,
      fahrenheit: 77,
      timestamp,
    });
  });

  it("should return null for non-cached data", async () => {
    const result = await getCachedWeather("NonExistinglocation", "2024-07-16");
    expect(result).toBeUndefined();
  });
});
