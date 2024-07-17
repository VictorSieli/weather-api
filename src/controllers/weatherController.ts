import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getWeather } from "../services/weatherService";
import { errorHandler } from "../utils/errorHandler";

/**
 * Registers the weather controller with the Fastify instance.
 *
 * @param {FastifyInstance} fastify - The Fastify instance.
 */
export default async function weatherController(fastify: FastifyInstance) {
  fastify.get(
    "/weather",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        validateRequest(request);

        const { location, date } = request.query as {
          location: string;
          date: string;
        };

        const data = await getWeather({ location, date });

        reply.send(data);
      } catch (error: any) {
        const { message, status } = errorHandler(error);
        reply.status(status).send({ message });
      }
    }
  );
}

/**
 * Validates the incoming request for required parameters.
 *
 * @param {FastifyRequest} request - The incoming request object.
 * @throws {Error} Throws an error if validation fails.
 */
function validateRequest(request: FastifyRequest) {
  const { location, date } = request.query as {
    location: string;
    date: string;
  };

  if (!location) {
    throw new Error("Missing location property.");
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
