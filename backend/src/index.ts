import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { streamText } from "hono/streaming";
import ollama from "ollama";

const { upgradeWebSocket, websocket } = createBunWebSocket();

const DEFAULT_PORT = 3001;

const app = new Hono();

app.get("/", c => {
    return c.text("Hello Hono!");
});

app.get("/chat/:query", async c => {
    return streamText(c, async stream => {
        const response = await ollama.chat({
            model: "llama2",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful assistant. Please be cordial and only moderately formal. Keep your responses to one or two sentences.",
                },
                { role: "user", content: c.req.param("query") },
            ],
            stream: true,
        });

        for await (const chunk of response) {
            stream.write(chunk.message.content);
        }
    });
});

app.get(
    "/ws",
    upgradeWebSocket(c => {
        return {
            onMessage(event, ws) {
                streamText(c, async stream => {
                    const query = JSON.parse(event.data as string).query;

                    const response = await ollama.chat({
                        model: "llama2",
                        messages: [
                            {
                                role: "system",
                                content:
                                    "You are a helpful assistant. Please be cordial and only moderately formal. Keep your responses to one or two sentences.",
                            },
                            { role: "user", content: query },
                        ],
                        stream: true,
                    });

                    for await (const chunk of response) {
                        ws.send(
                            JSON.stringify({ content: chunk.message.content }),
                        );
                    }
                });
            },
            onClose: () => {
                console.log("Connection closed");
            },
            onOpen: () => {
                console.log("Connection opened");
            },
        };
    }),
);

console.log(`server is running on ${process.env.PORT || DEFAULT_PORT}`);

Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT || DEFAULT_PORT,
    websocket,
});
