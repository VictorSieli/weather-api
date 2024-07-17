import axios from "axios";

const API_URL = "https://staging.v4.api.wander.com/hiring-test/weather";

/**
 * Fetches weather data from the external API.
 *
 * @param {string} location - The location to fetch weather data for.
 * @param {string} date - The date to fetch weather data for.
 * @returns {Promise<any>} A promise that resolves to the weather data.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function fetchWeather(
  location: string,
  date: string
): Promise<any> {
  try {
    const response = await axios.post(API_URL, { city: location, date: date });
    return response.data;
  } catch (error) {
    throw error;
  }
}
