import Fastify from "fastify";
import { ZodError, z } from "zod";
import * as dotenv from "dotenv";
import userRoutes from "./modules/user/user.routes";
import imageRoutes from "./modules/image/image.routes";
import fastifyMultipart from "@fastify/multipart";
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

const ROOT_PREFIX = `/api/v1`;

fastify.setValidatorCompiler(({ schema }) => {
  return (data) => {
    const value = schema.parse(data);
    return { value };
  };
});

fastify.setSerializerCompiler(({ schema }) => {
  return (data) => {
    const value = schema.parse(data);

    return JSON.stringify(value);
  };
});

fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation Error",
      errors: error.issues,
    });
  }

  fastify.log.error(error);
  return reply.send(error);
});

fastify.register(fastifyMultipart);

fastify.get("/test", (request, reply) => {
  return reply.send({ message: "Hello" });
});

fastify.register(userRoutes, { prefix: `${ROOT_PREFIX}/users` });
fastify.register(imageRoutes, { prefix: `${ROOT_PREFIX}/images` });

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
