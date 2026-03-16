"use client"

import { useState,useRef } from "react"

export default function ChatInput({sendMessage,sendFile,typing,stopTyping}:any){

  const [message,setMessage]=useState("")
  const fileRef=useRef<HTMLInputElement>(null)

  const handleSend=()=>{

    if(!message.trim()) return

    sendMessage(message)
    setMessage("")
    stopTyping()

  }

  return(

  <div className="border-t border-gray-700 p-3 bg-gray-900">

    <div className="flex gap-2">

      <button onClick={()=>fileRef.current?.click()} className="text-gray-400">
        📎
      </button>

      <input
        type="file"
        hidden
        ref={fileRef}
        onChange={(e)=>{
          const file=e.target.files?.[0]
          if(file) sendFile(file)
        }}
      />

      <textarea
        value={message}
        onChange={(e)=>{
          setMessage(e.target.value)
          typing()
        }}
        onKeyDown={(e)=>{

          if(e.key==="Enter" && !e.shiftKey){
            e.preventDefault()
            handleSend()
          }

        }}
        placeholder="Type message..."
        className="flex-1 bg-gray-800 text-white rounded-md px-3 py-2 resize-none"
      />

      <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-md">
        Send
      </button>

    </div>

  </div>

  )
}