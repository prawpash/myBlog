import { z } from "zod";

const envSchema = z.object({
  APP_PORT: z.number(),
  APP_ENV: z.enum(["development", "production"]),
  APP_HOST: z.string(),
  PRIVATE_KEY: z.string(),
  PUBLIC_KEY: z.string(),
});

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
