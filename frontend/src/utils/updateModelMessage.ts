type MessageType = {
    role: "user" | "model";
    content: string;
};

export const updateModelMessages = (
    prevMessages: MessageType[],
    newMessage: string,
) => {
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
