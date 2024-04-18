"use client";

import React, { useState, useEffect, useCallback } from "react";

export const Form = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const connect = useCallback(() => {
        const ws = new WebSocket("ws://localhost:3001/ws");

        ws.onopen = () => {
            console.log("WebSocket Connected");
            setSocket(ws);
        };

        ws.onmessage = event => {
            const message = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, message]);
        };

        ws.onerror = error => {
            console.error("WebSocket Error:", error);
        };

        ws.onclose = e => {
            console.log("WebSocket Disconnected", e);
            setSocket(null);

            // Check if the disconnection was intentional
            if (!e.wasClean) {
                console.log("Attempting to Reconnect...");
                setTimeout(connect, 1000); // Attempt to reconnect after 1 second
            }
        };

        return () => ws.close();
    }, []);

    useEffect(() => {
        if (!socket) {
            connect();
        }

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [socket]);

    const sendMessage = () => {
        console.log(socket, WebSocket.OPEN);

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ query: input }));
        }
    };

    const handleSubmit = event => {
        event.preventDefault();

        sendMessage("message from the client");
        setInput("");
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="input">Your Query:</label>
                <input
                    type="text"
                    id="input"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Enter your query"
                />
                <button type="submit">Send</button>
            </form>
            <div>
                <h2>Messages</h2>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{JSON.stringify(msg)}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
