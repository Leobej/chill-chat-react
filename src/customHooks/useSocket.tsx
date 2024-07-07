import { useCallback, useEffect, useState } from "react";
import * as io from "socket.io-client";
import { SOCKET_BASE_URL } from "../constants/apiConstants";

interface ServerToClientEvents {
    read_message: (data: { username: string; room: string; content: string; messageType: string; createdDateTime: string }) => void;
}

interface ClientToServerEvents {
    send_message: (data: { room: string; content: string; username: string; messageType: string }) => void;
}

interface SocketResponse {
    room: string;
    content: string;
    username: string;
    messageType: string;
    createdDateTime: string;
}

interface UseSocketReturnType {
    socketResponse: SocketResponse;
    isConnected: boolean;
    sendData: (payload: { content: string }) => void;
}

export const useSocket = (room: string, username: string): UseSocketReturnType => {
    const [socket, setSocket] = useState<io.Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const [socketResponse, setSocketResponse] = useState<SocketResponse>({
        room: "",
        content: "",
        username: "",
        messageType: "",
        createdDateTime: "",
    });
    const [isConnected, setConnected] = useState<boolean>(false);

    const sendData = useCallback((payload: { content: string }) => {
        if (socket) {
            socket.emit("send_message", {
                room: room,
                content: payload.content,
                username: username,
                messageType: "CLIENT",
            });
        }
    }, [socket, room, username]);

    useEffect(() => {
        const s: io.Socket<ServerToClientEvents, ClientToServerEvents> = io.io(SOCKET_BASE_URL, {
            reconnection: false,
            query: { username, room },
        });

        setSocket(s);

        const handleReadMessage = (res: SocketResponse) => {
            setSocketResponse({
                room: res.room,
                content: res.content,
                username: res.username,
                messageType: res.messageType,
                createdDateTime: res.createdDateTime,
            });
        };

        s.on("connect", () => setConnected(true));
        s.on("disconnect", () => setConnected(false));
        s.on("read_message", handleReadMessage);

        return () => {
            s.off("read_message", handleReadMessage);
            s.disconnect();
        };
    }, [room, username]);

    return { socketResponse, isConnected, sendData };
};
