import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  profile_picture: z.string().nullable(),
});

export const createUserResponseSchema = createUserSchema.omit({
  password: true,
});

export type createUserInput = z.infer<typeof createUserSchema>;
