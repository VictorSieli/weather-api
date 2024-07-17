import { fetchWeather } from "./apiService";
import { getCachedWeather, cacheWeather } from "./cacheService";

interface IApiResponse {
  celsius?: number;
  celcius?: number;
  fahrenheit: number;
}

interface WeatherRequest {
  date: string;
  location: string;
}

interface WeatherResponse {
  celsius: number;
  fahrenheit: number;
  date: string;
  location: string;
  timestamp: number;
}

/**
 * Converts the API response temperature to a standard format.
 *
 * @param {IApiResponse} apiResponse - The API response containing temperature data.
 * @returns {IApiResponse} The standardized temperature data.
 */
function convertTemperature(apiResponse: IApiResponse): IApiResponse {
  const { celsius, celcius, fahrenheit } = apiResponse;

  // sometimes the API response contains a temperature value named celcius
  const celsiusValue = celsius ?? celcius;

  if (celsiusValue) {
    return {
      celsius: +celsiusValue.toFixed(2),
      fahrenheit: +((celsiusValue * 9) / 5 + 32).toFixed(2),
    };
  } else {
    return {
      celsius: +(((fahrenheit - 32) * 5) / 9).toFixed(2),
      fahrenheit: +fahrenheit.toFixed(2),
    };
  }
}

/**
 * Retrieves weather data, using the cache if available.
 *
 * @param {WeatherRequest} request - The weather request containing location and date.
 * @returns {Promise<WeatherResponse>} A promise that resolves to the weather data.
 * @throws {Error} Throws an error if the API request or database operations fail.
 */
export async function getWeather(
  request: WeatherRequest
): Promise<WeatherResponse> {
  const { location, date } = request;

  const cachedWeather = await getCachedWeather(location, date);

  if (cachedWeather) {
    return cachedWeather;
  }

  try {
    const apiResponse: IApiResponse = await fetchWeather(location, date);
    const { celsius, fahrenheit } = convertTemperature(apiResponse);
    const timestamp = Date.now();

    await cacheWeather(
      location,
      date,
      celsius ?? 0,
      fahrenheit ?? 0,
      timestamp
    );

    return {
      location,
      date,
      celsius: celsius ?? 0,
      fahrenheit: fahrenheit ?? 0,
      timestamp,
    };
  } catch (error) {
    console.error("Error retrieving weather data:", error);
    throw error;
  }
}
