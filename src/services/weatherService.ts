import { AxiosError } from "axios";
import { fetchWeather } from "./apiService";
import { getCachedWeather, cacheWeather } from "./cacheService";
import { ErrorHandler, errorHandler } from "../utils/errorHandler";

interface IApiResponse {
  celsius?: number;
  celcius?: number;
  fahrenheit: number;
}

interface WeatherRequest {
  date: string;
  city: string;
}

interface WeatherResponse {
  celsius: number;
  fahrenheit: number;
  date: string;
  city: string;
  timestamp: number;
}

function convertTemperature(apiResponse: IApiResponse): IApiResponse {
  const { celsius, celcius, fahrenheit } = apiResponse;

  // sometimes the api response contains a temperature value named celcius, fot that i'm checking for it here
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

export async function getWeather(
  request: WeatherRequest
): Promise<WeatherResponse> {
  const { city, date } = request;

  const cachedWeather = await getCachedWeather(city, date);

  if (cachedWeather) {
    return cachedWeather;
  }

  try {
    const apiResponse: IApiResponse = await fetchWeather(city, date);

    const { celsius, fahrenheit } = convertTemperature(apiResponse);

    const timestamp = Date.now();

    await cacheWeather(city, date, celsius ?? 0, fahrenheit ?? 0, timestamp);

    return {
      city,
      date,
      celsius: celsius ?? 0,
      fahrenheit: fahrenheit ?? 0,
      timestamp,
    };
  } catch (error) {
    throw error;
  }
}
