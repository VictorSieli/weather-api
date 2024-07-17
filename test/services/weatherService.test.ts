import { getWeather } from "../../src/services/weatherService";
import * as apiService from "../../src/services/apiService";
import * as cacheService from "../../src/services/cacheService";

jest.mock("../../src/services/apiService");
jest.mock("../../src/services/cacheService");

const mockedApiService = apiService as jest.Mocked<typeof apiService>;
const mockedCacheService = cacheService as jest.Mocked<typeof cacheService>;

describe("Weather Service", () => {
  it("should return cached weather data if available", async () => {
    const timestamp = Date.now();
    mockedCacheService.getCachedWeather.mockResolvedValue({
      city: "London",
      date: "2024-07-16",
      celsius: 25,
      fahrenheit: 77,
      timestamp,
    });

    const result = await getWeather({ city: "London", date: "2024-07-16" });

    expect(result).toEqual({
      city: "London",
      date: "2024-07-16",
      celsius: 25,
      fahrenheit: 77,
      timestamp,
    });
    expect(mockedApiService.fetchWeather).not.toHaveBeenCalled();
  });

  it("should fetch and cache weather data if not available in cache", async () => {
    mockedCacheService.getCachedWeather.mockResolvedValue(undefined);
    mockedApiService.fetchWeather.mockResolvedValue({ fahrenheit: 77 });
    mockedCacheService.cacheWeather.mockResolvedValue(undefined);

    const timestamp = Date.now();

    const result = await getWeather({ city: "London", date: "2024-07-16" });

    expect(result).toEqual({
      city: "London",
      date: "2024-07-16",
      celsius: 25,
      fahrenheit: 77,
      timestamp,
    });

    expect(mockedApiService.fetchWeather).toHaveBeenCalledWith(
      "London",
      "2024-07-16"
    );

    expect(mockedCacheService.cacheWeather).toHaveBeenCalledWith(
      "London",
      "2024-07-16",
      25,
      77,
      timestamp
    );
  });
});
