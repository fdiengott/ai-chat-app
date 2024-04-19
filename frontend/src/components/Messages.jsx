import React from "react";
import { Message } from "./Message";
import styles from "./Form.module.css";

export const Messages = ({ messages }) => {
    return (
        <div className={styles["messages-wrapper"]}>
            <h2>Messages</h2>
            <ul>
                {messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}
            </ul>
        </div>
    );
};
