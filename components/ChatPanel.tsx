"use client";

import { motion } from "framer-motion";
import { useSocket } from "@/contexts/SocketContext";
import ChatView from "./ChatView";

export default function ChatPanel() {

  const { room, name } = useSocket();

  if (!room) return null;

  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col min-h-0 bg-[var(--background)]"
    >

      {/* Chat View */}
      <ChatView username={name} room={room} />

    </motion.div>

  );

}