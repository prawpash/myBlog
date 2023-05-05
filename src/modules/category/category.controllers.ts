import { FastifyReply, FastifyRequest } from "fastify";
import { createCategoryInput } from "./category.schemas";
import {
  createCategory,
  deleteCategory,
  findCategoryById,
  findCategoryByName,
  findCategoryByNameExceptThisId,
  getAllCategories,
  updateCategory,
} from "./category.services";
import { idInput } from "../global/global.schema";

export const getAllCategoriesHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const categories = await getAllCategories();

  return reply.send({ categories });
};

export const getCategoryByIdHandler = async (
  request: FastifyRequest<{
    Params: idInput;
  }>,
  reply: FastifyReply
) => {
  const params = request.params;

  const category = await findCategoryById(params.id);

  if (!category) return reply.code(404).send({ message: "Category Not Found" });

  return category;
};
export const createCategoryHandler = async (
  request: FastifyRequest<{
    Body: createCategoryInput;
  }>,
  reply: FastifyReply
) => {
  const body = request.body;

  // check if category name is exist
  const isCategoryExist = await findCategoryByName(body.name);

  if (!isCategoryExist) {
    const category = await createCategory(body.name);

    return reply.code(201).send(category);
  }

  return reply.code(419).send({ message: "The category name already exists." });
};

export const updateCategoryHandler = async (
  request: FastifyRequest<{
    Params: idInput;
    Body: createCategoryInput;
  }>,
  reply: FastifyReply
) => {
  const params = request.params;
  const body = request.body;

  const category = await findCategoryById(params.id);

  if (!category) return reply.code(404).send({ message: "Category Not Found" });

  // check if category name is exist except this data
  const isCategoryExist = await findCategoryByNameExceptThisId(
    params.id,
    body.name
  );

  if (isCategoryExist)
    return reply
      .code(419)
      .send({ message: "The category name already exists." });

  const updatedCategory = await updateCategory(params.id, body.name);

  return reply.send(updatedCategory);
};

export const deleteCategoryHandler = async (
  request: FastifyRequest<{
    Params: idInput;
  }>,
  reply: FastifyReply
) => {
  const params = request.params;

  const category = await findCategoryById(params.id);

  if (!category) return reply.code(404).send({ message: "Category Not Found" });

  const deletedCategory = await deleteCategory(params.id);

  return reply.send({ message: "The category has been successfully deleted" });
};
