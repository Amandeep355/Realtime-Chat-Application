"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSocket } from "@/contexts/SocketContext";

export default function JoinForm() {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const { joinRoom } = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = userName.trim();
    const room = roomName.trim();
    if (name && room) joinRoom(name, room);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8"
    >
      <motion.h1
        className="text-xl font-semibold text-[var(--foreground)] md:text-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Join chat
      </motion.h1>

      <div className="space-y-2">
        <label
          htmlFor="nameInput"
          className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]"
        >
          Your name
        </label>
        <input
          id="nameInput"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your name"
          required
          autoComplete="name"
          className="h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="roomInput"
          className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]"
        >
          Group name
        </label>
        <input
          id="roomInput"
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="e.g. r1 (same name = same group)"
          required
          autoComplete="off"
          className="h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:outline-none"
        />
        <p className="text-xs text-[var(--muted-foreground)]">
          Everyone who enters the same group name is in the same room.
        </p>
      </div>

      <motion.button
        type="submit"
        className="h-12 w-full rounded-xl bg-[var(--accent)] font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        Join room
      </motion.button>
    </motion.form>
  );
}
