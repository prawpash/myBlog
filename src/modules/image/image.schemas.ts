import { z } from "zod";

export const createImageResponseSchema = z.object({
  id: z.number(),
  file_name: z.string(),
});
