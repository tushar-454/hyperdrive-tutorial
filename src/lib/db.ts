import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const getClient = async () => {
    const { env } = await getCloudflareContext({ async: true });
    const client = postgres(env.HYPERDRIVE.connectionString, {
        prepare: false,
        ssl: false,
    });

    return client;
};

export const getDB = async () => {
    const client = await getClient();
    return drizzle(client);
};
