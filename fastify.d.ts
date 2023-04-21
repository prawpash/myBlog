import Fastify from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
}
