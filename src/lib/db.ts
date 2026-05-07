import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

type PostgresClient = ReturnType<typeof postgres>;

const globalForPostgres = globalThis as unknown as {
    postgresClient?: PostgresClient;
};

type ConnectionInfo = {
    connectionString: string;
    source: "hyperdrive" | "env";
};

const resolveConnectionString = async (): Promise<ConnectionInfo> => {
    try {
        const { env } = await getCloudflareContext({ async: true });

        if (env?.HYPERDRIVE?.connectionString) {
            return {
                connectionString: env.HYPERDRIVE.connectionString,
                source: "hyperdrive",
            };
        }
    } catch (error) {
        // Fall back to process.env when not running in the Cloudflare runtime.
    }

    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    return { connectionString, source: "env" };
};

const getClient = async () => {
    if (globalForPostgres.postgresClient) {
        return globalForPostgres.postgresClient;
    }

    const { connectionString, source } = await resolveConnectionString();
    const useHyperdrive = source === "hyperdrive";
    const client = postgres(
        connectionString,
        useHyperdrive ? { prepare: false, ssl: false } : { prepare: false },
    );

    if (process.env.NODE_ENV !== "production") {
        globalForPostgres.postgresClient = client;
    }

    return client;
};

export const getDB = async () => {
    const client = await getClient();
    return drizzle(client);
};
