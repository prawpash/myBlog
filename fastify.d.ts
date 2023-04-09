import Fastify from "fastify";

declare module "fastify" {
  interface FastifySchema {
    parse?: any;
  }
}
