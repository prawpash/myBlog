import { FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { generateRandomId } from "../../utils/helper";
import { createImage, findImageByName } from "./image.services";
import { copyFile } from "fs/promises";

const savedPath = path.join(__dirname, "../../../public/images");

export const createImageHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const files = await request.saveRequestFiles();

  let counter = 0;

  while (counter < 3) {
    const randomId = await generateRandomId();

    const isDataExists = await findImageByName({ name: randomId });

    if (!isDataExists) {
      if (files.length > 0) {
        try {
          const fileExtension = files[0].mimetype.split("/")[1];

          const tempFilePath = files[0].filepath;
          const newFileName = `${randomId}.${fileExtension}`;
          const newFilePath = path.join(savedPath, newFileName);

          await copyFile(tempFilePath, newFilePath);

          const image = await createImage({ fileName: newFileName });

          return reply.code(201).send(image);
        } catch (error) {
          return reply.code(500).send({
            message: "Something went wrong when try to saving image.",
          });
        }
      }
      break;
    }
    counter++;
  }
  throw new Error("Something went wrong, try again later.");
};
