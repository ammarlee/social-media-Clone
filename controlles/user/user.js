const path = require("path");
const fs = require("fs");
const Post = require("../../models/post");
const User = require("../../models/user");
const Chat = require("../../models/chat");
const io = require('../../socket')
const Msg = require("../../models/message");
const clody =require('../cloud')
const { cloudinary } = require("../cloudinary");

exports.profile = async (req, res, next) => {
  const friendId = req.params.friendId;
  const userId = req.body.userId;
  try {
    const user = await User.findOne({ _id: friendId }).lean();
    const user2 = await User.findOne({ _id: userId }).lean();
    // 1-check if the user is exist friends List or not 
    const isFriend = user.newFriendsTest.some((p) => {
      return p.friendId.toString() == userId.toString();
    });
    // 2-check if the user is exist friend requests or not 
    const isinRequests = user.friendsRequests.some((i) => {
      return i.toString() == userId.toString();
    });
    // 3-check if the user is exist friend requests or not 
    const newFriendsRequests = user2.newFriendsRequests.some((i) => {
      return i.toString() == friendId.toString();
    });

    res
      .status(200)
      .json({
        infriendsList: isFriend,
        inRequestFriends: isinRequests,
        newFriendsRequests,
        user,
        msg: "you got your profile informations",
      });
  } catch (error) {
    res.status(400).json({ error, successful: false });
  }
};
exports.getSpecificUser=async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ _id: userId }).lean();
    res
      .status(200)
      .json({
        user,
        msg: "you got your profile informations",
      });
  } catch (error) {
    res.status(400).json({ error, successful: false });
  }
};

exports.getUserWithToken=async (req, res, next) => {
  const userToken = req.params.userToken;
  try {
    const user = await User.findOne({ userToken: userToken }).lean();
    if (user) {
      
      res
        .status(200)
        .json({
          user,
          msg: "you got your profile informations",
        });
    }else{
      res
      .status(200)
      .json({
        user:null,
        msg: "you got your profile informations",
      });

    }
  } catch (error) {
    res.status(400).json({ error, successful: false });
  }
};
exports.currentUser = async (req, res, next) => {
  let userId = req.params.id || req.user._id;
  try {
    const user = await User.findOne({ _id: userId }).lean();
    res.status(200).json({ user, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, successful: false });
  }
};
exports.EditProfile = async (req, res, next) => {
  const userId = req.params.userId;
  const { name, email, age, city, phone, bio } = req.body;
  const files = req.body.img;
  // console.log(files);
  try {
    if (!files) {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { name, email, age, city, phone, bio },
        { new: true }
      );
      return res
        .status(200)
        .json({ user, msg: "you have edited your profile" });
    }
    const respo = await cloudinary.uploader.upload(files, {
      upload_preset: "byr4al94",
    });
    const newImage = respo.secure_url;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { name, email, age, city, bio,phone, img: newImage }
    );
    const pic = await User.findOne({ _id: userId });
    pic.pics.push(newImage);
    await pic.save();

    return res.status(200).json({ user:pic, msg: "you have edited your profile" });
  } catch (error) {
    res.status(400).json({ error, successful: false });
  }
};

exports.EditCover = async (req, res, next) => {
  const userId = req.params.userId;
  let files = req.files
  try {
    const uploader = async(path)=>await clody.uploads(path)
    let urls = []
      const path =files[0].path
      const newpath = await uploader(path)
      urls.push(newpath)
    const newImg = urls[0].url
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { coverImg: newImg }
    );
    return res
      .status(200)
      .json({ user,newImage:newImg, msg: "you have edited your profile cover image" });
  } catch (error) {
    res.status(400).json({ error, successful: false });
  }
};
exports.othersMsg=async(req,res,next)=>{
  const { userId, otherId } = req.body;
  try {
    // 1- check if there is old msg for them or not 
    const showFirst = await Chat.findOne(
       {"users.userId":userId,"users.friendId":otherId})
 
    if (showFirst) {
      const user = await User.findOne( { _id: userId }).lean()
    return  res.status(200).json({ msg: "youother msg ", user, chatId:showFirst });
    }
    // 2 - if there is no old msg between them 
    const chat = new Chat({
      users: { userId, friendId:otherId },
    });
    let newChat = await chat.save();
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { otherMessages: { otherId, chatId: newChat } } },
      { new: true }
    );
    const SecondUser = await User.findByIdAndUpdate(
      { _id: otherId },
      { $push: { otherMessages: { otherId:userId, chatId: newChat } } },
      { new: true }
    );
    res.status(200).json({ msg: "youother msg ", user, SecondUser,
  chatId:newChat });

    
  } catch (error) {
    res.status(400).json({ error });
  }

}
exports.acceptNewFriend = async (req, res, next) => {
  try {
    const { userId, friendId } = req.body;
    const chat = new Chat({
      users: { userId, friendId },
    });
    let newChat = await chat.save();

    // THE FIRST USER
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: 
        { newFriendsTest: { friendId, chatId: newChat },
         friendsList:friendId} },
      { new: true }
    );
   
    const user2 = await User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { friendsRequests: friendId ,newFriendsRequests:friendId} }
    );
