import { FastifyInstance } from "fastify";
import { createImageHandler } from "./image.controllers";
import { createImageResponseSchema } from "./image.schemas";

const imageRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    "/",
    {
      schema: {
        response: {
          201: createImageResponseSchema,
        },
      },
    },
    createImageHandler
  );
};

export default imageRoutes;
