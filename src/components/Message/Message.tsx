import React, { useEffect, useState } from "react";
import { useSocket } from "../../customHooks/useSocket";
import { RiSendPlaneLine, RiSendPlaneFill } from "react-icons/ri";
import "./Message.css";
import { MessageList } from "./MessageList";
import { useFetch } from "../../customHooks/useFetch";

interface MessageProps {
    room: string;
    username: string;
}

interface MessageItem {
    messageType: string;
    username: string;
    content: string;
    createdDateTime: Date;
}

export const Message: React.FC<MessageProps> = ({ room, username }) => {
    const { isConnected, socketResponse, sendData } = useSocket(room, username);
    const [messageInput, setMessageInput] = useState("");
    const [messageList, setMessageList] = useState<MessageItem[]>([]);

    const { responseData, error, loading } = useFetch(`/message/${room}`);

    const addMessageToList = (message: MessageItem) => {
        if (message.content.trim() !== "") {
            setMessageList((prevList) => [...prevList, message]);
        }
    };

    useEffect(() => {
        if (responseData && responseData.length > 0) {
            const uniqueMessages = responseData.filter(
                (msg: MessageItem) =>
                    !messageList.some(
                        (existingMsg) =>
                            existingMsg.content === msg.content &&
                            new Date(existingMsg.createdDateTime).toISOString() ===
                            new Date(msg.createdDateTime).toISOString()
                    )
            );
            setMessageList((prevList) => [...uniqueMessages, ...prevList]);
        }
    }, [responseData, messageList]);

    useEffect(() => {
        if (socketResponse && socketResponse.content) {
            const newMessage: MessageItem = {
                messageType: socketResponse.messageType,
                username: socketResponse.username,
                content: socketResponse.content,
                createdDateTime: new Date(socketResponse.createdDateTime),
            };
            addMessageToList(newMessage);
        }
    }, [socketResponse]);

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (messageInput.trim() !== "") {
            const newMessage: MessageItem = {
                messageType: "CLIENT",
                username: username,
                content: messageInput,
                createdDateTime: new Date(),
            };
            addMessageToList(newMessage);
            sendData({ content: messageInput });
            setMessageInput("");
        }
    };

    return (
        <div className="message_root_div">
            <span className="room_name">Room: {room} </span>
            <span className="user_name">Welcome: {username} </span>
            <div className="message_component">
                <MessageList username={username} messageList={messageList} />
                <form className="chat-input" onSubmit={sendMessage}>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message"
                    />
                    <button type="submit">
                        {messageInput === "" ? (
                            <RiSendPlaneLine size={25} />
                        ) : (
                            <RiSendPlaneFill color="#2671ff" size={25} />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};