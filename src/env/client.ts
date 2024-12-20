/* eslint-disable n/no-process-env */
import { createEnv } from "@t3-oss/env-nextjs";
import { ZodError, z } from "zod";

export const env = createEnv({
    client: {
        NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY: z.string(),
        NEXT_PUBLIC_BASE_URL: z.string(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY:
            process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    },
    onValidationError: (error: ZodError) => {
        console.error(
            "❌ Invalid environment variables:",
            error.flatten().fieldErrors
        );
        process.exit(1);
    },
});
