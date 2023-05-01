import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().max(255),
  slug: z.string(),
  thumbnail: z.number().optional().nullable(),
  content: z.string(),
  linked_images: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISH"]).default("DRAFT"),
  categories: z.array(
    z.object({
      name: z.string(),
    })
  ),
});

export const createPostResponseSchema = createPostSchema.merge(
  z.object({
    id: z.number(),
  })
);

export const searchPostSchema = z.object({
  title: z.string().optional(),
  categories: z.string().optional(),
});

export type searchPostInput = z.infer<typeof searchPostSchema>;

export type createPostInput = z.infer<typeof createPostSchema>;
