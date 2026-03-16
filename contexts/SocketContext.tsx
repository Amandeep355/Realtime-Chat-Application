"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";
import type { ChatMessage, OnlineUser } from "@/lib/socket";

type SocketContextValue = {
  socket: Socket | null;
  connected: boolean;
  name: string;
  room: string;
  messages: ChatMessage[];
  onlineUsers: OnlineUser[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  joinRoom: (name: string, room: string) => void;
  leaveRoom: () => void;
};

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const nameRef = useRef(name);
  nameRef.current = name;

  useEffect(() => {
    const s = getSocket();
    setSocket(s);

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));

    s.on("chat-history", (history: ChatMessage[]) => {
      setMessages(history.map((msg) => ({ ...msg })));
    });

    s.on("user-joined", (joinedName: string) => {
      setMessages((prev) => [
        ...prev,
        { name: "System", message: `${joinedName} joined`, type: "text" },
      ]);
    });

    s.on("receive", (data: ChatMessage) => {
      if (data.name === nameRef.current) return;
      setMessages((prev) => [...prev, data]);
    });

    s.on("receive-private", (data: { from: string; message: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          name: `Private from ${data.from}`,
          message: data.message,
          type: "text",
        },
      ]);
    });

    s.on("user-left", (leftName: string) => {
      setMessages((prev) => [
        ...prev,
        { name: "System", message: `${leftName} left`, type: "text" },
      ]);
    });

    s.on("online-users", (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    s.on("room-joined", ({ room: roomName, members }: { room: string; members: OnlineUser[] }) => {
      setOnlineUsers(members);
      const names = members.map((m) => m.name).join(", ");
      setMessages((prev) => [
        ...prev,
        {
          name: "System",
          message: `You joined group "${roomName}". People in this room: ${names}.`,
          type: "text",
        },
      ]);
    });

    return () => {
      s.off("connect");
      s.off("disconnect");
      s.off("chat-history");
      s.off("user-joined");
      s.off("receive");
      s.off("receive-private");
      s.off("user-left");
      s.off("online-users");
      s.off("room-joined");
      s.close();
    };
  }, []);

  const joinRoom = (userName: string, roomName: string) => {
    if (!socket) return;
    const nameTrimmed = userName.trim();
    const roomNormalized = String(roomName || "").trim().toLowerCase();
    if (!roomNormalized || !nameTrimmed) return;
    setName(nameTrimmed);
    setRoom(roomNormalized);
    setMessages([]);
    setOnlineUsers([]);
    socket.emit("join-room", { name: nameTrimmed, room: roomNormalized });
  };

  const leaveRoom = () => {
    socket?.emit("leave-room");
    setName("");
    setRoom("");
    setMessages([]);
    setOnlineUsers([]);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        name,
        room,
        messages,
        onlineUsers,
        setMessages,
        joinRoom,
        leaveRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
}
