import { FastifyReply, FastifyRequest } from "fastify";
import {
  createPostInput,
  searchPostInput,
  updatePostInput,
} from "./post.schemas";
import {
  createPost,
  deletePost,
  findPostById,
  findPostByQuery,
  findPostBySlug,
  updatePost,
} from "./post.services";
import { idInput } from "../global/global.schema";

export const createPostHandler = async (
  request: FastifyRequest<{
    Body: createPostInput;
  }>,
  reply: FastifyReply
) => {
  const body = request.body;
  const user = request.user;

  let isSlugDuplicate = await findPostBySlug(body.slug);
  let newSlug = body.slug;
  let counter = 0;

  while (isSlugDuplicate) {
    // Limit loop jika slug masih saja duplikat untuk kedua kalinya
    if (counter > 0) {
      //throw new Error("Something went wrong, try again later.");
      throw new Error("Please define the slug.");
    }

    const now = new Date();
    // membuat slug baru dengan menambahkan tanggal
    newSlug += `-${now.getDate()}-${now.getMonth()}-${now.getFullYear()}`;
    isSlugDuplicate = await findPostBySlug(newSlug);
    counter++;
  }

  body.slug = newSlug;

  const post = await createPost(body, user.id);
  request.log.info(post);

  return reply.code(201).send(post);
};

export const updatePostHandler = async (
  request: FastifyRequest<{
    Params: idInput;
    Body: updatePostInput;
  }>,
  reply: FastifyReply
) => {
  const user = request.user;
  const body = request.body;
  const params = request.params;

  const post = await findPostById(params.id);

  if (!post) return reply.code(404).send({ message: "Post Data Not Found" });

  //is this the right owner
  if (post.owner_id != user.id)
    return reply
      .code(401)
      .send({ message: "You don't have permission to change this data." });

  const updatedPost = await updatePost(body, params.id);

  return reply.send(updatedPost);
};

export const deletePostHandler = async (
  request: FastifyRequest<{
    Params: idInput;
  }>,
  reply: FastifyReply
) => {
  const user = request.user;
  const params = request.params;

  const post = await findPostById(params.id);

  if (!post) return reply.code(404).send({ message: "Post Data Not Found" });

  //is this the right owner
  if (post.owner_id != user.id)
    return reply
      .code(401)
      .send({ message: "You don't have permission to delete this data." });

  const deletedPost = await deletePost(params.id);

  return reply.send({ message: "Your post has been successfully deleted" });
};

export const getPostByIdHandler = async (
  request: FastifyRequest<{
    Params: idInput;
  }>,
  reply: FastifyReply
) => {
  const params = request.params;

  const post = await findPostById(params.id);

  if (!post) return reply.code(404).send({ message: "Post Data Not Found" });

  return post;
};

export const getPostBySlugHandler = async (
  request: FastifyRequest<{
    Params: {
      slug: string;
    };
  }>,
  reply: FastifyReply
) => {
  const params = request.params;

  const post = await findPostBySlug(params.slug);

  if (!post) return reply.code(404).send({ message: "Post Data Not Found" });

  return post;
};

export const getAllPostsHandler = async (
  request: FastifyRequest<{
    Querystring: searchPostInput;
  }>,
  reply: FastifyReply
) => {
  const { title, categories } = request.query;

  const formattedCategories: Array<{ id: number }> = [];

  if (categories)
    categories
      .split(",")
      .forEach((categoryId) =>
        formattedCategories.push({ id: parseInt(categoryId) })
      );

  const posts = await findPostByQuery({
    title,
    categories: formattedCategories,
  });

  return reply.send(posts);
};
