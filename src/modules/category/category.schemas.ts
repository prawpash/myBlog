import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string(),
});

export const createCategoryResponseSchema = createCategorySchema.merge(
  z.object({
    id: z.number(),
  })
);

export type createCategoryInput = z.infer<typeof createCategorySchema>;
