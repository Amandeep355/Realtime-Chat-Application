require("dotenv").config();

const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");
const next = require("next");
const { Server } = require("socket.io");
const multer = require("multer");
const mongoose = require("mongoose");

const Message = require("./models/Message");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const PORT = process.env.PORT || 3000;

nextApp.prepare().then(async () => {

  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: "*" }
  });

  /* ---------------- MongoDB ---------------- */

  try {

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ Connected to MongoDB Atlas");
    console.log("Database:", mongoose.connection.name);

  } catch (err) {

    console.error("❌ MongoDB connection error:", err);

  }

  /* ---------------- Active Users ---------------- */

  const users = {};

  /* ---------------- Upload Setup ---------------- */

  const uploadsDir = path.join(__dirname, "public", "uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname || ".bin"));
    }
  });

  const upload = multer({ storage });

  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  /* ---------------- File Upload API ---------------- */

  app.post("/upload", upload.single("file"), (req, res) => {

    res.json({
      filePath: "/uploads/" + req.file.filename
    });

  });

  /* ---------------- Socket.IO ---------------- */

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    /* ---------- Join Room ---------- */

    socket.on("join-room", async ({ name, room: rawRoom }) => {

      const room = String(rawRoom || "").trim().toLowerCase();
      const username = String(name || "").trim();

      if (!room || !username) return;

      users[socket.id] = {
        name: username,
        room
      };

      socket.join(room);

      try {

        const messages = await Message.find({ room })
          .sort({ createdAt: -1 })
          .limit(50);

        socket.emit("chat-history", messages.reverse());

      } catch (err) {

        console.error("History load error:", err);

      }

      const members = getUsersInRoom(room);

      socket.to(room).emit("user-joined", username);
      io.to(room).emit("online-users", members);

      socket.emit("room-joined", { room, members });

    });

    /* ---------- Typing Indicator ---------- */

    socket.on("typing", () => {

      const user = users[socket.id];
      if (!user) return;

      socket.to(user.room).emit("typing", {
        username: user.name
      });

    });

    socket.on("stop-typing", () => {

      const user = users[socket.id];
      if (!user) return;

      socket.to(user.room).emit("stop-typing", {
        username: user.name
      });

    });

    /* ---------- Send Message ---------- */

    socket.on("send", async (message) => {

      const user = users[socket.id];
      if (!user) return;

      try {

        const saved = await new Message({
          username: user.name,
          message,
          room: user.room,
          type: "text",
          createdAt: new Date(),
          status: "sent",
          reactions: {}
        }).save();

        io.to(user.room).emit("receive", saved);

      } catch (err) {

        console.error("Save error:", err);

      }

    });

    /* ---------- Send File ---------- */

    socket.on("send-file", async ({ filePath }) => {

      const user = users[socket.id];
      if (!user) return;

      try {

        const saved = await new Message({
          username: user.name,
          message: filePath,
          room: user.room,
          type: "file",
          createdAt: new Date(),
          status: "sent",
          reactions: {}
        }).save();

        io.to(user.room).emit("receive", saved);

      } catch (err) {

        console.error("File save error:", err);

      }

    });

    /* ---------- WebRTC Signaling ---------- */

    socket.on("start-call", ({ room, callerName }) => {

      socket.to(room).emit("incoming-call", {
        callerId: socket.id,
        callerName
      });

    });

    /* Offer */

    socket.on("call-user", ({ offer, room }) => {

      socket.to(room).emit("call-user", {
        offer,
        callerId: socket.id
      });

    });

    /* Answer */

    socket.on("answer-call", ({ answer, caller }) => {

      io.to(caller).emit("call-answered", { answer });

    });

    /* ICE candidates */

    socket.on("ice-candidate", ({ candidate, room }) => {

      socket.to(room).emit("ice-candidate", { candidate });

    });

    socket.on("end-call", ({ room }) => {

      socket.to(room).emit("call-ended");

    });

    /* ---------- Disconnect ---------- */

    socket.on("disconnect", () => {

      const user = users[socket.id];
      if (!user) return;

      socket.to(user.room).emit("user-left", user.name);

      delete users[socket.id];

      io.to(user.room).emit(
        "online-users",
        getUsersInRoom(user.room)
      );

      console.log("User disconnected:", socket.id);

    });

  });

  /* ---------------- Helper ---------------- */

  function getUsersInRoom(room) {

    return Object.entries(users)
      .filter(([_, user]) => user.room === room)
      .map(([socketId, user]) => ({
        socketId,
        name: user.name
      }));

  }

  /* ---------------- Next.js Handler ---------------- */

  app.use((req, res) => handle(req, res));

  /* ---------------- Start Server ---------------- */

  server.listen(PORT, () => {

    console.log(`✅ Server running at http://localhost:${PORT}`);

  });

});