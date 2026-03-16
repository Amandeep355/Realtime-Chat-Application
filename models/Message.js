const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

  /* ---------- Sender ---------- */

  username: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  /* ---------- Room ---------- */

  room: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  /* ---------- Message Content ---------- */

  message: {
    type: String,
    required: true,
    trim: true
  },

  /* ---------- Message Type ---------- */

  type: {
    type: String,
    enum: ["text", "file", "audio"],
    default: "text"
  },

  /* ---------- Delivery Status ---------- */

  status: {
    type: String,
    enum: ["sent", "delivered", "seen"],
    default: "sent",
    index: true
  },

  /* ---------- Edited Flag ---------- */

  edited: {
    type: Boolean,
    default: false
  },

  /* ---------- Pinned Message ---------- */

  pinned: {
    type: Boolean,
    default: false,
    index: true
  },

  /* ---------- Emoji Reactions ---------- */

  reactions: {
    type: Map,
    of: Number,
    default: {}
  },

  /* ---------- Timestamp ---------- */

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }

});

/* ---------- Full Text Search Index ---------- */

messageSchema.index({
  message: "text",
  username: "text"
});

/* ---------- Compound Index for Room + Time ---------- */

messageSchema.index({
  room: 1,
  createdAt: -1
});

/* ---------- Model Export ---------- */

module.exports = mongoose.model("Message", messageSchema);