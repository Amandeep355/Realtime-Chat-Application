"use client"

import MessageBubble from "./MessageBubble"
import { ChatMessage } from "../lib/socket"

type Props = {
  messages: ChatMessage[]
  currentUser: string
  react: (id: string, emoji: string) => void
  editMessage: (id: string, text: string) => void
  deleteMessage: (id: string) => void
}

export default function MessageList({
  messages,
  currentUser,
  react,
  editMessage,
  deleteMessage
}: Props) {

  let lastUser = ""

  return (

    <div className="flex-1 overflow-y-auto p-4 space-y-2">

      {messages.map((msg, i) => {

        const grouped = msg.username === lastUser
        lastUser = msg.username

        const uniqueKey = `${msg._id || "msg"}-${i}`

        return (

          <MessageBubble
            key={uniqueKey}
            message={msg}
            grouped={grouped}
            currentUser={currentUser}
            react={react}
            editMessage={editMessage}
            deleteMessage={deleteMessage}
          />

        )

      })}

    </div>

  )

}