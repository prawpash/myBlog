import { FastifyInstance } from "fastify";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getAllCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
} from "./category.controllers";
import { createCategorySchema } from "./category.schemas";
import { idSchema } from "../global/global.schema";

const categoryRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", getAllCategoriesHandler);

  fastify.post(
    "/",
    {
      schema: {
        body: createCategorySchema,
      },
    },
    createCategoryHandler
  );

  fastify.get(
    "/:id",
    {
      schema: {
        params: idSchema,
      },
    },
    getCategoryByIdHandler
  );

  fastify.put(
    "/:id",
    {
      schema: {
        params: idSchema,
        body: createCategorySchema,
      },
    },
    updateCategoryHandler
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idSchema,
      },
    },
    deleteCategoryHandler
  );
};

export default categoryRoutes;
