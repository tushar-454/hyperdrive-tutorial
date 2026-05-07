import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

type PostgresClient = ReturnType<typeof postgres>;

const globalForPostgres = globalThis as unknown as {
    postgresClient?: PostgresClient;
};

const client =
    globalForPostgres.postgresClient ??
    postgres(connectionString, { prepare: false });

if (process.env.NODE_ENV !== "production") {
    globalForPostgres.postgresClient = client;
}

export const db = drizzle(client);