// the other user
    const friend3 = await User.findByIdAndUpdate(
      { _id: friendId },
      { $pull: { friendsRequests: userId,newFriendsRequests:userId } ,},
      { new: true }
    );

    const friend = await User.findByIdAndUpdate(
      { _id: friendId },
      { $push: { newFriendsTest: { friendId: userId, chatId: newChat }, friendsList:userId} }
    );
  
   res.status(200).json({ msg: "you have added new friend", user, friend });
   
  } catch (error) {
    res.status(400).json({ error });
  }
};
exports.friendRequestnotifications = async (req, res, next) => {
  const { userId, friendId, img, name,msg } = req.body;
  try {
    const user = await User.findOne({ _id: friendId });
    const date = Date.now()
    const h = { friendId:userId, img, name, date ,msg};
    user.friendsNotifications.push(h);
    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error });
  }
};
exports.pushAllNotifications = async (req, res, next) => {
  const { userId, friendId, name, msg, img,action,postId } = req.body;
  if (userId ==friendId) {
    console.log('the same one ');
    
  }else{
    try {
      const user = await User.findOne({ _id: friendId });
      const h = {
         friendId, 
         userId,
          img,
          action,
          name, 
          date:Date.now(),
          msg,
          postId };
      user.AllNotifications.unshift(h);
      await user.save();
      res.status(200).json({ user });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
};
exports.rejectNewFriend = async (req, res, next) => {
  try {
    const { userId, friendId } = req.body;
    const user2 = await User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { friendsRequests: friendId } }
    );

    const friend2 = await User.findByIdAndUpdate(
      { _id: friendId },
      { $pull: { friendsRequests: userId } }
    );

    res.status(200).json({ msg: "you have added new friend", user2, friend2 });
  } catch (error) {
    res.status(400).json({ error });
  }
};
exports.addFriendRequest = async (req, res, next) => {
  const { userId, friendId } = req.body;
  try {
    // 1-get the friend data with id and add id for the user to it 
    const friend = await User.findOneAndUpdate(
      { _id: friendId },
      { $push: { friendsRequests: userId ,newFriendsRequests:userId} },
      { new: true }
    );
    // 1-get the another user data with id and add id for the friend to it 
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { friendsRequests: friendId } },
      { new: true }
    );
    res.status(200).json({ user, friend });
  } catch (error) {
    res.status(404).json({ error });
  }
};
exports.getFriends = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const friends = await User.findOne({ _id: userId }).lean().populate({
        path:'friendsList',
        select:'name age img ',
        model:'User',
    }).exec()
  
    res
      .status(200)
      .json({
        successful: true,
        msg: "you have friends",
        friends:friends.friendsList
      });
  } catch (error) {
    res.status(400).json({ error, successful: false });
  }
};

exports.testChat = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const friends = await User.findOne({ _id: userId }).lean()
      .populate({
        path: "newFriendsTest",
        populate: {
          path: "friendId ",
          select: "name img email",
          model: "User",
        },
      })
      .exec();
    res.status(200).json({ friends: friends.newFriendsTest });
  } catch (error) {
    res.status(400).json({ error, successful: false });
  }
};
exports.getMessage = async (req, res, next) => {
  const chatId = req.params.id;
  try {
    const ChatDetails = await Chat.findOne({_id: chatId}).lean();
    const chat = await Msg.find({ chatId: chatId }, null, {
      sort: {
        timeStamp: 1,
      },
    }).lean()
      .populate({
        path: "sender",
        select: "name img email",
        model: "User",
      })
      
    res.status(200).json({ chat,ChatDetails, successful: true });
  } catch (error) {
    res.status(400).json({ error, successful: false });
  }
};
exports.friendsRequests = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const friends = await User.findOne({ _id: userId }).lean()
      .populate(  { path: 'newFriendsRequests', select: 'name _id img' } )
      .exec()
    const filterFriends = friends.newFriendsRequests

    res
      .status(200)
      .json({
        successful: true,
        msg: "you have friends",
        friends: filterFriends,
      });
  } catch (error) {
    res.status(400).json({ error, successful: false });
  }
};
exports.deletFriend = async (req, res, next) => {
  const friendId = req.params.friendId;
  const userId = req.body.userId;
  try {
    const user1 = await  User.updateOne(
      { _id: userId },
      { $pull: { 'newFriendsTest': { friendId: friendId }} } ,{
        multi: false
    })
    const user2 = await  User.updateOne(
      { _id: friendId },
      { $pull: { 'newFriendsTest':{ friendId: userId }}  },{
        multi: false
    })
    res
      .status(200)
      .json({ userfinsih:user1, successful: true, msg: "you have deleted a friend" });
  } catch (error) {
    res.status(400).json(error);
  }
};
