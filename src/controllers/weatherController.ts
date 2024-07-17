import { FastifyInstance } from "fastify";
import { getWeather } from "../services/weatherService";
import { errorHandler } from "../utils/errorHandler";

export default async function weatherController(fastify: FastifyInstance) {
  fastify.get("/weather", async (request, reply) => {
    try {
      validateRequest(request);

      const { city, date } = request.query as { city: string; date: string };

      const data = await getWeather({ city, date });

      reply.send(data);
    } catch (error: any) {
      const { message, status } = errorHandler(error);
      reply.status(status).send({ message });
    }
  });

  function validateRequest(request: any) {
    const { city, date } = request.query as { city: string; date: string };

    if (!city) {
      throw new Error("Missing city property.");
    }

    if (!date) {
      throw new Error("Missing date property.");
    }

    if (isNaN(new Date(date).getTime())) {
      throw new Error("Invalid date format.");
    }

    if (new Date(date).getTime() > Date.now()) {
      throw new Error("Date is in the future.");
    }
  }
}
