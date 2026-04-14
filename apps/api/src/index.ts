import { buildApp } from "./app.js";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PORT = parseInt(process.env.PORT ?? "4000", 10);
const HOST = process.env.HOST ?? "0.0.0.0";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL env var is required");

  // Separate client for migrations — closed immediately after
  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  const migrationsFolder = join(__dirname, "../drizzle");

  console.log("Running database migrations…");
  await migrate(db, { migrationsFolder });
  console.log("Migrations complete.");

  await migrationClient.end();
}

async function start() {
  await runMigrations();

  const app = await buildApp();

  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`Server running at http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.fatal(err);
    process.exit(1);
  }
}

start();
