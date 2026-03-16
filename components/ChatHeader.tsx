"use client"

import VideoCall from "./VideoCall"

type Props = {
  room: string
  users: number
  username: string
}

export default function ChatHeader({
  room,
  users,
  username
}: Props) {

  return (

    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">

        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-sm text-white font-semibold">
          {room.slice(0,2).toUpperCase()}
        </div>

        <div className="flex flex-col">

          <span className="text-white font-medium">
            Group: {room}
          </span>

          <span className="text-xs text-gray-400">
            {users} users • Online
          </span>

        </div>

      </div>

      {/* VIDEO CALL BUTTON */}

      <VideoCall
        room={room}
        username={username}
      />

    </div>

  )

}