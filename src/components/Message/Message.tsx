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
  const { socketResponse, sendData } = useSocket(room, username);
  const [messageInput, setMessageInput] = useState<string>("");
  const [messageList, setMessageList] = useState<MessageItem[]>([]);

  const { responseData } = useFetch("/message/" + room);

  const addMessageToList = (val: MessageItem) => {
    if (val.content === "") return;
    setMessageList([...messageList, val]);
  };

  useEffect(() => {
    if (Array.isArray(responseData)) {
      setMessageList((prevMessageList) => [...prevMessageList, ...responseData]);
    }
  }, [responseData]);

  useEffect(() => {
    console.log("Socket Response: ", socketResponse);
    if (socketResponse) {
      const transformedResponse: MessageItem = {
        messageType: socketResponse.messageType || "",
        username: socketResponse.username || "",
        content: socketResponse.content || "",
        createdDateTime: new Date(),
      };
      addMessageToList(transformedResponse);
    }
  }, [socketResponse]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput !== "") {
      sendData({
        content: messageInput,
      });
      const newMessage: MessageItem = {
        content: messageInput,
        username: username,
        createdDateTime: new Date(),
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
        <form className="chat-input" onSubmit={(e) => sendMessage(e)}>
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
