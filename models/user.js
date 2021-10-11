const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  img: {
    type: String,
    default:
      "https://res.cloudinary.com/ammarleejot/image/upload/v1609954985/j7v7ezyvnax9fuokrryb.jpg",
  },
  pics: {
    type: Array,
  },
  coverImg: {
    type: String,
    default:
      "https://res.cloudinary.com/ammarleejot/image/upload/v1610559469/mevnstack/zxnem5w4ecxhq4jbqvl2.jpg",
  },
  password: {
    type: String,
    required: true,
    // select:false
  },
  phone: {
    type: Number,
  },
  resetToken: {
    type: String,
  },
  userToken: { type: String, default: "" },
  bio: {
    type: String,
  },
  age: {
    type: Number,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },

  newFriendsTest: [
    {
      friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    },
  ],
  otherMessages: [
    {
      otherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    },
  ],
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  friendsRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  newFriendsRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendsList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  AllNotifications: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
      msg: { type: String },
      action: String,
      name: String,
      img: String,
      date: String,
      seen: { type: Boolean, default: false },
    },
  ],
  messageNotifications: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
      content: { type: String },
      senderName: String,
      senderImg: String,
      date: String,
      seen: { type: Boolean, default: false },
    },
  ],
  friendsNotifications: [
    {
      friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      msg: { type: String },
      name: String,
      img: String,
      date: String,
      seen: { type: Boolean, default: false },
    },
  ],
  savedPosts: [
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
      img: String,
      description: String,
      date: String,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
