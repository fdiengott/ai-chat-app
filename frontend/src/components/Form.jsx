"use client";

import React, { useState, useEffect, useCallback } from "react";
import { updateModelMessages } from "./utils";
import styles from "./Form.module.css";

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
            const data = JSON.parse(event.data);
            const newMessage = data.content;

            setMessages(prevMessages =>
                updateModelMessages(prevMessages, newMessage),
            );
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
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            return;
        }

        socket.send(JSON.stringify({ query: input }));
    };

    const handleSubmit = event => {
        event.preventDefault();

        setMessages(prevMessages => [
            ...prevMessages,
            { role: "user", content: input },
        ]);

        sendMessage();
        setInput("");
    };

    const handleKeyDown = e => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    return (
        <div className={styles["main-wrapper"]}>
            <form className={styles["form"]} onSubmit={handleSubmit}>
                <label htmlFor="input">Your Query:</label>
                <textarea
                    id="input"
                    name="user-input"
                    className={styles["textarea"]}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your query"
                    rows="5"
                    cols="40"
                />
                <button type="submit">Send</button>
            </form>
            <div className={styles["messages-wrapper"]}>
                <h2>Messages</h2>
                <ul>
                    {messages.map((msg, index) => (
                        <li className={styles["message"]} key={index}>
                            <div>{msg.role}</div>
                            <div>{msg.content}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
