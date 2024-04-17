import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { Server } from "socket.io";
import { streamText } from "hono/streaming";
import ollama from "ollama";

const { upgradeWebSocket, websocket } = createBunWebSocket();

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.get("/chat/:query", async (c) => {
    return streamText(c, async (stream) => {
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
    upgradeWebSocket((c) => {
        return {
            onMessage(event, ws) {
                console.log(`Message from client: ${event.data}`);
                ws.send("Hello from server!");
            },
            onClose: () => {
                console.log("Connection closed");
            },
        };
    }),
);

Bun.serve({
    fetch: app.fetch,
    websocket,
});

export default app;
