import React from "react";
import { timeStampConverter } from "../../util/timeUtils";
import "./Message.css";

interface MessageItemProps {
  message: {
    messageType: string;
    username: string;
    content: string;
    createdDateTime: Date;
  };
  username: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  username,
}) => {
  const type: string = message.messageType.toLowerCase();
  const self: string = message.username === username ? "_self" : "";
  const time: string = timeStampConverter(message.createdDateTime);

  return (
    <div className={`message_item_${type}${self}`}>
      {type !== "server" && self === "" && (
        <span className="message_item_username">{message.username}</span>
      )}
      <div className={`message_content_${type}${self}`}>
        <span className="message_content_value">{message.content}</span>
        <span>{time}</span>
      </div>
    </div>
  );
};

export default MessageItem;
