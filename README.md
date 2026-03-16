# 💬 Realtime Chat Application

> **Instant messaging, peer-to-peer video calls, and file sharing — all in one place.**

&nbsp;

---

&nbsp;

## ✨ Features

| Feature | Description |
|:---|:---|
| 💬 **Realtime Messaging** | Instant message delivery via WebSockets with infinite scroll history |
| 📹 **P2P Video Calls** | Browser-to-browser video using WebRTC — no media relay needed |
| 📁 **File & Image Sharing** | Upload and share files directly in chat |
| 😄 **Message Reactions** | React to messages with emoji |
| ✏️ **Edit & Delete** | Full message management after sending |
| ⌨️ **Typing Indicators** | See when others are composing a message |
| 🟢 **Online Presence** | Live online users list with join/leave notifications |
| 🗄️ **Message Persistence** | Chat history stored and retrieved from MongoDB |

&nbsp;

---

&nbsp;

## 🏗️ System Architecture

```
Client (Next.js / React)
         │
         │  WebSocket (Socket.IO)
         │
Node.js + Express  ──────────  MongoDB
  Signaling Server               Message Persistence
```

&nbsp;

### 📹 WebRTC Video Call Flow

```
User A Browser                              User B Browser
      │                                           │
      │── WebRTC Offer ──▶ Signaling Server ──▶ ──│
      │◀─ WebRTC Answer ── Signaling Server ◀── ──│
      │                                           │
      │◀══════════ Peer-to-Peer Media ════════════│
```

> The server handles **signaling only**.
> After negotiation, media streams flow **directly** between browsers via WebRTC.

&nbsp;

---

&nbsp;

## 🛠️ Tech Stack

### Frontend
- **Next.js** — React framework for the UI
- **TypeScript** — Type-safe development
- **TailwindCSS** — Utility-first styling
- **Socket.IO Client** — WebSocket communication
- **WebRTC APIs** — Peer-to-peer audio/video

&nbsp;

### Backend
- **Node.js + Express.js** — Server and REST API
- **Socket.IO** — Realtime event handling
- **Multer** — File upload middleware

&nbsp;

### Database
- **MongoDB Atlas** — Cloud-hosted NoSQL database
- **Mongoose ODM** — Schema modeling and queries

&nbsp;

### Realtime Technologies
- **WebSocket** (Socket.IO) — Bidirectional messaging
- **WebRTC** — Peer-to-peer media streaming
- **STUN Servers** — NAT traversal for video calls

&nbsp;

---

&nbsp;

## 📁 Project Structure

```
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
```

&nbsp;

---

&nbsp;

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Amandeep355/Realtime-Chat-Application.git
cd Realtime-Chat-Application
```

&nbsp;

### 2. Install dependencies

```bash
npm install
```

&nbsp;

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

&nbsp;

### 4. Start the development server

```bash
npm run dev
```

The app will be running at **http://localhost:3000**

&nbsp;

---

&nbsp;

## 🔌 API Reference

### `POST /upload`

Uploads a file and returns its accessible path.

**Response:**

```json
{
  "filePath": "/uploads/file.png"
}
```

&nbsp;

---

&nbsp;

## 🗃️ Database Schema

**Message Document**

```js
{
  username:  String,
  message:   String,
  room:      String,
  type:      "text" | "file",
  createdAt: Date,
  status:    "sent" | "seen",
  reactions: Object
}
```

&nbsp;

---

&nbsp;

## ☁️ Deployment

| Layer | Recommended Platforms |
|:---|:---|
| **Frontend** | Vercel |
| **Backend** | Render · Railway · AWS EC2 |
| **Database** | MongoDB Atlas |

&nbsp;

---

&nbsp;

## 🔮 Future Improvements

- [ ] 🔄 **TURN servers** — Improved WebRTC connectivity across strict NATs
- [ ] 🔐 **End-to-end encryption** — Secure messages and media
- [ ] 🪪 **User authentication** — Login and identity via JWT
- [ ] 💌 **Private messaging** — Direct user-to-user chat
- [ ] 🔔 **Push notifications** — Stay updated in real time


&nbsp;

---

&nbsp;

## 📚 What This Project Demonstrates

- Realtime system design with WebSockets
- WebRTC peer-to-peer networking and signaling
- Node.js backend development with Express
- MongoDB data modeling and persistence
- Scalable, component-based frontend architecture with Next.js

&nbsp;

---

&nbsp;

Made with ❤️ by [Amandeep355](https://github.com/Amandeep355)
