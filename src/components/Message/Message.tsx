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
    if (message.content === "") return; // Filter out empty messages
    setMessageList([...messageList, message]);
  };

  useEffect(() => {
    if (responseData && responseData.length > 0) {
      setMessageList([...responseData, ...messageList]);
    }
  }, [responseData]);

  useEffect(() => {
    if (socketResponse) {
      const transformedResponse: MessageItem = {
        messageType: socketResponse.messageType,
        username: socketResponse.username,
        content: socketResponse.content,
        createdDateTime: new Date(), // Use ISO 8601 format
      };
      addMessageToList(transformedResponse);
    }
  }, [socketResponse]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageInput !== "") {
      sendData({ content: messageInput });
      const newMessage: MessageItem = {
        content: messageInput,
        username: username,
        createdDateTime: new Date(), // Use ISO 8601 format
        messageType: "CLIENT",
      };
      addMessageToList(newMessage);
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
