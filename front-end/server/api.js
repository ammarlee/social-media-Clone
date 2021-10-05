import axios from "./mainApi";

class Functions {

// redirect ROUTERS
static redirect() {
  return axios().post(`red`);
}



  // ADMIN ROUTERS
  //------------------------------------------------------------------------------
  static getPosts() {
    return axios().get(`admin/posts`);
  }
  static getusers() {
    return axios().get(`admin/users`);
  }
  static getuserWithToken(token) {
    return axios().get(`getuserToken/${token}`);
  }
  static deleteUser({ userId, pic, profile }) {
    return axios().post(`admin/delete-user/${userId}`, { pic, profile });
  }
  static loginWithFb() {
    console.log("loginWithFb in axios page");
    return axios().get(`auth/facebook`);
  }
  static adminEditPost({ userId, pic, profile }) {
    return axios().post(`admin/edit-post/${userId}`, { pic, profile });
  }
  static deletePost(data) {
    return axios().post(`admin/delete-post/${data.postId}`, {
      pic: data.pic,
      profile: data.profile,
    });
  }
  // AUTHANTICATION ROUTERS
  //------------------------------------------------------------------------------

  static login(data) {
    return axios().post(`login`, {
      email: data.email,
      password: data.password,
    });
  }
  static signup(data) {
    return axios().post(`signup`, data);
  }
  static resetPassword(data) {
    return axios().post(`reset-password`, data);
  }

  static forgetPassword(data) {
    return axios().post(`forget`, { email: data.email });
  }
  static logout() {
    // eraseCookie()
    return axios().post(`logout`);
  }
  static getuserToken(token) {
    return axios().get(`user/${token}`);
  }
  // HOME ROUTES
  //------------------------------------------------------------------------------

  static homePage() {
    return axios().get(``);
  }
  static searchingBar(data) {
    return axios().get(`searching`, data);
  }
  // POSTS ROUTERS
  //------------------------------------------------------------------------------

  static createPost(data) {
    return axios().post(`create-post`, data);
  }
  static editPost(data) {
    return axios().post(`edit-post`, data);
  }
  static deletPost(postId) {
    return axios().post(`delete-post`, { postId });
  }
  static creatComment({ user, postId, comment }) {
    return axios().post(`create-comment`, { user, postId, comment });
  }

  static addLike({ user, postId }) {
    return axios().post(`add-like`, { user, postId });
  }
  static removeLike({ user, postId }) {
    return axios().post(`remove-like`,{ user, postId });
  }
  static deleteComment({commentId,postId}) {
    return axios().post(`delete-comment/${commentId}`, {
      postId,
    });
  }
  static savePost(data) {
    return axios().post(`save-post`, {
      postId: data.post._id,
      img: data.post.img,
      description: data.post.description,
      userId: data.userId,
    });
  }
  static removeSaved(data) {
    return axios().post(`zremoveSaved`, data);
  }

  static getSavedPosts(data) {
    return axios().get(`saved-posts/${data}`);
  }

  static editComment({postId,newComment,commentId}) {
    return axios().post(`edit-comment/${commentId}`, {
      postId,
      newComment,
    });
  }
  static getComments(data) {
    return axios().get(`comments`, data);
  }

  // USER ROUTERS
  //------------------------------------------------------------------------------
  static getYourProfile(data) {
    let userId = data.userId._id;
    return axios().post(`profile/${data.friendId}`, { userId });
  }
  static getSpecificUser(data) {
    return axios().get(`getSpecificUser/${data}`);
  }

  static getCurrentUser(data) {
    return axios().get(`current-user/${data}`);
  }
  static getFreindRequest(data) {
    return axios().get(`friendsRequests/${data}`);
  }
  static getFriends(data) {
    return axios().get(`friends/${data}`);
  }
  static editProfile(data) {
    return axios().post(`edit-profile/${data.userId}`, data);
  }

  static uploadCroppedImage({ userId, formData }) {
    return axios().put(`cropped-img/${userId}`, formData);
  }
  static sendFriendRequest({ userId, friendId }) {
    return axios().post(`add-friend-request/`, {
      userId,
      friendId,
    });
  }
  static deleteFriend({ userId, friendId }) {
    return axios().post(`delete-friend/${friendId}`, {
      userId,
    });
  }
  static acceptNewFriend({ userId, friendId }) {
    return axios().post(`accept-new-friend/`, {
      userId,
      friendId,
    });
  }
  static msgFromOthers({ userId, otherId }) {
    return axios().post(`others-msg/`, {
      userId,
      otherId,
    });
  }

  static rejectfriend({ userId, friendId }) {
    return axios().post(`reject-new-friend/`, {
      userId,
      friendId,
    });
  }
  static friendRequestNotifications({ userId, friendId, name, img, msg }) {
    return axios().post(`friends-request-notification/`, {
      userId,
      friendId,
      name,
      img,
      msg,
    });
  }

  static pushToAllNotifications({
    userId,
    friendId,
    msg,
    postId,
    action,
    name,
    img,
  }) {
    return axios().post(`push-all-notifications/`, {
      userId,
      friendId,
      msg,
      postId,
      action,
      name,
      img,
    });
  }
  static getMessage(data) {
    return axios().get(`get-message/${data}`);
  }
}
export default Functions;
