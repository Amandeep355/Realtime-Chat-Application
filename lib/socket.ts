import { io, Socket } from "socket.io-client"

export type ChatMessage = {
  _id?: string
  username: string
  message: string
  room?: string
  type: "text" | "file" | "audio"
  createdAt?: string
  status?: "sent" | "delivered" | "seen"
  reactions?: Record<string, number>
  edited?: boolean
  pinned?: boolean
}

export type OnlineUser = {
  socketId: string
  name: string
}

let socket: Socket | null = null

export function getSocket(): Socket {

  if (typeof window === "undefined") {
    return null as unknown as Socket
  }

  if (!socket) {
    socket = io(window.location.origin, {
      path: "/socket.io",
      transports: ["websocket","polling"]
    })
  }

  return socket
}