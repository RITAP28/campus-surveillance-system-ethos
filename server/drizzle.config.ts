import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { config } from "./src/infra/activeConfig";

const nodeEnv = config.NODE_ENV;
console.log('dev url: ', config.SUPABASE_DEV_CONNECTION_URL)
const databaseUrl =
  nodeEnv === "production"
    ? config.SUPABASE_PROD_CONNECTION_URL
    : config.SUPABASE_DEV_CONNECTION_URL;

if (!databaseUrl) {
  throw new Error("database url is not defined");
}

export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
  breakpoints: true,
});