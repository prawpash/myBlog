import { FastifyReply, FastifyRequest } from "fastify";
import { idInput } from "../global/global.schema";
import { findUserByEmail, getUserById } from "./user.services";
import { loginInput } from "./user.schemas";
import { verifyPassword } from "../../utils/hash";
import { generateRandomId } from "../../utils/helper";

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

export const loginHandler = async (
  request: FastifyRequest<{
    Body: loginInput;
  }>,
  reply: FastifyReply
) => {
  const body = request.body;

  const user = await findUserByEmail(body.email);

  if (!user)
    return reply.code(401).send({ message: "Email or Password is incorrect" });

  const isPasswordMatch = await verifyPassword(body.password, user.password);

  if (!isPasswordMatch)
    return reply.code(401).send({ message: "Email or Password is incorrect" });

  const { id, name } = user;

  const access_token = await reply.jwtSign({ id, name });

  const refresh_token_content = await generateRandomId();

  const refresh_token = await reply.jwtSign(
    {
      content: `${refresh_token_content}${user.id}`,
    },
    { expiresIn: process.env.APP_REFRESH_TOKEN_LIFETIME }
  );

  const cookieExpires = new Date(Date.now() + 15 * 60000); // 15 menit

  return reply
    .setCookie(process.env.APP_COOKIE_TOKEN_NAME, access_token, {
      domain: process.env.APP_HOST,
      path: "/",
      secure: process.env.APP_ENV == "production" ? true : false,
      httpOnly: true,
      sameSite: true,
      expires: cookieExpires,
    })
    .send({ access_token, refresh_token });
};
