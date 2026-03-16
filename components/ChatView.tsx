"use client"

import { useEffect, useRef, useState } from "react"
import { getSocket, ChatMessage, OnlineUser } from "../lib/socket"

import MessageList from "./MessageList"
import ChatInput from "./ChatInput"
import OnlineUsers from "./OnlineUsers"
import ChatHeader from "./ChatHeader"

export default function ChatView({
  username,
  room
}: {
  username: string
  room: string
}) {

  const socketRef = useRef(getSocket())
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const [messages,setMessages] = useState<ChatMessage[]>([])
  const [onlineUsers,setOnlineUsers] = useState<OnlineUser[]>([])
  const [typingUser,setTypingUser] = useState("")
  const [search,setSearch] = useState("")

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({behavior:"smooth"})
  }

  useEffect(()=>{

    const socket = socketRef.current

    socket.emit("join-room",{name:username,room})

    socket.on("chat-history",(history:ChatMessage[])=>{
      setMessages(history)
      scrollToBottom()
    })

    socket.on("receive",(msg:ChatMessage)=>{

      setMessages(prev=>{

        const exists = prev.find(m=>m._id===msg._id)
        if(exists) return prev

        return [...prev,msg]

      })

      scrollToBottom()

    })

    socket.on("online-users",(users:OnlineUser[])=>{
      setOnlineUsers(users)
    })

    socket.on("typing",({username})=>{
      setTypingUser(username)
    })

    socket.on("stop-typing",()=>{
      setTypingUser("")
    })

    socket.on("message-reacted",({messageId,reactions})=>{

      setMessages(prev=>
        prev.map(m=>
          m._id===messageId
          ? {...m,reactions}
          : m
        )
      )

    })

    return ()=>{

      socket.off("chat-history")
      socket.off("receive")
      socket.off("online-users")
      socket.off("typing")
      socket.off("stop-typing")
      socket.off("message-reacted")

    }

  },[username,room])

  const sendMessage=(msg:string)=>{

    if(!msg.trim()) return
    socketRef.current.emit("send",msg)

  }

  const sendFile=async(file:File)=>{

    const form=new FormData()
    form.append("file",file)

    const res=await fetch("/upload",{method:"POST",body:form})
    const data=await res.json()

    socketRef.current.emit("send-file",{filePath:data.filePath})

  }

  const react=(id:string,emoji:string)=>{

    socketRef.current.emit("react-message",{
      messageId:id,
      emoji
    })

  }

  const editMessage=(id:string,text:string)=>{

    socketRef.current.emit("edit-message",{
      messageId:id,
      newText:text
    })

  }

  const deleteMessage=(id:string)=>{

    socketRef.current.emit("delete-message",{
      messageId:id
    })

  }

  const filteredMessages=messages.filter(m=>
    m.message?.toLowerCase().includes(search.toLowerCase())
  )

  return(

  <div className="flex h-full">

    <div className="flex flex-col flex-1">

      <ChatHeader
        room={room}
        users={onlineUsers.length}
        username={username}
      />

      <div className="border-b border-gray-700 p-3 bg-gray-900">

        <input
          placeholder="Search messages..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="bg-gray-800 text-white p-2 text-sm rounded-md w-full"
        />

      </div>

      <MessageList
        messages={filteredMessages}
        currentUser={username}
        react={react}
        editMessage={editMessage}
        deleteMessage={deleteMessage}
      />

      {typingUser && (
        <div className="px-3 py-1 text-gray-400 text-xs">
          {typingUser} typing...
        </div>
      )}

      <div ref={bottomRef}></div>

      <ChatInput
        sendMessage={sendMessage}
        sendFile={sendFile}
        typing={()=>socketRef.current.emit("typing")}
        stopTyping={()=>socketRef.current.emit("stop-typing")}
      />

    </div>

    <OnlineUsers users={onlineUsers}/>

  </div>

  )

}