import { FastifyInstance } from "fastify";
import {
  createPostHandler,
  deletePostHandler,
  getAllPostsHandler,
  getPostBySlugHandler,
  updatePostHandler,
} from "./post.controllers";
import {
  createPostResponseSchema,
  createPostSchema,
  updatePostSchema,
} from "./post.schemas";
import { idSchema, messageSchema } from "../global/global.schema";

const postRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/",
    {
      schema: {},
    },
    getAllPostsHandler
  );

  fastify.post(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: createPostSchema,
        response: {
          201: createPostResponseSchema,
        },
      },
    },
    createPostHandler
  );

  fastify.put(
    "/:id",
    {
      onRequest: [fastify.authenticate],
      schema: {
        params: idSchema,
        body: updatePostSchema,
        response: {
          200: createPostResponseSchema,
        },
      },
    },
    updatePostHandler
  );

  fastify.delete(
    "/:id",
    {
      onRequest: [fastify.authenticate],
      schema: {
        params: idSchema,
        response: {
          200: messageSchema,
        },
      },
    },
    deletePostHandler
  );

  fastify.get("/slug/:slug", getPostBySlugHandler);
};

export default postRoutes;
