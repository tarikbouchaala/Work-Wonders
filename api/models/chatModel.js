const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ChatModel = new Schema(
  {
    between: [Schema.Types.ObjectId],
  },
  { timestamps: true }
);

module.exports = mongoose.model("chats", ChatModel);
