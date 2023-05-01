import path from "path";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import * as dotenv from "dotenv";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import userRoutes from "./modules/user/user.routes";
import imageRoutes from "./modules/image/image.routes";
import postRoutes from "./modules/post/post.routes";

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

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../public/"),
  prefix: "/public/",
});

fastify.register(fastifyJwt, {
  secret: {
    private: process.env.PRIVATE_KEY,
    public: process.env.PUBLIC_KEY,
  },
  sign: { algorithm: "RS256", expiresIn: process.env.APP_TOKEN_LIFETIME },
  cookie: {
    cookieName: process.env.APP_COOKIE_TOKEN_NAME,
    signed: false,
  },
});

fastify.register(fastifyCookie);

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      return reply.send(error);
    }
  }
);

fastify.register(fastifyMultipart, {
  limits: {
    fileSize: 1_000_000, // 1MB
  },
  throwFileSizeLimit: true,
});

fastify.get("/test", (_request, reply) => {
  return reply.send({ message: "Hello" });
});

const ROOT_PREFIX = `/api/v1`;

fastify.register(userRoutes, { prefix: `${ROOT_PREFIX}/users` });
fastify.register(imageRoutes, { prefix: `${ROOT_PREFIX}/images` });
fastify.register(postRoutes, { prefix: `${ROOT_PREFIX}/posts` });

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
