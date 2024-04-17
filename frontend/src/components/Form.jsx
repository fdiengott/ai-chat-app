import React, { useState, useEffect } from "react";
import io from "socket.io-client";

export const Form = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        // Connect to your Socket.IO server
        const newSocket = io("https://your-backend-api.com/", {
            // Options like path, transports can be specified here
            transports: ["websocket"],
        });

        setSocket(newSocket);

        newSocket.on("message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        newSocket.on("connect_error", (err) => {
            console.error("Connection Failed: ", err);
        });

        return () => newSocket.close();
    }, []);

    const sendMessage = () => {
        if (socket) {
            socket.emit("sendMessage", { query: input });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage();
        setInput(""); // Clear the input after sending
    };

    return <form>form</form>;
};
