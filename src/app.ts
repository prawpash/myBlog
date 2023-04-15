import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
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

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

});

fastify.register(fastifyMultipart);
fastify.get("/test", (_request, reply) => {
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
