import { OnlineUser } from "../lib/socket"

export default function OnlineUsers({users}:{users:OnlineUser[]}){

  return(

  <div className="w-56 border-l border-gray-700 bg-gray-900 p-4">

    <h3 className="text-white text-sm mb-3">
      Online Users
    </h3>

    <div className="space-y-2">

      {users.map(u=>(
        <div key={u.socketId} className="flex items-center gap-2 text-sm text-gray-300">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          {u.name}
        </div>
      ))}

    </div>

  </div>

  )
}