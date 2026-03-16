💬 Realtime Chat Application
Instant messaging, peer-to-peer video calls, and file sharing — all in one place.

✨ Features
FeatureDescription💬 Realtime MessagingInstant message delivery via WebSockets with infinite scroll history📹 P2P Video CallsBrowser-to-browser video using WebRTC — no media relay needed📁 File & Image SharingUpload and share files directly in chat😄 Message ReactionsReact to messages with emoji✏️ Edit & DeleteFull message management after sending⌨️ Typing IndicatorsSee when others are composing a message🟢 Online PresenceLive online users list with join/leave notifications🗄️ Message PersistenceChat history stored and retrieved from MongoDB

🏗️ System Architecture
Client (Next.js / React)
         │
         │  WebSocket (Socket.IO)
         │
Node.js + Express  ──────────  MongoDB
  Signaling Server               Message Persistence
📹 WebRTC Video Call Flow
User A Browser                              User B Browser
      │                                           │
      │── WebRTC Offer ──▶ Signaling Server ──▶ ──│
      │◀─ WebRTC Answer ── Signaling Server ◀── ──│
      │                                           │
      │◀══════════ Peer-to-Peer Media ════════════│

The server handles signaling only. After negotiation, media streams flow directly between browsers via WebRTC.


🛠️ Tech Stack
Frontend

Next.js — React framework for the UI
TypeScript — Type-safe development
TailwindCSS — Utility-first styling
Socket.IO Client — WebSocket communication
WebRTC APIs — Peer-to-peer audio/video

Backend

Node.js + Express.js — Server and REST API
Socket.IO — Realtime event handling
Multer — File upload middleware

Database

MongoDB Atlas — Cloud-hosted NoSQL database
Mongoose ODM — Schema modeling and queries

Realtime Technologies

WebSocket (Socket.IO) — Bidirectional messaging
WebRTC — Peer-to-peer media streaming
STUN Servers — NAT traversal for video calls


📁 Project Structure
Realtime-Chat-Application/
│
├── app/                  # Next.js pages and routes
├── components/           # React UI components
│   ├── ChatPanel/
│   ├── ChatInput/
│   ├── MessageList/
│   └── VideoCall/
├── contexts/             # React context providers
├── lib/                  # Utilities and socket setup
├── models/               # MongoDB Mongoose schemas
├── public/               # Static assets
│   └── uploads/          # Uploaded files
│
├── server.js             # Express + Socket.IO backend
├── package.json
├── tsconfig.json
└── .env

🚀 Getting Started
1. Clone the repository
bashgit clone https://github.com/Amandeep355/Realtime-Chat-Application.git
cd Realtime-Chat-Application
2. Install dependencies
bashnpm install
3. Configure environment variables
Create a .env file in the root directory:
envMONGODB_URI=your_mongodb_connection_string
PORT=3000
4. Start the development server
bashnpm run dev
The app will be running at http://localhost:3000

🔌 API Reference
POST /upload
Uploads a file and returns its accessible path.
Response:
json{
  "filePath": "/uploads/file.png"
}

🗃️ Database Schema
Message Document
js{
  username:  String,
  message:   String,
  room:      String,
  type:      "text" | "file",
  createdAt: Date,
  status:    "sent" | "seen",
  reactions: Object
}

☁️ Deployment
LayerRecommended PlatformsFrontendVercelBackendRender · Railway · AWS EC2DatabaseMongoDB Atlas

🔮 Future Improvements

 🔄 TURN servers for improved WebRTC connectivity across strict NATs
 🔐 End-to-end encryption for messages and media
 🪪 User authentication with JWT
 💌 Private / direct messaging
 🔔 Push notifications
 ⚡ Redis adapter for horizontal Socket.IO scaling
 ☸️ Kubernetes deployment for production scalability


📚 What This Project Demonstrates

Realtime system design with WebSockets
WebRTC peer-to-peer networking and signaling
Node.js backend development with Express
MongoDB data modeling and persistence
Scalable, component-based frontend architecture with Next.js


Made with ❤️ by Amandeep355