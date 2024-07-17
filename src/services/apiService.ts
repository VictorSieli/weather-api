import axios from "axios";

const API_URL = "https://staging.v4.api.wander.com/hiring-test/weather";

export async function fetchWeather(city: string, date: string) {
  try {
    const response = await axios.post(API_URL, { city: city, date: date });

    return response.data;
  } catch (error) {
    throw error;
  }
}
