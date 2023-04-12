const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const MessageModel = new Schema(
  {
    chatId: Schema.Types.ObjectId,
    senderId: Schema.Types.ObjectId,
    text: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", MessageModel);
