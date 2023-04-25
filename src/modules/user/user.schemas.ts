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

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const loginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export type loginInput = z.infer<typeof loginSchema>;

export type createUserInput = z.infer<typeof createUserSchema>;
