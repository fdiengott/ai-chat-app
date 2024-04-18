export const updateModelMessages = (prevMessages, newMessage) => {
    const lastMessage = prevMessages.at(-1);

    if (lastMessage.role === "user") {
        return [
            ...prevMessages,
            {
                role: "model",
                content: newMessage,
            },
        ];
    }

    return [
        ...prevMessages.slice(0, -1),
        {
            role: "model",
            content: lastMessage.content + newMessage,
        },
    ];
};
