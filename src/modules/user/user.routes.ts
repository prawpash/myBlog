import { FastifyInstance } from "fastify";
import { getUserByIdHandler } from "./user.controllers";
import { idSchema } from "../global/global.schema";
import { createUserResponseSchema } from "./user.schemas";

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/:id",
    {
      schema: {
        params: idSchema,
        response: {
          200: createUserResponseSchema,
        },
      },
    },
    getUserByIdHandler
  );
};

export default userRoutes;
