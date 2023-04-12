const express = require("express");
const {
  userChats,
  sendMessage,
  getMessages,
} = require("../controllers/ChatController");
const VerifyToken = require("../middleware/Auth");
const route = express.Router();

route.get("/all", VerifyToken, async (req, res) => {
  try {
    const userConversation = await userChats(req.userId);
    if (userConversation == "User doesn't exists") {
      return res.json({ status: 404, msg: userConversation });
    }
    return res.json({ status: 200, userConversation });
  } catch (error) {
    return res.json({ status: 505, msg: "Error Occured: " + error.message });
  }
});

route.get("/messages/:chatId", VerifyToken, async (req, res) => {
  try {
    const messages = await getMessages(req.params.chatId, req.userId);
    if (messages == "Conversation doesn't exists") {
      return res.json({ status: 404, msg: messages });
    }
    return res.json({ status: 200, messages });
  } catch (error) {
    return res.json({ status: 505, msg: "Error Occured: " + error.message });
  }
});

route.post("/sendMessage", VerifyToken, async (req, res) => {
  try {
    const createdConversation = await sendMessage(
      req.userId,
      req.body.receiver,
      req.body.text
    );
    if (createdConversation == "User doesn't exists") {
      return res.json({ status: 404, msg: createdConversation });
    }
    return res.json({ status: 200, msg: createdConversation });
  } catch (error) {
    return res.json({ status: 505, msg: "Error Occured: " + error.message });
  }
});

module.exports = route;
