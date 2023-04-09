import { FastifyInstance } from "fastify";
import { createImageHandler } from "./image.controllers";

const imageRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/", createImageHandler);
};

export default imageRoutes;
