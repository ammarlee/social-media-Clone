import axios from './mainApi';

class Functions{
// ADMIN ROUTERS
//------------------------------------------------------------------------------
static  getPosts(){
    return  axios().get(`admin/posts`)
}
static  getusers(){
    return  axios().get(`admin/users`)
}
static  getuserWithToken(token){
    return  axios().get(`getuserToken/${token}`)
}
static   deleteUser(data){
    return  axios().post(`admin/delete-user/${data.userId}`,
    {pic:data.pic,profile:data.profile})
}
static   adminEditPost(data){
    return  axios().post(`admin/edit-post/${data.userId}`,
    {pic:data.pic,profile:data.profile})
}
static   deletePost(data){
    return  axios().post(`admin/delete-post/${data.postId}`,
    {pic:data.pic,profile:data.profile})
}
// AUTHANTICATION ROUTERS
//------------------------------------------------------------------------------

static   login(data){
    return  axios().post(`login`,
    {email:data.email,password:data.password})
}
static   signup(data){
    return  axios().post(`signup`,
    data)
}
static   resetPassword(data){
    return  axios().post(`reset-password`,data)
}

static   forgetPassword(data){
    return  axios().post(`forget`,
    {email:data.email})
}
static   logout(){
    // eraseCookie()
    return  axios().post(`logout`)
}
static  getuserToken(token){
    return  axios().get(`user/${token}`)
}
// HOME ROUTES
//------------------------------------------------------------------------------

static  homePage(){
    return  axios().get(``)
}
static  searchingBar(data){
    return  axios().get(`searching`,data)
}
// POSTS ROUTERS
//------------------------------------------------------------------------------

static   createPost(data){
    return  axios().post(`create-post`,data)
}
static   editPost(data){
    return  axios().post(`edit-post`,data)
}
static   deletPost(postId){
    return  axios().post(`delete-post`,{postId})
}
static   creatComment(data){
    return  axios().post(`create-comment`,
    {user:data.user,comment:data.comment,postId:data.postId})
}

static   addLike(data){
    return  axios().post(`add-like`,
    {user:data.user,postId:data.postId})
}
static   removeLike(data){
    return  axios().post(`remove-like`,
    {user:data.user,postId:data.postId})
}
static   deleteComment(data){
    return  axios().post(`delete-comment/${data.commentId}`,{postId:data.postId})
}
static   savePost(data){
    return  axios().post(`save-post`,
    {postId:data.post._id,img:data.post.img,description:data.post.description,userId:data.userId})
}
static   removeSaved(data){
    return  axios().post(`zremoveSaved`,data)
}

static   getSavedPosts(data){
    return  axios().get(`saved-posts/${data}`)
}

static   editComment(data){
    return  axios().post(`edit-comment/${data.commentId}`,
    {postId:data.postId,newComment:data.newComment})
}
static  getComments(data){
    return  axios().get(`comments`,data)
}

// USER ROUTERS
//------------------------------------------------------------------------------
static  getYourProfile(data){
    let userId=data.userId._id
    return  axios().post(`profile/${data.friendId}`, {userId} )
}
static  getSpecificUser(data){
    return  axios().get(`getSpecificUser/${data}`)
}

static  getCurrentUser(data){
    return  axios().get(`current-user/${data}`)
}
static  getFreindRequest(data){
    return  axios().get(`friendsRequests/${data}`)
}
static  getFriends(data){
    return  axios().get(`friends/${data}`)
}
static   editProfile(data){
    return  axios().post(`edit-profile/${data.userId}`,data
    )
}
static   editCover(data){
    return  axios().post(`edit-cover/${data.userId}`,data.formData)
}
static   sendFriendRequest(data){
    return  axios().post(`add-friend-request/`,
    {userId:data.userId,friendId:data.friendId})
}
static   deleteFriend(data){
    return  axios().post(`delete-friend/${data.friendId}`,
    {userId:data.userId})
}
static   acceptNewFriend(data){
    return  axios().post(`accept-new-friend/`,
    {userId:data.userId,friendId:data.friendId})
}
static   msgFromOthers(data){
    return  axios().post(`others-msg/`,
    {userId:data.userId,otherId:data.otherId})
}

static   rejectfriend(data){
    return  axios().post(`reject-new-friend/`,
    {userId:data.userId,friendId:data.friendId})
}
static   friendRequestNotifications(data){
    return  axios().post(`friends-request-notification/`,
    {userId:data.userId,friendId:data.friendId,name:data.name,img:data.img,msg:data.msg})
}

static   pushToAllNotifications(data){
    return  axios().post(`push-all-notifications/`,
    {userId:data.userId,friendId:data.friendId,msg:data.msg,postId:data.postId,action:data.action,name:data.name,img:data.img})
}
static   getMessage(data){
    return  axios().get(`get-message/${data}`)
}

}
export default Functions
