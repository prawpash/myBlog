import { FastifyInstance } from "fastify";
import { createImageHandler, getImageByIdHandler } from "./image.controllers";
import { createImageResponseSchema } from "./image.schemas";
import { idSchema } from "../global/global.schema";

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

  fastify.get(
    "/:id",
    {
      schema: {
        params: idSchema,
        response: {
          200: createImageResponseSchema,
        },
      },
    },
    getImageByIdHandler
  );
};

export default imageRoutes;
