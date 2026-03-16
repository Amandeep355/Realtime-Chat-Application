"use client"

import { useState } from "react"
import { ChatMessage } from "../lib/socket"

type Props = {
  message: ChatMessage
  currentUser: string
  react: (id: string, emoji: string) => void
  editMessage: (id: string, text: string) => void
  deleteMessage: (id: string) => void
  grouped?: boolean
}

export default function MessageBubble({
  message,
  currentUser,
  react,
  editMessage,
  deleteMessage,
  grouped
}: Props) {

  const [editing,setEditing]=useState(false)
  const [editText,setEditText]=useState(message.message)

  const isSender=message.username===currentUser

  const file=message.message || ""
  const ext=file.split(".").pop()?.toLowerCase()

  const isImage=["jpg","jpeg","png","gif","webp"].includes(ext||"")
  const isDoc=["pdf","doc","docx","ppt","pptx","xls","xlsx"].includes(ext||"")

  const time=message.createdAt
  ? new Date(message.createdAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})
  : ""

  const reactions = message.reactions || {}

  return(

  <div className={`flex ${isSender?"justify-end":""}`}>

    <div className={`max-w-xs`}>

      <div className={`rounded-lg px-3 py-2 ${
        isSender
        ? "bg-blue-600 text-white"
        : "bg-gray-800 text-white"
      }`}>

        {editing ? (

          <input
            value={editText}
            autoFocus
            onChange={(e)=>setEditText(e.target.value)}
            onKeyDown={(e)=>{

              if(e.key==="Enter"){
                if(message._id){
                  editMessage(message._id,editText)
                }
                setEditing(false)
              }

            }}
            className="bg-transparent outline-none w-full"
          />

        ) : (

          <>
          {message.type==="text" && <div>{message.message}</div>}

          {isImage && (
            <img src={file} className="rounded-md max-h-60"/>
          )}

          {isDoc && (
            <a href={file} target="_blank" className="flex gap-2 items-center">
              📄 {file.split("/").pop()}
            </a>
          )}
          </>

        )}

      </div>

      <div className="text-xs text-gray-400 mt-1 flex gap-2 flex-wrap">

        <span>{time}</span>

        {Object.entries(reactions).map(([emoji,count])=>(
          <span key={emoji}>{emoji} {count}</span>
        ))}

        {/* REACTIONS ONLY FOR RECEIVER */}

        {!isSender && (
          <div className="flex gap-2">

            {["👍","❤️","😂","🔥"].map(e=>(
              <button
                key={e}
                onClick={()=>message._id && react(message._id,e)}
              >
                {e}
              </button>
            ))}

          </div>
        )}

        {isSender && (
          <>
          <button onClick={()=>setEditing(true)}>edit</button>
          <button onClick={()=>message._id && deleteMessage(message._id)}>delete</button>
          </>
        )}

      </div>

    </div>

  </div>

  )

}