import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Disable prefetch as it is not supported for "Transaction" pool mode
export const getDB = async () => {
    const { env } = await getCloudflareContext({ async: true });
    const client = postgres(env.HYPERDRIVE.connectionString);

    // Create the Drizzle client with the postgres-js connection
    return drizzle(client);
};
