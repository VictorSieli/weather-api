import Fastify, { FastifyInstance, FastifyError } from "fastify";
import weatherController from "./controllers/weatherController";

/**
 * Initializes and configures the Fastify server instance.
 *
 * @returns {FastifyInstance} The configured Fastify server instance.
 */
const createServer = (): FastifyInstance => {
  const server: FastifyInstance = Fastify();
  server.register(weatherController);
  return server;
};

const server: FastifyInstance = createServer();

/**
 * Starts the Fastify server on the specified port and host.
 */
const startServer = async (): Promise<void> => {
  try {
    const address = await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

startServer();
