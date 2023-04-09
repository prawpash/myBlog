import prisma from "../../utils/prisma";
import { idInput } from "../global/global.schema";

export const getUserById = async ({ id }: idInput) => {
  const user = prisma.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};
