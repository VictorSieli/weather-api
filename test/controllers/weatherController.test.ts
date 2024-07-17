import fastify, { FastifyInstance } from "fastify";
import weatherController from "../../src/controllers/weatherController";
import { getWeather } from "../../src/services/weatherService";

jest.mock("../../src/services/weatherService");

describe("weatherController", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify();
    await app.register(weatherController);
  });

  beforeEach(async () => {
    jest.useRealTimers();
  });

  afterAll(() => {
    app.close();
  });

  it("should return weather data when both city and date are provided", async () => {
    const city = "New York";
    const date = "2024-07-17";

    const weatherData = {
      city,
      date,
      celsius: 25,
      fahrenehit: 77,
    };

    (getWeather as jest.Mock).mockResolvedValue(weatherData);

    const response = await app.inject({
      method: "GET",
      url: "/weather",
      query: {
        city,
        date,
      },
    });

    expect(response.statusCode).toBe(200);

    expect(JSON.parse(response.body)).toEqual(weatherData);

    expect(getWeather).toHaveBeenCalledWith({ city, date });
  });

  it("should return 400 status and error message when city is missing", async () => {
    const date = "2024-07-17";

    let response = await app.inject({
      method: "GET",
      url: "/weather",
      query: {
        date,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      message: "Missing city property.",
    });
  });

  it("should return 400 status and error message when date is missing", async () => {
    const city = "New York";

    let response = await app.inject({
      method: "GET",
      url: "/weather",
      query: {
        city,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      message: "Missing date property.",
    });
  });

  it("should return 400 status and error message when date is invalid", async () => {
    const city = "New York";
    const date = "invalid-date-format";

    jest
      .useFakeTimers({ advanceTimers: true } as any)
      .setSystemTime(new Date("2024-07-16 10:00:00"));

    let response = await app.inject({
      method: "GET",
      url: "/weather",
      query: {
        city,
        date,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      message: "Invalid date format.",
    });
  });

  it("should return 400 status and error message when date is in the future", async () => {
    const city = "New York";
    const date = "2024-07-21";

    jest
      .useFakeTimers({ advanceTimers: true } as any)
      .setSystemTime(new Date("2024-07-16 10:00:00"));

    let response = await app.inject({
      method: "GET",
      url: "/weather",
      query: {
        city,
        date,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      message: "Date is in the future.",
    });
  });

  it("should return 500 status and error message when getWeather throws an error", async () => {
    const city = "New York";
    const date = "2024-07-17";
    const errorMessage = "Any error";

    (getWeather as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const response = await app.inject({
      method: "GET",
      url: "/weather",
      query: {
        city,
        date,
      },
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      message: "An Unexpected error ocurred, please try again later.",
    });
  });
});
