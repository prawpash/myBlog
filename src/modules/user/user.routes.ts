import { FastifyInstance } from "fastify";
import { getUserByIdHandler } from "./user.controllers";
import { createUserResponseSchema } from "./user.schemas";
import { idSchema } from "../global/global.schema";

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
