import { FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import util from "util";
import { pipeline } from "stream";
import { createWriteStream } from "fs";

const pump = util.promisify(pipeline);
const savedPath = path.join(__dirname, "../../../public/images");

export const createImageHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const imageFile = await request.file();

  if (imageFile) {
    await pump(
      imageFile?.file,
      createWriteStream(`${savedPath}/${imageFile?.filename}`)
    );
  }

  await reply.send({ message: `${savedPath}/${imageFile?.filename}` });
};
