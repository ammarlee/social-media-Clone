import axios from 'axios';
const url = "https://facebook-clones.herokuapp.com/"
//  find the cooki name
const find= function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
// delete the cooki 
function eraseCookie() {   
    document.cookie = "TokenUser"+'=; Max-Age=-99999999;';  
}
// send the JTW with headers
let axiosConfig = {
    headers: {
        'authorization':`Bearer ${find('TokenUser')}`
    }
  };

class Functions{
// ADMIN ROUTERS
//------------------------------------------------------------------------------
static async getPosts(){
    return await axios.get(`${url}admin/posts`,axiosConfig)
}
static async getusers(){
    return await axios.get(`${url}admin/users`,axiosConfig)
}
static async getuserWithToken(token){
    return await axios.get(`${url}getuserToken/${token}`,axiosConfig)
}
static async  deleteUser(data){
    return await axios.post(`${url}admin/delete-user/${data.userId}`,
    {pic:data.pic,profile:data.profile})
}
static async  adminEditPost(data){
    return await axios.post(`${url}admin/edit-post/${data.userId}`,
    {pic:data.pic,profile:data.profile})
}
static async  deletePost(data){
    return await axios.post(`${url}admin/delete-post/${data.postId}`,
    {pic:data.pic,profile:data.profile})
}
// AUTHANTICATION ROUTERS
//------------------------------------------------------------------------------

static async  login(data){
    return await axios.post(`${url}login`,
    {email:data.email,password:data.password})
}
static async  signup(data){
    return await axios.post(`${url}signup`,
    data)
}
static async  resetPassword(data){
    return await axios.post(`${url}reset-password`,data)
}

static async  forgetPassword(data){
    return await axios.post(`${url}forget`,
    {email:data.email})
}
static async  logout(){
    eraseCookie()
    return await axios.post(`${url}logout`)
}
static async getuserToken(token){
    return await axios.get(`${url}user/${token}`,axiosConfig)
}
// HOME ROUTES
//------------------------------------------------------------------------------

static async homePage(){
    return await axios.get(`${url}`,axiosConfig)
}
static async searchingBar(data){
    return await axios.get(`${url}searching`,data,axiosConfig)
}
// POSTS ROUTERS
//------------------------------------------------------------------------------

static async  createPost(data){
    return await axios.post(`${url}create-post`,data)
}
static async  editPost(data){
    return await axios.post(`${url}edit-post`,data)
}
static async  deletPost(postId){
    return await axios.post(`${url}delete-post`,{postId})
}
static async  creatComment(data){
    return await axios.post(`${url}create-comment`,
    {user:data.user,comment:data.comment,postId:data.postId})
}

static async  addLike(data){
    return await axios.post(`${url}add-like`,
    {user:data.user,postId:data.postId})
}
static async  removeLike(data){
    return await axios.post(`${url}remove-like`,
    {user:data.user,postId:data.postId})
}
static async  deleteComment(data){
    return await axios.post(`${url}delete-comment/${data.commentId}`,{postId:data.postId})
}
static async  savePost(data){
    return await axios.post(`${url}save-post`,
    {postId:data.post._id,img:data.post.img,description:data.post.description,userId:data.userId})
}
static async  removeSaved(data){
    return await axios.post(`${url}zremoveSaved`,data)
}

static async  getSavedPosts(data){
    return await axios.get(`${url}saved-posts/${data}`)
}

static async  editComment(data){
    return await axios.post(`${url}edit-comment/${data.commentId}`,
    {postId:data.postId,newComment:data.newComment})
}
static async getComments(data){
    return await axios.get(`${url}comments`,data,axiosConfig)
}

// USER ROUTERS
//------------------------------------------------------------------------------
static async getYourProfile(data){
    let userId=data.userId._id
    return await axios.post(`${url}profile/${data.friendId}`, {userId} ,axiosConfig)
}
static async getSpecificUser(data){
    return await axios.get(`${url}getSpecificUser/${data}`,axiosConfig)
}

static async getCurrentUser(data){
    return await axios.get(`${url}current-user/${data}`,axiosConfig)
}
static async getFreindRequest(data){
    return await axios.get(`${url}friendsRequests/${data}`,axiosConfig)
}
static async getFriends(data){
    return await axios.get(`${url}friends/${data}`,axiosConfig)
}
static async  editProfile(data){
    return await axios.post(`${url}edit-profile/${data.userId}`,data
    )
}
static async  editCover(data){
    return await axios.post(`${url}edit-cover/${data.userId}`,data.formData)
}
static async  sendFriendRequest(data){
    return await axios.post(`${url}add-friend-request/`,
    {userId:data.userId,friendId:data.friendId})
}
static async  deleteFriend(data){
    return await axios.post(`${url}delete-friend/${data.friendId}`,
    {userId:data.userId})
}
static async  acceptNewFriend(data){
    return await axios.post(`${url}accept-new-friend/`,
    {userId:data.userId,friendId:data.friendId})
}
static async  msgFromOthers(data){
    return await axios.post(`${url}others-msg/`,
    {userId:data.userId,otherId:data.otherId})
}

static async  rejectfriend(data){
    return await axios.post(`${url}reject-new-friend/`,
    {userId:data.userId,friendId:data.friendId})
}
static async  friendRequestNotifications(data){
    return await axios.post(`${url}friends-request-notification/`,
    {userId:data.userId,friendId:data.friendId,name:data.name,img:data.img,msg:data.msg})
}

static async  pushToAllNotifications(data){
    return await axios.post(`${url}push-all-notifications/`,
    {userId:data.userId,friendId:data.friendId,msg:data.msg,postId:data.postId,action:data.action,name:data.name,img:data.img})
}
static async  getMessage(data){
    return await axios.get(`${url}get-message/${data}`)
}

}
export default Functions
