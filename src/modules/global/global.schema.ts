import { z } from "zod";

export const idSchema = z.object({
  id: z
    .string()
    .nonempty()
    .transform((val) => parseInt(val)),
});

export const messageSchema = z.object({
  message: z.string(),
});

export type idInput = z.infer<typeof idSchema>;
