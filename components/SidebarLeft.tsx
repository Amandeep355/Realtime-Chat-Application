"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSocket } from "@/contexts/SocketContext";

type SidebarLeftProps = {
  onNewChat: () => void;
};

export default function SidebarLeft({ onNewChat }: SidebarLeftProps) {
  const { name, room, onlineUsers } = useSocket();
  const [search, setSearch] = useState("");

  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const lastPreview =
    onlineUsers.length > 0
      ? `${onlineUsers.length} members in this room`
      : "No other users online";

  return (
    <aside className="flex w-[280px] flex-shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]">

      {/* Profile Row */}
      <div className="flex items-center gap-3 border-b border-[var(--border)] p-4">

        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white">
          {initials}
        </div>

        <div className="min-w-0 flex-1">

          {/* USERNAME (more visible) */}
          <p className="truncate text-base font-semibold text-[var(--foreground)]">
            {name || "You"}
          </p>

          {/* STATUS */}
          <p className="truncate text-xs text-[var(--muted-foreground)]">
            Online
          </p>

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-1">

          <button
            type="button"
            className="rounded-full p-2 text-[var(--muted-foreground)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
            aria-label="More"
          >
            <span className="text-lg">⋯</span>
          </button>

          <button
            type="button"
            className="rounded-full p-2 text-[var(--muted-foreground)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
            aria-label="Camera"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={onNewChat}
            className="rounded-full p-2 text-[var(--muted-foreground)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
            aria-label="New chat"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] p-3">

        <div className="flex flex-1 items-center gap-2 rounded-lg bg-[var(--surface-elevated)] px-3 py-2">

          <svg className="h-4 w-4 text-[var(--muted-foreground)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
          />

        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-white transition hover:bg-[var(--accent-hover)]"
          aria-label="Add"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">

        <motion.div
          className="flex cursor-pointer items-center gap-3 border-l-2 border-[var(--accent)] bg-[var(--surface-elevated)] px-4 py-3"
          whileTap={{ scale: 0.98 }}
        >

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)] text-sm font-medium text-[var(--muted-foreground)]">
            {room ? room.slice(0, 2).toUpperCase() : "--"}
          </div>

          <div className="min-w-0 flex-1">

            {/* GROUP NAME SMALLER */}
            <p className="truncate text-sm font-medium text-[var(--foreground)]">
              {room || "No Room"}
            </p>

            <p className="truncate text-xs text-[var(--muted-foreground)]">
              {lastPreview}
            </p>

          </div>

        </motion.div>

      </div>

    </aside>
  );
}