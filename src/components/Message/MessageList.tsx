import React, { useEffect, useRef } from "react";
import "./Message.css";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messageList: {
    messageType: string;
    username: string;
    content: string;
    createdDateTime: Date;
  }[];//
  username: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messageList, username }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [messageList]);

  return (
    <div className="message_list">
      {messageList.map((message, idx) => (
        <MessageItem key={idx} message={message} username={username} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
