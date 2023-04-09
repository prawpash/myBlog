import Fastify from "fastify";
import * as dotenv from "dotenv";
dotenv.config();

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
    },
  },
  production: true,
};
const fastify = Fastify({
  logger: envToLogger[process.env.APP_ENV] ?? true,
});

fastify.get("/test", (request, reply) => {
  return reply.send({ message: "Hello" });
});

fastify.listen(
  { host: process.env.APP_HOST, port: process.env.APP_PORT },
  (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }

    fastify.log.info(`Server running on ${address}`);
  }
);
