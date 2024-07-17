import { AxiosError } from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export interface ErrorHandler {
  message: string;
  status: number;
}

/**
 * Handles different types of errors and returns a standardized error response.
 *
 * @param {any} error - The error object to handle.
 * @returns {ErrorHandler} An object containing the error message and status code.
 */
export function errorHandler(error: any): ErrorHandler {
  if (error instanceof AxiosError) {
    switch (error.response?.status) {
      case 418:
        return {
          message:
            "An error occurred while fetching weather, please try again.",
          status: 422,
        };
      case 429:
        return {
          message: `You've reached the API rate limit. Please wait a bit and try again.`,
          status: 429,
        };
      default:
        return {
          message: "An unexpected error occurred, please try again later.",
          status: 500,
        };
    }
  } else {
    switch (error.message) {
      case "Date is in the future.":
      case "Missing location property.":
      case "Missing date property.":
      case "Invalid date format.":
        return {
          message: error.message,
          status: 400,
        };
      default:
        return {
          message: "An unexpected error occurred, please try again later.",
          status: 500,
        };
    }
  }
}

/**
 * Registers the error handler with the Fastify server instance.
 *
 * @param {FastifyInstance} server - The Fastify server instance.
 */
export function registerErrorHandler(server: FastifyInstance): void {
  server.setErrorHandler(
    (error: any, request: FastifyRequest, reply: FastifyReply) => {
      const { message, status } = errorHandler(error);
      reply.status(status).send({ error: message });
    }
  );
}
