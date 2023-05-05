import prisma from "../../utils/prisma";

export const getAllCategories = async () => {
  return await prisma.category.findMany();
};

export const findCategoryById = async (id: number) => {
  return await prisma.category.findUnique({
    where: {
      id,
    },
  });
};

export const findCategoryByName = async (name: string) => {
  return await prisma.category.findUnique({
    where: {
      name,
    },
  });
};

export const findCategoryByNameExceptThisId = async (
  id: number,
  name: string
) => {
  return await prisma.category.findFirst({
    where: {
      AND: [{ name }, { NOT: { id } }],
    },
  });
};

export const createCategory = async (name: string) => {
  const category = await prisma.category.create({
    data: {
      name,
    },
  });

  return category;
};

export const updateCategory = async (id: number, name: string) => {
  const category = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return category;
};

export const deleteCategory = async (id: number) => {
  const category = await prisma.category.delete({
    where: {
      id,
    },
  });

  return category;
};
