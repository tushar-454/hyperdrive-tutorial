import type { MessageBatch } from "@cloudflare/workers-types";
import worker from "./.open-next/worker";

export default {
    fetch: worker.fetch,

    async queue(batch: MessageBatch<unknown>) {
        console.log("QUEUE HIT");
        for (const msg of batch.messages) {
            console.log("QUEUE:", msg.body);
        }
    },
};
