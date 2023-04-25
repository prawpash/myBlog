import { FastifyInstance } from "fastify";
import { getUserByIdHandler, loginHandler } from "./user.controllers";
import {
  createUserResponseSchema,
  loginResponseSchema,
  loginSchema,
} from "./user.schemas";
import { idSchema } from "../global/global.schema";

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    "/login",
    {
      schema: {
        body: loginSchema,
        response: {
          200: loginResponseSchema,
        },
      },
    },
    loginHandler
  );
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
