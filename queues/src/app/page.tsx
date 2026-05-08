import { getCloudflareContext } from "@opennextjs/cloudflare";

export default async function Home() {
    const { env } = await getCloudflareContext({ async: true });

    await env.my_queues.send({
        type: "send-email",
        to: "test@gmail.com",
    });

    return (
        <main>
            <h1 className="text-4xl font-bold text-center mt-10">
                Cloudflare Queues
            </h1>
        </main>
    );
}
