import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./drizzle/schema";

// Disable prefetch as it is not supported for "Transaction" pool mode
export const getDB = async () => {
    const { env } = await getCloudflareContext({ async: true });
    const client = postgres(env.HYPERDRIVE.connectionString, {
        max: 1,
        prepare: false,
    });
    return drizzle(client, {
        schema,
    });
};
