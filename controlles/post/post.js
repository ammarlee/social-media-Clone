const path = require("path");
const fs = require("fs");
const Post = require("../../models/post");
const Comment = require("../../models/comment");
const User = require("../../models/user");
const clody = require("../cloud");
const io = require("../../socket");
const algoliasearch = require("algoliasearch");
const client = algoliasearch("5AX3QTWUTZ", "51ba31f56313488518c91d7571cddcde");
const index = client.initIndex("facebook");
const Moment = require("moment");
// ______________________________________

const socketAction = ({emitType,action,msg,post,userDate})=>{ 
  io.getIO().emit(emitType, {
    action,
    post,
    userDate,
    msg,
  });
}
exports.creatPost = async (req, res, next) => {
  let data = JSON.parse(req.body.data);
  const {userId,description} = data;
  let files = req.files;
  const d = Moment().format("MMMM Do YYYY, h:mm:ss a");
  let date = d.toLocaleString();

  try {
    const user = await User.findOne({ _id: userId });
    let msg ="new post has been added "
    let userDate = {
      _id: user._id,
      img: user.img,
      name: user.name,
      email: user.email,
    };
    if (files.length <= 0) {

      const post = new Post({ userId, description, date });

      await post.save();

      socketAction({emitType:'post',action:'create',msg,post,userDate})

      return res.status(200).json({ post, msg});
    }
    const uploader = async (path) => await clody.uploads(path);
    let urls = [];

    for (let file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
    }

    const images = urls.map((p) => {
      return p.url;
    });

    const post = new Post({ description, userId, img: images, date });
    await post.save();
    images.forEach((i) => {
      user.pics.push(i);
    });
    await user.save();

     socketAction({emitType:'post',action:'create',msg,post,userDate})

    res.status(200).json({ success: true, post,msg });

  } catch (error) {
    console.log(error);
    res.status(400).json({
      error,
      successful: false,
    });
  }
};
exports.deletePost = async (req, res, next) => {
  const postId = req.body.postId;
  const msg ="new post has been added "
  try {
    const deleted = await Post.findByIdAndDelete(postId);

    socketAction({emitType:'post',action:"delete",msg,post:deleted,userDate:null})

    res.status(200).json({
      success: true,
      post: deleted,
      msg: "you have deleted pthe post",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error,
      successful: false,
    });
  }
};
exports.editPost = async (req, res, next) => {
  let data = JSON.parse(req.body.data);
  const postId = data.id;
  const description = data.description;
  let files = req.files;

  try {
    let msg = "you have edited your post"

    if (files.length <= 0) {

      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { description },
        { new: true }
      );
      socketAction({emitType:'post',action:"edit",msg,post,userDate:null})

      return res.status(200).json({ post, msg });
    } else {

      const uploader = async (path) => await clody.uploads(path);
      let urls = [];
      for (let file of files) {
        const { path } = file;
        const newpath = await uploader(path);
        urls.push(newpath);
      }
      const images = urls.map((p) => {
        return p.url;
      });

      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { description, img: images },
        { new: true }
      );
      
      socketAction({emitType:'post',action:"edit",msg,post,userDate:null})
      return res.status(200).json({ post, msg});
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, success: false });
  }
};
exports.searchingInPosts = (req, res, next) => {
  index
    .search(req.body.name)
    .then((result) => {
      console.log(" found", req.body.name);
      return res.status(200).json(result.hits);
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
};
exports.createComment = async (req, res, next) => {
  const user = req.body.user;
  const postId = req.body.postId;
  const description = req.body.comment;
  const date = Moment().format("MMMM Do YYYY, h:mm:ss a");
  try {
    const comment = await Post.findOne({ _id: postId });

    comment.comments.push({
      userId: user._id,
      date,
      postId: postId,
      description: description,
      name: user.name,
      img: user.img,
    });
    await comment.save();
    const s = comment.comments.length - 1;

    io.getIO().emit("post", {
      action: "comment",
      comment: comment.comments[s],
      msg: "new post has been added ",
    });

    res
      .status(200)
      .json({ success: true, msg: "you have add a comment", comment });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, successful: false });
  }
};
exports.addLike = async (req, res, next) => {
  const userId = req.body.user._id;
  const postId = req.body.postId;
  const date = Moment().format("MMMM Do YYYY, h:mm:ss a");
  try {
    const post = await Post.findOne({ _id: postId });
    let getIndex = post.reacts.findIndex((i) => {
      return i.userId.toString() == userId.toString();
    });
    if (getIndex >= 0) {
      return;
    } else {
      post.reacts.push({ userId: userId, date });
      await post.save();
      const s = post.reacts.length - 1;

      io.getIO().emit("post", {
        action: "like",
        like: post.reacts[s],
        msg: "new like to the post ",
      });
    }
    const p = await Post.findOne({ _id: postId })
      .lean()
      .populate({
        path: "reacts.userId",
        model: "User",
        select: "name _id email img ",
      })
      .exec();
    res
      .status(200)
      .json({ success: true, msg: "you have add a like", post: p });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, successful: false });
  }
};
exports.removeLike = async (req, res, next) => {
  const userId = req.body.user._id;
  const postId = req.body.postId;
  try {
    const post = await Post.findOne({ _id: postId });
    let s = post.reacts.filter((p) => {
      return p.userId.toString() !== userId;
    });
    post.reacts = s;
    await post.save();
    const p = await Post.findOne({ _id: postId })
      .lean()
      .populate({
        path: "reacts.userId",
        model: "User",
        select: "name _id email img ",
      })
      .exec();
    res
      .status(200)
      .json({ success: true, msg: "you unlicke the post ", post: p });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, successful: false });
  }
};
exports.getComments = async (req, res, next) => {
  const postId = req.body.postId;
  try {
    const comments = await Comment.find({})
      .populate({
        path: "postId",
        populate: {
          path: "userId",
          model: "User",
        },
      })
      .exec();
    res.status(200).json({ comments, msg: "you have get the comments" });
  } catch (error) {
    res.status(400).json({ error, successful: false });
  }
};
exports.deleteComment = async (req, res, next) => {
  const postId = req.body.postId;
  const commentId = req.params.commentId;
  try {
    const comment = await Post.findByIdAndUpdate(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } }
    );
    io.getIO().emit("post", {
      action: "deleteComment",
      postId,
      commentId,
      msg: "delete comment on post ",
    });

    res
      .status(200)
      .json({
        success: true,
        postId,
        commentId,
        msg: "you have delete comment",
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error,
      successful: false,
    });
  }
};
exports.editComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  const newComment = req.body.newComment;
  const postId = req.body.postId;
  try {
    const comment = await Post.findOneAndUpdate(
      {
        _id: postId,
        comments: {
          $elemMatch: {
            _id: commentId,
          },
        },
      },
      {
        $set: {
          "comments.$.description": newComment,
        },
      },
      { new: true }
    );

    io.getIO().emit("post", {
      action: "editComment",
      commentId,
      newComment,
      postId,
      msg: "delete comment on post ",
    });
    res
      .status(200)
      .json({ success: true, comment, msg: "you have edited your comment" });
  } catch (error) {
    res.status(400).json({ error, successful: false });
  }
};
exports.savePost = async (req, res, next) => {
  const postId = req.body.postId;
  const userId = req.body.userId;
  const img = req.body.img[0];
  const description = req.body.description;
  try {
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { savedPosts: { postId, img, description, date: Date.now() } } },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, user, msg: "you have saved the post" });
  } catch (error) {
    res.status(400).json({ error, successful: false });
  }
};
exports.removePostFromFavourite = async (req, res, next) => {
  const postId = req.body.postId;
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { savedPosts: { postId: postId } } },
      { new: true }
    );

    res
      .status(200)
      .json({
        success: true,
        user: user.savedPosts,
        msg: "you have remove post from favourite ",
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, successful: false });
  }
};
exports.getSavedposts = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ _id: userId }).lean().sort({ date: 1 });
    let savedposts = user.savedPosts;
    res.status(200).json({ success: true, savedposts, msg: "saved posts " });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, successful: false });
  }
};
