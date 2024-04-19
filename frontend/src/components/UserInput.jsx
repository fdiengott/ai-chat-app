import React from "react";
import styles from "./Form.module.css";

export const UserInput = ({ handleKeyDown, handleSubmit, input, setInput }) => {
    return (
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
    );
};
