import prisma from "../../utils/prisma";

export const createImage = async ({ fileName }: { fileName: string }) => {
  const image = await prisma.image.create({
    data: {
      file_name: fileName,
    },
  });

  return image;
};

export const findImageByName = async ({ name }: { name: string }) => {
  return await prisma.image.findFirst({
    where: {
      file_name: name,
    },
  });
};

export const findImageById = async (id: number) => {
  return await prisma.image.findUnique({
    where: {
      id,
    },
  });
};
