var bodyParser = require('body-parser')
var path = require('path');
const mongoose = require('mongoose')
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const multer =require('multer')
const hamlet = require('helmet')
const hpp = require('hpp')
const mongoSanitize = require('express-mongo-sanitize')
const morgan = require('morgan');
const xss = require('xss-clean')
const AuthRoutes = require('./routes/auth')
const UserRoutes =require('./routes/user')
const PostRoutes =require('./routes/post')
const AdminRoutes = require('./routes/admin')
const HomeRoutes =require('./routes/home')
var MongoDBStore = require('connect-mongodb-session')(session)
const cookieParser = require('cookie-parser')
const User = require('./models/user')
const Message = require('./models/message')
const  livereload = require('connect-livereload')
const MONGODB_URI ='mongodb+srv://ammarlee:tonightwewilldoit@cluster0.j47ye.mongodb.net/facebook'; 

var app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(bodyParser.json(({ type: 'application/*+json', inflate: false })));
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin' , '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Auzhorization')
    next()
})
let cors = require('cors');
const socket = require('./socket');
app.use(hamlet())
app.use(morgan('dev'))

app.use(mongoSanitize())
app.use(xss())
app.use(hpp())
app.use(cors({
   origin:['http://localhost:8080'],
    methods:['GET','POST'],
    credentials: true ,// enable set cookie
    exposedHeaders: ['set-cookie']
}))
// SAVE THE SESSION IN THE DATABASE 
var store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'mySessions'
});
app.use(session({
       secret: 'This is a secret',
       name:'my test',
    cookie: {
      secure:false,
        maxAge: 30000  *60 * 60 * 24 * 7 // 1 week
      },
      store: store,
      resave: false,
      saveUninitialized: false
    }))
app.use(require('connect-livereload')())

app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

app.use((req,res,next)=>{
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
})

app.use(AuthRoutes)
app.use(PostRoutes)
app.use(UserRoutes)
app.use('/admin',AdminRoutes)
app.use(HomeRoutes)
//  test Two 
let getFriendsTwo = async(userId)=>{
  try {
    const friends = await User.findOne({_id:userId})
    .populate({ 
        path: 'newFriendsTest',
        populate: {
          path: 'friendId ',
          select:'name img email',
          model:'User',
        } 
    }).exec()
 
     return friends.newFriendsTest

  } catch (error) {
       throw new Error(error)
       
  }
  
}
const moment = require('moment')
let newMsg = async(data)=>{
  try {
    const msg = await new Message({
      chatId:data.chatId,
      content:data.content,
      sender:data.sender._id,
      timeStamp:Date.now()
    })
    let u = await User.findOne({_id:data.friendId})
    // save the 
    let f =u.messageNotifications.findIndex(i=>{
      return i.chatId.toString() == data.chatId.toString()
    })
    let dd = {  chatId:data.chatId,
          content:data.content,
          senderImg:data.sender.img,
          senderName:data.sender.name,
          senderId:data.sender._id,
          date:Date.now()};
    if (f>=0) {
      u.messageNotifications[f] = dd
    }else{
      u.messageNotifications.push(dd)
    }

    await msg.save()
    await u.save()
    return {msg,u}
  } catch (error) {
    console.log(error);

    
  }
}
mongoose
  .connect(MONGODB_URI)
  .then(() => {
   
    // app.listen(3000);
    const server = app.listen(3000);
    const io = require('./socket').init(server)
    io.onlineUsersTwo ={}
   io.on('connection',socket=>{
     // first step [get user id and then add it to the room] 
    socket.on('joinnotificationsRoom',(data)=>{
     socket.join(data._id)
    })
      // second step
      socket.on('sendFriendRequest',(data)=>{
        console.log('sendFriendRequest >>>>>>>>>>>>>');
        io.to(data.friendId).emit('newRequest',
        {
        action:"newNotification",
        msg:data.msg,
        name:data.name,
        userId:data.userId,
        friendId:data.friendId,
        img:data.img,
        date:Date.now()
      })
      })
    // make comment
    socket.on('makeComment',(data)=>{
      io.to(data.friendId).emit('newCommentNotification',{
        action:'newCommentNotification',
        msg:' have comment on your post  ',
        name:data.name,
        postId:data.postId, 
        userId:data.userId,
        img:data.img,
        friendId:data.friendId,
        date:Date.now()
      })

    })
    // add like 
    socket.on('addLike',(data)=>{
      io.to(data.friendId).emit('newLikeNotification',{
        action:'newLikeNotification',
        msg:' have like on your post  ',
        name:data.name,
        postId:data.postId,
        userId:data.userId,
        img:data.img,
        friendId:data.friendId,
        date:Date.now()

      })

    })
    // get friends online to chat with them 
    socket.on('goOnlineTwo',data=>{
      io.onlineUsersTwo[data._id]=true
      //  second step is
      getFriendsTwo(data._id).then(friends=>{
        let onlineFriends = friends.filter(friend=>io.onlineUsersTwo[friend.friendId._id])
        socket.emit('currentOnlineFriendsTwo',onlineFriends)
        io.sockets.emit("hello", data);
      })
      socket.on('disconnect',(data)=>{ 
      io.onlineUsersTwo[data._id]=false
      io.sockets.emit("broadcast", data._id);
      })
    })
   
    // in message page to send msg
    socket.on('JoinChat',data=>{
      socket.join(data) 
    })
    socket.on('sendMessage',data=>{
      newMsg(data).then(()=>{
        io.to(data.friendId).emit('newMsgFromUrFriend',data)
      })
    })
   })
}) 
  .catch(err => {
    console.log(err);
  });
 