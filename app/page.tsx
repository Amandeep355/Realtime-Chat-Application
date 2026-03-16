"use client";

import { SocketProvider, useSocket } from "@/contexts/SocketContext";
import JoinForm from "@/components/JoinForm";
import SidebarLeft from "@/components/SidebarLeft";
import ChatPanel from "@/components/ChatPanel";
import SidebarRight from "@/components/SidebarRight";
import { motion, AnimatePresence } from "framer-motion";

function ChatPage() {
  const { name, room, leaveRoom } = useSocket();
  const inRoom = Boolean(name && room);

  return (
    <main className="flex h-screen flex-col bg-[var(--background)]">
      <AnimatePresence mode="wait">
        {!inRoom ? (
          <motion.div
            key="join"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col items-center justify-center p-6"
          >
            <h1 className="mb-8 text-2xl font-semibold text-[var(--foreground)]">iChat</h1>
            <JoinForm />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full min-h-0 w-full"
          >
            <SidebarLeft onNewChat={leaveRoom} />
            <ChatPanel />
            <SidebarRight />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Home() {
  return (
    <SocketProvider>
      <ChatPage />
    </SocketProvider>
  );
}
