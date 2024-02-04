import { Status } from "@prisma/client";
import prisma from "../../utils/prisma";
import { createPostInput, updatePostInput } from "./post.schemas";

export const createPost = async (data: createPostInput, userId: number) => {
  const categories: Array<{
    where: { name: string };
    create: { name: string };
  }> = [];

  data.categories.forEach((category) => {
    categories.push({
      where: { name: category.name },
      create: { name: category.name },
    });
  });

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      thumbnail: data.thumbnail,
      content: data.content,
      owner_id: userId,
      linked_images: data.linked_images ?? "",
      status: data.status == "DRAFT" ? Status.DRAFT : Status.PUBLISH,
      categories: {
        connectOrCreate: categories,
      },
    },
    include: {
      categories: true,
    },
  });

  return post;
};

export const updatePost = async (data: updatePostInput, id: number) => {
  const categories: Array<{
    where: { name: string };
    create: { name: string };
  }> = [];

  if (data?.categories) {
    data.categories.forEach((category) => {
      categories.push({
        where: { name: category.name },
        create: { name: category.name },
      });
    });
  }

  const post = await prisma.post.update({
    where: {
      id,
    },
    data: {
      ...(data?.title && { title: data.title }),
      ...(data?.slug && { slug: data.slug }),
      ...(data?.thumbnail && { thumbnail: data.thumbnail }),
      ...(data?.content && { content: data.content }),
      ...(data?.linked_images && { linked_images: data.linked_images }),
      ...(data?.status && { status: data.status }),
      categories: {
        connectOrCreate: categories,
      },
    },
    include: {
      categories: true,
    },
  });

  return post;
};

export const deletePost = async (id: number) => {
  const post = await prisma.post.delete({
    where: {
      id,
    },
  });

  return post;
};

export const findPostByQuery = async ({
  title,
  categories,
}: {
  title?: string;
  categories?: Array<{ id: number }>;
}) => {
  const posts = await prisma.post.findMany({
    where: {
      ...(title && { title: { contains: title } }),
      ...(categories && { categories: { some: { AND: categories } } }),
    },
    orderBy: {
      updated_at: "desc"
    }
  });

  return posts;
};

export const findPostBySlug = async (slug: string) => {
  return await prisma.post.findFirst({
    where: {
      slug,
    },
  });
};

export const findPostById = async (id: number) => {
  return await prisma.post.findUnique({
    where: {
      id,
    },
  });
};
