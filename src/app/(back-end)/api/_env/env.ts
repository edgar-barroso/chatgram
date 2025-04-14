import { z } from "zod";

const envSchema = z.object({
  MESSAGE_PER_PAGE: z.coerce.number().min(1).max(200),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  NODE_ENV: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.log(process.env)
    console.error("❌ Invalid environment variables", _env.error.format());

    throw new Error("Invalid enviroment variables.");
}
export default _env.data;

