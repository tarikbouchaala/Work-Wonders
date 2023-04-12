const User = require("../models/UserModel");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

const findChatById = async (chatId) => {
  const selectedChat = await Chat.findById(chatId);
  return selectedChat;
};

const findChat = async (senderId, receiverId) => {
  const selectedSender = await User.findById(senderId);
  const selectedReceiver = await User.findById(receiverId);
  if (selectedReceiver != null && selectedSender != null) {
    const selectedChat = await Chat.findOne({
      between: { $all: [senderId, receiverId] },
    });
    return selectedChat;
  }
  return "User doesn't exists";
};

const createChat = async (senderId, receiverId) => {
  const selectedSender = await User.findById(senderId);
  const selectedReceiver = await User.findById(receiverId);
  if (selectedReceiver != null && selectedSender != null) {
    const chatExists = await findChat(senderId, receiverId);
    if (chatExists == null) {
      const createdChat = await Chat.create({
        between: [senderId, receiverId],
      });
      return createdChat._id;
    }
    return chatExists._id;
  }
  return "User doesn't exists";
};

const userChats = async (userId) => {
  const selectedUser = await User.findById(userId);
  if (selectedUser) {
    const userChats = await Chat.find({ between: { $in: [userId] } });
    if (userChats.length != 0) {
      let conversationUsersInfo = [];
      for (let i of userChats) {
        const chatWith = i.between[0] != userId ? i.between[0] : i.between[1];
        const chatWithUserInfo = await User.findById(chatWith);
        const lastMessageWithUser = await Message.findOne({
          chatId: i._id,
        }).sort({ createdAt: -1 });
        conversationUsersInfo.push({
          _id: i._id,
          avatar: chatWithUserInfo.image,
          username: chatWithUserInfo.username,
          msg: lastMessageWithUser.text,
        });
      }
      return conversationUsersInfo;
    }
    return userChats;
  }
  return "User doesn't exists";
};

const getMessages = async (chatId, userId) => {
  const selectedUser = await User.findById(userId);
  const selectedChat = await findChatById(chatId);
  const chatTime = selectedChat.createdAt;
  if (selectedUser != null && selectedChat != null) {
    const withUser =
      selectedChat.between[0] != userId
        ? selectedChat.between[0]
        : selectedChat.between[1];
    const withUserInfo = await User.findById(withUser);
    const conversationMessages = await Message.find({ chatId });
    return {
      conversationMessages,
      withInfo: {
        _id: withUserInfo._id,
        avatar: withUserInfo.image,
        username: withUserInfo.username,
      },
      chatTime,
    };
  }
  return "Conversation doesn't exists";
};

const sendMessage = async (senderId, receiverId, text) => {
  const selectedSender = await User.findById(senderId);
  const selectedReceiver = await User.findById(receiverId);
  if (selectedReceiver != null && selectedSender != null) {
    const conversationId = await createChat(senderId, receiverId);
    const createdMessage = await Message.create({
      chatId: conversationId,
      senderId,
      text,
    });
    return "Message Sent Successfully";
  }
  return "User doesn't exists";
};

module.exports = {
  userChats,
  getMessages,
  sendMessage,
};
