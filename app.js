var bodyParser = require("body-parser");
var path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const hamlet = require("helmet");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const xss = require("xss-clean");

const AuthRoutes = require("./routes/auth");
const UserRoutes = require("./routes/user");
const PostRoutes = require("./routes/post");
const AdminRoutes = require("./routes/admin");
const HomeRoutes = require("./routes/home");

const User = require("./models/user");
const {createNewMessage} =require('./controlles/message/message')
const {getFriendsList} =require('./controlles/friends/friends')

var MongoDBStore = require("connect-mongodb-session")(session);
const MONGODB_URI =
  "mongodb+srv://ammarlee:tonightwewilldoit@cluster0.j47ye.mongodb.net/facebook";

var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json({ type: "application/*+json", inflate: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type , Auzhorization");
  next();
});
let cors = require("cors");
const socket = require("./socket");
// app.use(hamlet())
app.use(morgan("dev"));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(
  cors({
    // origin: ["http://localhost:8080", "https://www.facebook.com"],
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // enable set cookie
    exposedHeaders: ["set-cookie"],
  })
);
// SAVE THE SESSION IN THE DATABASE
var store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "mySessions",
});
app.use(
  session({
    secret: "This is a secret",
    name: "my test",
    cookie: {
      secure: false,
      maxAge: 30000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(require("connect-livereload")());
// use passport for fb
// const passport = require('passport')
// const facebookStrategy = require('passport-facebook').Strategy
// app.use(passport.initialize());
// app.use(passport.session());
// require('./Passport')

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const { graphqlHTTP } = require("express-graphql");
const Firstschema = require("./graphql/schema");
const resolver = require("./graphql/resolvers");
app.use(
  "/graphql",
  graphqlHTTP({
    schema: Firstschema,
    rootValue: resolver,
    graphiql: true,
  })
);
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(AuthRoutes);
app.use(PostRoutes);
app.use(UserRoutes);
app.use("/admin", AdminRoutes);
app.use(HomeRoutes);



mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(3000);
    const io = require("./socket").init(server);
    io.onlineUsersTwo = {};

    io.on("connection", (socket) => {

      console.log(`user connected :${socket.id}`);
      let date = Date.now();

      // first step [get user id and then add it to the room]
      socket.on("joinnotificationsRoom", (data) => {
        console.log(`joind notifiction room `);
        socket.join(data._id);
      });
      // second step
      socket.on("sendFriendRequest", (data) => {
        const { msg, name, userId, friendId, img } = data;
        io.to(friendId).emit("newRequest", {
          msg,
          name,
          userId,
          friendId,
          img,
          action: "newNotification",
          date,
        });
      });
      // make comment
      socket.on("makeComment", (data) => {
        const { name, userId, friendId, img, postId } = data;
        io.to(friendId).emit("newCommentNotification", {
          action: "newCommentNotification",
          msg: " have comment on your post  ",
          name,
          userId,
          friendId,
          img,
          postId,
          date,
        });
      });
      // add like
      socket.on("addLike", (data) => {
        const { name, userId, friendId, img, postId } = data;
        io.to(friendId).emit("newLikeNotification", {
          action: "newLikeNotification",
          msg: " have like on your post  ",
          name,
          userId,
          friendId,
          img,
          postId,
          date,
        });
      });
      // get friends online to chat with them
      socket.on("goOnlineTwo", (data) => {
        io.onlineUsersTwo[data._id] = true;

        //  second step is
        getFriendsList(data._id).then((friends) => {
          let onlineFriends = friends.filter(
            (friend) => io.onlineUsersTwo[friend.friendId._id]
          ); 
          socket.emit("currentOnlineFriendsTwo", onlineFriends);
          io.sockets.emit("hello", data);
        });

        socket.on("disconnect", (data) => {
          io.onlineUsersTwo[data._id] = false;
          io.sockets.emit("broadcast", data._id);
        });
      });

      // in message page to send msg
      socket.on("JoinChat", (data) => {
        socket.join(data);
      });

      socket.on("sendMessage", (data) => {
        createNewMessage(data).then(() => {
          io.to(data.friendId).emit("newMsgFromUrFriend", data);
        });
      });
      
    });
  })
  .catch((err) => {
    console.log(err);
  });
