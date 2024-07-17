import Fastify from "fastify";
import weatherController from "./controllers/weatherController";

const server = Fastify();

server.register(weatherController);

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
