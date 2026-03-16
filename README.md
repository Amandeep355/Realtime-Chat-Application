Project Overview

This application allows users to join chat rooms and communicate instantly with other users in the same room.

Features include:

Realtime messaging

WebRTC peer-to-peer video calls

File and image sharing

Message reactions

Message editing and deletion

Typing indicators

Online user tracking

Message persistence using MongoDB

The project is designed to demonstrate how modern realtime systems work using WebSockets and WebRTC together.

Tech Stack
Frontend

Next.js (React framework)

TypeScript

TailwindCSS

WebRTC APIs

Socket.IO Client

Backend

Node.js

Express.js

Socket.IO

Multer (file uploads)

Database

MongoDB Atlas

Mongoose ODM

Realtime Technologies

WebSocket (Socket.IO)

WebRTC (peer-to-peer video/audio streaming)

STUN servers for NAT traversal

System Architecture
Client (Next.js React)
        |
        | WebSocket (Socket.IO)
        |
Node.js + Express Signaling Server
        |
        | MongoDB
        |
Message Persistence

For video calls:

User A Browser
     |
     | WebRTC Offer/Answer (via Socket.IO signaling)
     |
Signaling Server
     |
     |
User B Browser

After negotiation:

User A  <------ Peer-to-Peer Media ------>  User B

The server only handles signaling.
Media streams flow directly between browsers using WebRTC.

Features
Realtime Messaging

Instant message delivery using WebSockets

Chat history stored in MongoDB

Infinite scroll message loading

Video Calling

Peer-to-peer video communication

WebRTC signaling through Socket.IO

STUN server configuration

Message Management

Edit messages

Delete messages

Message reactions (emoji)

File Sharing

Upload images and files

Multer file handling

File URLs stored in MongoDB

User Presence

Online users list

Join/leave room notifications

Typing indicators

Project Structure
Realtime-Chat-Application
│
├── app/                 Next.js pages and routes
├── components/          React UI components
│   ├── ChatPanel
│   ├── ChatInput
│   ├── MessageList
│   ├── VideoCall
│
├── contexts/            React context providers
├── lib/                 Utilities and socket setup
├── models/              MongoDB schemas
├── public/              Static files
│
├── server.js            Express + Socket.IO backend
│
├── package.json
├── tsconfig.json
└── README.md
Installation

Clone the repository

git clone https://github.com/Amandeep355/Realtime-Chat-Application.git

Move into the project

cd Realtime-Chat-Application

Install dependencies

npm install
Environment Variables

Create a .env file in the root folder.

Example:

MONGODB_URI=your_mongodb_connection_string
PORT=3000
Running the Application

Start the development server:

npm run dev

The application will run at:

http://localhost:3000
Video Call Flow (WebRTC)

User A starts a call

Signaling server sends incoming call event

User B accepts call

WebRTC offer/answer negotiation

ICE candidates exchanged

Peer-to-peer media connection established

API Endpoints
File Upload
POST /upload

Uploads files and returns file path.

Example response:

{
  "filePath": "/uploads/file.png"
}
Database Schema

Example Message document:

{
  username: String,
  message: String,
  room: String,
  type: "text | file",
  createdAt: Date,
  status: "sent | seen",
  reactions: Object
}
Future Improvements

Potential enhancements:

TURN servers for better WebRTC connectivity

End-to-end encryption

User authentication (JWT)

Private messaging

Push notifications

Redis scaling for Socket.IO

Kubernetes deployment

Deployment Options

The project can be deployed using:

Frontend

Vercel

Backend

Render

Railway

AWS EC2

Database

MongoDB Atlas



This project demonstrates understanding of:

Realtime system design

WebSocket architecture

WebRTC peer-to-peer networking

Node.js backend development

MongoDB data persistence

Scalable frontend architecture