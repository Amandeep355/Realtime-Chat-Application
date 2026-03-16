"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/contexts/SocketContext";

const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

function isImagePath(path: string) {
  const lower = path.toLowerCase();
  return imageExtensions.some((ext) => lower.endsWith(ext));
}

export default function SidebarRight() {
  const { room, onlineUsers, messages, leaveRoom } = useSocket();
  const [chatSettingsOpen, setChatSettingsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const fileMessages = messages.filter((m) => m.type === "file");
  const sharedPhotos = fileMessages.filter((m) => isImagePath(m.message));
  const sharedFiles = fileMessages.filter((m) => !isImagePath(m.message));

  return (
    <aside className="flex w-[320px] flex-shrink-0 flex-col border-l border-[var(--border)] bg-[var(--surface)]">
      {/* Profile */}
      <div className="border-b border-[var(--border)] p-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--muted)] text-lg font-medium text-[var(--muted-foreground)]">
            {room ? room.slice(0, 2).toUpperCase() : "—"}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Group: {room || "—"}</h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              {onlineUsers.length} member{onlineUsers.length !== 1 ? "s" : ""} in this room
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {/* Chat settings */}
        <div className="rounded-lg border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setChatSettingsOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-elevated)]"
          >
            <span>Chat settings</span>
            <motion.span
              animate={{ rotate: chatSettingsOpen ? 180 : 0 }}
              className="text-[var(--muted-foreground)]"
            >
              ▼
            </motion.span>
          </button>
          <AnimatePresence>
            {chatSettingsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[var(--border)] px-4 pb-3 pt-1 text-xs text-[var(--muted-foreground)]"
              >
                Notifications, theme, and other options can go here.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Privacy & help */}
        <div className="mt-2 rounded-lg border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setPrivacyOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-elevated)]"
          >
            <span>Privacy & help</span>
            <motion.span
              animate={{ rotate: privacyOpen ? 180 : 0 }}
              className="text-[var(--muted-foreground)]"
            >
              ▼
            </motion.span>
          </button>
          <AnimatePresence>
            {privacyOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[var(--border)] px-4 pb-3 pt-1 text-xs text-[var(--muted-foreground)]"
              >
                Block users, report, and get help.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Shared photos */}
        <div className="mt-4">
          <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Shared photos
          </h4>
          <div className="flex flex-wrap gap-2">
            {sharedPhotos.length === 0 ? (
              <p className="px-2 text-xs text-[var(--muted-foreground)]">No photos yet</p>
            ) : (
              sharedPhotos.slice(0, 6).map((m, i) => (
                <a
                  key={`${i}-${m.message}`}
                  href={m.message}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-14 w-14 overflow-hidden rounded-lg border border-[var(--border)]"
                >
                  <img
                    src={m.message}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </a>
              ))
            )}
          </div>
        </div>

        {/* Shared files */}
        <div className="mt-4">
          <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Shared files
          </h4>
          <div className="space-y-1">
            {sharedFiles.length === 0 ? (
              <p className="px-2 text-xs text-[var(--muted-foreground)]">No files yet</p>
            ) : (
              sharedFiles.slice(0, 5).map((m, i) => (
                <a
                  key={`${i}-${m.message}`}
                  href={m.message}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-[var(--accent)] hover:bg-[var(--surface-elevated)]"
                >
                  <span>📎</span>
                  <span className="truncate">{m.message.split("/").pop() || "File"}</span>
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Leave room / Block-style button */}
      <div className="border-t border-[var(--border)] p-4">
        <motion.button
          type="button"
          onClick={leaveRoom}
          className="w-full rounded-xl bg-[var(--danger-bg)] py-3 text-sm font-medium text-[var(--danger)] transition-opacity hover:opacity-90"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          Leave group
        </motion.button>
      </div>
    </aside>
  );
}
