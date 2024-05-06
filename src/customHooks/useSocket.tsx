import { useCallback, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_BASE_URL } from "../constants/apiConstants";

interface SocketResponse {
  room: string;
  content: string;
  username: string;
  messageType: string;
  createdDateTime: string;
}

interface UseSocket {
  socketResponse: SocketResponse;
  isConnected: boolean;
  sendData: (payload: { content: string }) => void;
}

export const useSocket = (room: string, username: string): UseSocket => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketResponse, setSocketResponse] = useState<SocketResponse>({
    room: "",
    content: "",
    username: "",
    messageType: "",
    createdDateTime: "",
  });
  const [isConnected, setConnected] = useState(false);

  const sendData = useCallback(
    (payload: { content: string }) => {
      if (socket) {
        socket.emit("send_message", {
          room: room,
          content: payload.content,
          username: username,
          messageType: "CLIENT",
        });
      }
    },
    [socket, room, username]
  );

  useEffect(() => {
    const queryParams = { username: username, room: room };
    const s = io(SOCKET_BASE_URL, {
      reconnection: false,
      query: queryParams,
    });
    setSocket(s);
    s.on("connect", () => setConnected(true));
    s.on("read_message", (res: SocketResponse) => {
      console.log(res);
      setSocketResponse(res);
    });

    return () => {
      if (s) {
        s.disconnect();
      }
    };
  }, [room, username]);

  return { socketResponse, isConnected, sendData };
};
