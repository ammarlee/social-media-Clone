export  default{
    data() {
        return {
         
        }
    },
    methods: {
      handelMessage(data){
        const {chatId,sender,content} = data
         const {img,_id,name} = data.sender
         const date = Date.now()
 
         this.playSound(
           "http://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3"
         );
 
         let editedMessage = {
           chatId,
           timeStamp: date,
           sender,
           content,
         };
 
         let messageContent = {
           chatId,
           content,
           senderImg:img,
           senderName:name,
           senderId:_id,
           date
         };
         this.$store.commit("addMsgToConversations", editedMessage);
         this.$store.commit("pushNewMessage", messageContent);
 
     },
        addTheNotification(data) {
            this.user._id.toString() == data.userId.toString()
              ? ""
              : this.playSound(
                  "http://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3"
                );
      
            this.sweetAlertwithImage(
              data.name,
              data.msg,
              data.img,
              "50",
              "50",
              "bottom-left",
              "5000"
            );
            if (data.role ==1) {
              
              this.$store.commit("setAllNotifications", data);
            }
          },
        initSocket() {
                // join the room
                this.$soketio.emit("joinnotificationsRoom", this.currentUser);

                //  socket for likes
                this.$soketio.on("newLikeNotification", (data) => {
                  data.role = 1
                  this.addTheNotification(data);
                });
                //   socket for new comments
                this.$soketio.on("newCommentNotification", (data) => {
                  data.role = 1
                  this.addTheNotification(data);
                });

                this.$soketio.on("newRequest", (data) => {
                  const noti = {
                    name: data.name,
                    img: data.img,
                    friendId: data.friendId,
                    action: "newNotification",
                    msg:data.msg,
                    seen:false,
                    role:2
                  };
                 this.$store.commit("friendRequestNotifications", noti);

                  this.addTheNotification(data);
                });

                this.$soketio.on("newMsgFromUrFriend", (data) => {
                  console.log("newMsgFromUrFriend",data);
                  this.handelMessage(data)
                });

                // CRUD Sockit
                this.$soketio.on("post", (data) => {
                  switch (data.action) {
                    case "create":
                      this.$store.dispatch("pushNewPost", data);
                      break;
                    case "delete":
                      this.$store.dispatch("removePost", data.post._id);
                      break;
                    case "edit":
                      this.$store.dispatch("removePost", data.post._id);
                      break;
                    case "comment":
                      this.$store.dispatch("pushNewComment", data.comment);
                      break;
                    case "deleteComment":
                      this.$store.dispatch("deleteComment", {
                        commentId: data.commentId,
                        postId: data.postId,
                      });
                      break;
                    case "editComment":
                      this.$store.dispatch("editComment", data);
                      break;
                    case "signupNewUser":
                      this.$store.dispatch("setNewUser", data.user);
                      break;
                  }
                });

                // this for get online users when they are online
                this.$soketio.on("hello", ({ _id, name, img }) => {
                  const onlineUser = this.user.newFriendsTest.find((friend) => {
                    return friend.friendId == _id;
                  });

                  if (onlineUser) {
                    let onlineFriendData = {
                      chatId: onlineUser.chatId,
                      friendName: name,
                      friendImg: img,
                      friendId: _id,
                    };
                    this.$store.commit("pushNewOnlineUser", onlineFriendData);
                  }
                });

                // for removing offline users from online list
                this.$soketio.on("broadcast", (data) => {
                  this.$store.commit("removeUserOffline", data);
                });

            
        }
    },
}