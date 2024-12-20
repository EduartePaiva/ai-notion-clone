import { createEnv } from "@t3-oss/env-nextjs";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { ZodError, z } from "zod";

expand(config());

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "production"]),
        DATABASE_URL: z.string().url(),
        DB_HOST: z.string(),
        DB_USER: z.string(),
        DB_PASSWORD: z.string(),
        DB_NAME: z.string(),
        DB_PORT: z.coerce.number(),
        DB_MIGRATING: z
            .string()
            .refine((s) => s === "true" || s === "false")
            .transform((s) => s === "true")
            .optional(),
        LIVEBLOCKS_PRIVATE_KEY: z.string(),
    },
    onValidationError: (error: ZodError) => {
        console.error(
            "❌ Invalid environment variables:",
            error.flatten().fieldErrors
        );
        process.exit(1);
    },
    emptyStringAsUndefined: true,
    // eslint-disable-next-line n/no-process-env
    experimental__runtimeEnv: process.env,
});