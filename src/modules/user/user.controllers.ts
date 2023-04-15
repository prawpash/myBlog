import { FastifyReply, FastifyRequest } from "fastify";
import { idInput } from "../global/global.schema";
import { getUserById } from "./user.services";

export const getUserByIdHandler = async (
  request: FastifyRequest<{
    Params: idInput;
  }>,
  reply: FastifyReply
) => {
  const params = request.params;

  const data = await getUserById({ id: params.id });

  if (!data) reply.code(404).send({ message: "User Data Not Found" });

  return reply.send(data);
};
