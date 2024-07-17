import { AxiosError } from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export interface ErrorHandler {
  message: string;
  status: number;
}

export function errorHandler(error: any): ErrorHandler {
  console.error("ERROR:", error.response?.message ?? error.message);

  if (error instanceof AxiosError) {
    if (error.response?.status === 418) {
      return {
        message: "An error ocurred while fetching weather, please try again.",
        status: 422,
      };
    } else if (error.response?.status === 429) {
      return {
        message: `You've reached the API rate limit. Please wait a bit and try again.`,
        status: 429,
      };
    } else {
      return {
        message: "An Unexpected error ocurred, please try again later.",
        status: 500,
      };
    }
  } else {
    if (
      error.message === "Date is in the future." ||
      error.message === "Missing city property." ||
      error.message === "Missing date property." ||
      error.message === "Invalid date format."
    ) {
      return {
        message: error.message,
        status: 400,
      };
    } else {
      return {
        message: "An Unexpected error ocurred, please try again later.",
        status: 500,
      };
    }
  }
}

export function registerErrorHandler(server: FastifyInstance) {
  server.setErrorHandler(errorHandler);
}
