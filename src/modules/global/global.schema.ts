import { z } from "zod";

export const idSchema = z.object({
  id: z.string().transform((val) => parseInt(val)),
});

export type idInput = z.infer<typeof idSchema>;
