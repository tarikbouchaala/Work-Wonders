require("dotenv").config();
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { existsSync, unlinkSync } = require("fs");

const userExists = async (email) => {
  const selectedUser = await User.findOne({ email });
  return selectedUser;
};
const findUsers = async () => {
  const allUsers = await User.find();
  return allUsers;
};
const findUserById = async (id) => {
  const selectedUser = await User.findById(id);
  if (selectedUser) return selectedUser;
  else return null;
};
const registerUser = async (
  fullName,
  age,
  email,
  username,
  password,
  image,
  role
) => {
  const allUsers = await findUsers();
  const userExists = allUsers.find(
    (e) => e.email == email || e.username == username
  );
  if (userExists) {
    return null;
  } else {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    let newImage;
    if (image) {
      newImage = image;
    } else {
      newImage = "no-image.png";
    }

    const createdUser = await User.create({
      fullName,
      age,
      email,
      username,
      password: newPassword,
      role,
      image: newImage,
    });
    return createdUser;
  }
};
const loginUser = async (username, password) => {
  const allUsers = await findUsers();
  const userExists = allUsers.find((e) => e.username == username);
  if (userExists) {
    const result = await bcrypt.compare(password, userExists.password);
    if (result) {
      const token = jwt.sign({ userId: userExists._id }, process.env.SECRET);
      return {
        token,
        user: userExists,
      };
    }
    return 1;
  } else {
    return null;
  }
};

const updateUser = async (
  userId,
  fullName,
  age,
  username,
  image,
  imageFile
) => {
  const selectedUser = await findUserById(userId);
  if (selectedUser) {
    let newImage;
    if (image == undefined && imageFile == undefined) {
      image = selectedUser.image;
    } else if (image == "no-image.png" && imageFile == undefined) {
      if (existsSync(`./uploads/Users_imgs/${selectedUser.image}`)) {
        unlinkSync(`./uploads/Users_imgs/${selectedUser.image}`);
      }
      newImage = "no-image.png";
    } else if (image == null && imageFile != null) {
      if (existsSync(`./uploads/Users_imgs/${selectedUser.image}`)) {
        unlinkSync(`./uploads/Users_imgs/${selectedUser.image}`);
      }
      newImage = imageFile;
    }
    const updatedUser = User.updateOne(
      { _id: selectedUser._id },
      {
        fullName,
        age,
        username,
        image: newImage,
      }
    );
    return updatedUser;
  } else {
    return null;
  }
};
module.exports = {
  userExists,
  findUserById,
  findUsers,
  registerUser,
  loginUser,
  updateUser,
};
