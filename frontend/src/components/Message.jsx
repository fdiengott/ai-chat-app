import React from "react";
import styles from "./Form.module.css";

export const Message = ({ message }) => {
    return (
        <li className={styles["message"]}>
            <div>{message.role}</div>
            <div>{message.content}</div>
        </li>
    );
};
