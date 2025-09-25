import { config } from "dotenv";
import { z } from "zod";

config(); // Load environment variables from .env file

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables");
}

if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
  throw new Error("Missing Discord OAuth environment variables");
}

export const env = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
};

if (process.env.SKIP_ENV_VALIDATION !== "true") {
  import("@t3-oss/env-nextjs")
    .then(({ createEnv }) => {
      createEnv({
        server: {
          DATABASE_URL: z.string().url(),
          NEXTAUTH_SECRET: z.string(),
          NEXTAUTH_URL: z.string().url(),
          DISCORD_CLIENT_ID: z.string(),
          DISCORD_CLIENT_SECRET: z.string(),
          GOOGLE_CLIENT_ID: z.string(),
          GOOGLE_CLIENT_SECRET: z.string(),
          GOOGLE_MAPS_API_KEY: z.string(),
        },
        client: {},
        runtimeEnv: {
          DATABASE_URL: process.env.DATABASE_URL,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
          DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
          GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
        },
      });
    })
    .catch((err) => {
      console.error("Failed to validate env:", err);
      process.exit(1);
    });
}
