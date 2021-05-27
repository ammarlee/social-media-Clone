const path = require("path");
const fs = require("fs");
const Post = require("../../models/post");
const Comment = require("../../models/comment");
const User = require("../../models/user");
const Questions = require("../../models/questions");
const Exams = require("../../models/exams");
const Ser = require("../../models/serials");
const Lec = require("../../models/lectures");
const Student = require("../../models/students");
const clody = require("../cloud");
const io = require("../../socket");
const algoliasearch = require("algoliasearch");
const client = algoliasearch("5AX3QTWUTZ", "51ba31f56313488518c91d7571cddcde");
const index = client.initIndex("facebook");
const Moment = require("moment");
// ______________________________________

// create new exams and the results also
exports.createQuestions = async (req, res, next) => {
  const { q, a1, a2, a3, a4, duration, chapter, fullMarks } = req.body;
  try {
    const newExame = new Questions({
      questions: {
        q,
        answers: [
          { a: a1, correct: true },
          { a: a2, correct: false },
          { a: a3, correct: false },
          { a: a4, correct: false },
        ],
      },
      duration,
      chapter,
      fullMarks,
      time: Date.now(),
    });
    await newExame.save();
    res.status(200).json(newExame);
  } catch (error) {
    res.status(404).json(error);
  }
};
exports.createExam = async (req, res, next) => {
  try {
    chapterte = req.body.chapter;

    const getchapterQuestions = await Questions.aggregate([
      { $match: { chapter: chapterte } },
      { $group: { _id: "$_id" } },
      { $sample: { size: 2 } },
    ]);
    let editQuestion = getchapterQuestions.map((item) => {
      return { QuestionId: item._id };
    });

    const theExam = await Exams.findOneAndUpdate(
      { _id: "604771ab225e05339869bf8f" },
      { questions: editQuestion, chapter: chapterte }
    );

    res.status(200).json(theExam);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};
exports.addNewStudent=async (req, res, next) => {
try {
  const {name,age}=req.body

  const student = new Student({name,age})
  await student.save()
  res.status(200).json(student);
  
} catch (error) {
  res.status(400).json(error);
  
}
}
exports.createSerial=async (req, res, next) => {
  try {
    const {serialNumber,CardId,valid}=req.body
    const serial = new Ser({serialNumber,CardId,valid
    })

    await serial.save()
    res.status(200).json(serial);
  } catch (error) {
    res.status(400).json(error);
  }
  }
exports.payLecture=async (req, res, next) => {
  const {serialNumber,studentId,lectureId,serialId}=req.body
  console.log();
  const date = new Date()
  try {
     // 1- check if the serialNumber is valid or not and
  const serial = await Ser.findOne({serialNumber})
  console.log(serial);
  if (serial.valid==true){
    // 1- change the seria 
  const serial = await Ser.findOneAndUpdate(
    {serialNumber:serialNumber},{valid:false,lectureDetails:{date,studentId,lectureId}})
  //  2 - work with lecture
    const lecture = await Lec.findOneAndUpdate({_id:lectureId},
      {$push:{StudentAttendance:{date,serialId,studentId}}},
      {new:true},)
// 3- work with student
    const user = await Student.findOneAndUpdate({_id:studentId},
      {$push:{lectures:{date,serialId,lectureId}}},
      {new:true}
    )
res.status(200).json(serial,lecture,user)

  }
  else{
    res.status(400).json({ msg:'your serial is wrong ' })
  }
  // 2-if vaild will make it not valid and
  // 3- if not vaild will throw an error and

    
  } catch (error) {
    console.log(error);
    res.status(400).json(error)
    
  }
 }
  exports.createLecture=async (req, res, next) => {
    try {
      const {content,chapter,duration}=req.body
      const lecture = new Lec({text:content,chapter,duration})
      await lecture.save()
      res.status(200).json(lecture);
      
    } catch (error) {
      res.status(400).json(error);
      
    }
    }
exports.fetchStudent=async (req, res, next) => {
  try {
    const studentId = req.body
    const user =await Student.find({'lectures.lectureId':{$all:
      ['6047a93a5a720e14c05a9c16']
    }})
    res.status(200).json(user)
    
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }

}
exports.getRandomQuestion = async (req, res, next) => {
  try {
    // const q = await Exam.find({},{chapter:1})
    const q = await Questions.aggregate([
      { $project: { chapter: 1 } },
      { $sample: { size: 10 } },
    ]);

    res.status(200).json(q);
  } catch (error) {
    res.status(404).json(error);
  }
};
exports.getExam = async (req, res, next) => {
  try {
    //  - 1 way with populate
    const exam = await Exams.find({ _id: "604771ab225e05339869bf8f" })
      .populate({
        path: "questions.QuestionId",
        select: "questions.q",
        model: "Questions",
      })
      .exec();
    res.status(200).json(exam);
  } catch (error) {
    res.status(404).json(error);
  }
};
// -------------- =----------------------------

exports.creatPost = async (req, res, next) => {
  let data = JSON.parse(req.body.data);
  const userId = data.userId;
  const description = data.description;
  let files = req.files;
  const d = Moment().format("MMMM Do YYYY, h:mm:ss a");
  let date = d.toLocaleString();
  try {
    const user = await User.findOne({ _id: userId });
    let userDate = {
      _id: user._id,
      img: user.img,
      name: user.name,
      email: user.email,
    };
    if (files.length <= 0) {
      const post = new Post({ userId, description, date });
      await post.save();

      io.getIO().emit("post", {
        action: "create",
        post,
        userDate,
        msg: "new post has been added ",
      });
      return res.status(200).json({ post, msg: "you have added a new post" });
    }
    const uploader = async (path) => await clody.uploads(path);
    let urls = [];
    for (let file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
    }
    console.log(urls);
    const images = urls.map((p) => {
      return p.url;
    });
    const post = new Post({ description, userId, img: images, date });
    await post.save();
    images.forEach((i) => {
      user.pics.push(i);
    });
    await user.save();
    io.getIO().emit("post", {
      action: "create",
      post,
      userDate,
      msg: "new post has been added ",
    });
    res.status(200).json({ success: true, post });
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
  try {
    const deleted = await Post.findByIdAndDelete(postId);
    io.getIO().emit("post", {
      action: "delete",
      post: deleted,
      msg: "new post has been added ",
    });
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
  console.log(files.length);
  try {
    if (files.length <= 0) {
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { description },
        { new: true }
      );
      io.getIO().emit("post", {
        action: "edit",
        post,
        msg: "edited the  post  ",
      });

      return res.status(200).json({ post, msg: "you have edited your post" });
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
      io.getIO().emit("post", {
        action: "edit",
        post,
        msg: "edited the post ",
      });

      return res.status(200).json({ post, msg: "you have edited your post" });
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
    console.log(comment.comments.length - 1);
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
  console.log(req.body);
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
