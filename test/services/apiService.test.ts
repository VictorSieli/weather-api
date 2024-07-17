import { fetchWeather } from "../../src/services/apiService";

jest.mock("axios");

const mockedAxios = require("axios");

describe("API Service", () => {
  it("should fetch weather data", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { celsius: 25 },
    });

    const result = await fetchWeather("London", "2024-07-16");

    expect(result).toEqual({
      celsius: 25,
    });
  });

  it("should handle API errors", async () => {
    mockedAxios.post.mockRejectedValue(new Error("API request failed"));

    await expect(fetchWeather("London", "2024-07-16")).rejects.toThrow(
      "API request failed"
    );
  });
});
