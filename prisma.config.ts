import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// .env.local holds the real values; .env is a committed fallback. First file wins.
config({ path: [".env.local", ".env"] });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // CLI (migrate/db push/studio) needs the direct connection — pgbouncer
    // breaks migrations. App runtime uses the pooled DATABASE_URL via lib/prisma.ts.
    url: process.env.DATABASE_DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
