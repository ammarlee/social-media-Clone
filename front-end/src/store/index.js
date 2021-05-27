import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: null,
    users: [],
    posts: [],
    comments: [],
    hideMsg: false,
    onlineUsers: [],
    isAuthanticated: false,
    token: null,
    errors: null,
    messages: [],
    notifications: [],
    allNotifications: [],
    searching: null,
    drawer: false,
    chatId: null,
    friendId: null,
    rightDrawer: false,
  },
  // GETTERS TO SEND DATA ANOTHER PLACE
  getters: {
    getFriendId(state) {
      return state.friendId;
    },
    drawer(state) {
      return state.drawer;
    },
    chatId(state) {
      return state.chatId;
    },
    hideMsg(state) {
      return state.hideMsg;
    },
    rightDrawer(state) {
      return state.rightDrawer;
    },
    posts(state) {
      return state.posts;
    },
    messages(state) {
      return state.messages;
    },
    onlineUsers(state) {
      return state.onlineUsers;
    },

    comments(state) {
      return state.comments;
    },
    notifications(state) {
      return state.notifications;
    },
    allNotifications(state) {
      return state.allNotifications;
    },

    getUser(state) {
      return state.user;
    },
    users(state) {
      return state.users;
    },

    isLoggedIn(state) {
      return state.isAuthanticated;
    },
    token(state) {
      return state.token;
    },
    getSearching(state) {
      return state.searching;
    },
  },
  mutations: {
    setFriendId(state, value) {
      state.friendId = value;
    },
    setNewUser(state, value) {
      state.users.push(value) ;
    },
    updateUser(state, value) {
      state.user = value.user;
    },
    updateUserCover(state, payload){
      state.user.coverImg=payload.newImage

    },
    toggleDrawer(state, value) {
      state.drawer = value;
    },
    sendChatId(state, payload) {
      state.chatId = payload;
    },
    hideMsg(state, payload) {
      state.hideMsg = payload;
    },
    toggleRightDrawer(state, value) {
      state.rightDrawer = value;
    },
    // friend notification
    setNotifications(state, payload) {
      state.notifications = payload;
    },
    // friend notification
    async friendRequestNotifications(state, value) {
      state.notifications.unshift(value);
    },
    setAllNotifications(state, payload) {
      state.allNotifications.unshift(payload);
    },
    onlineUsers(state, payload) {
      state.onlineUsers = payload;
    },
    pushNewOnlineUser(state, payload) {
      let checkingIt = state.onlineUsers.some((p) => {
        return p.friendId == payload.friendId;
      });
      checkingIt ? true : state.onlineUsers.unshift(payload);
    },
    removeUserOffline(state, id) {
      state.onlineUsers = state.onlineUsers.filter((i) => {
        return i.friendId !== id;
      });
    },
    setAllNotificationsAfterLogin(state, payload) {
      state.allNotifications = payload;
    },
    setUserMessages(state, payload) {
      state.messages = payload;
    },
    pushNewMessage(state, payload) {
      let f = state.messages.findIndex((i) => {
        return i.chatId.toString() == payload.chatId.toString();
      });
      if (f >= 0) {
        state.messages.splice(f, 1);
        state.messages.unshift(payload);
      } else {
        state.messages.unshift(payload);
      }
    },
    setSearchingResult(state, payload) {
      state.searching = payload;
    },
    setUser(state, user) {
      state.user = user;
    },
    setUsers(state, users) {
      state.users = users;
    },
    token(state, token) {
      state.token = token;
    },
    isAuthanticated(state, payload) {
      state.isAuthanticated = payload;
    },

    logoutUser(state) {
      state.isAuthanticated = false;
    },

    setErros(state, payload) {
      state.errors = payload;
    },

    addPost(state, payload) {
      let finalData = {
        ...payload.post,
        userId: payload.userDate,
      };
      state.posts.unshift(finalData);
    },
    getPosts(state, payload) {
      state.posts = payload;
    },
    getComments(state, payload) {
      state.comments = payload;
    },
    deleteComment(state, payload) {
      let postId =payload.postId;
      let commentId =payload.commentId;
     let post = state.posts.findIndex(i=>{
        return i._id == postId
      })
      let comments =state.posts[post].comments.filter(i=>{
        return i._id !==commentId
      })
      state.posts[post].comments=comments

    },
    editComment(state, payload) {
     let { commentId,newComment,postId}=payload
     let post = state.posts.findIndex(i=>{
        return i._id == postId
      })
      // let comment =state.posts[post].comments.filter(i=>{
      //   return i._id ==commentId
      // })
      let commentIndex =state.posts[post].comments.findIndex(i=>{
        return i._id ==commentId
      })
      // comment[0].description = newComment

      state.posts[post].comments[commentIndex].description=newComment

    },
    deletePost(state, payload) {
      state.posts = state.posts.filter((p) => {
        return p._id !== payload;
      });
    },
    editPost(state, payload) {
      const specificPost = state.posts.findIndex((p) => {
        return p._id == payload._id;
      });
      state.posts[specificPost].description = payload.description;
      state.posts[specificPost].img = payload.img;
    },
    pushNewComment(state, payload) {
      const commentId = payload._id;
      const postId = payload.postId;
      const comment = {
        _id: commentId,
        description: payload.description,
        userId: payload.userId,
        date: payload.date,
        name: payload.name,
        img: payload.img,
      };
      const specificPost = state.posts.findIndex((p) => {
        return p._id == postId;
      });
      state.posts[specificPost].comments.push(comment);
    },
  },
  // THE ALL ACTIONS
  actions: {

    setallUserData({ commit, dispatch }, currentUser) {
      const token = currentUser.data.token;
      let d = new Date();
      d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 7 * 1000);
      let expires = "expires=" + d.toUTCString();
      document.cookie = "TokenUser=" + token + ";" + expires + ";path=/";
      dispatch("setUser", currentUser.data.user);
      dispatch("setAuth", currentUser.data.authanticated);
      commit("setNotifications", currentUser.data.user.friendsNotifications);
      commit(
        "setAllNotificationsAfterLogin",
        currentUser.data.user.AllNotifications
      );
      commit("setUserMessages", currentUser.data.user.messageNotifications);
      dispatch("setToken", token);
      localStorage.setItem("userToken", token);
    },
    editComment({ commit }, payload) {
      commit("editComment", payload);
    },
    editPost({ commit }, payload) {
      commit("editPost", payload);
    },
    deleteComment({ commit }, payload) {
      commit("deleteComment", payload);
    },
    pushNewComment({ commit }, payload) {
      commit("pushNewComment", payload);
    },
    pushNewPost({ commit }, payload) {
      commit("addPost", payload);
    },
    removePost({ commit }, payload) {
      commit("deletePost", payload);
    },
    getPosts({ commit }, payload) {
      commit("getPosts", payload);
    },
    getComments({ commit }, payload) {
      commit("getComments", payload);
    },
    setUsers({ commit }, payload) {
      commit("setUsers", payload);
    },
    notifications({ commit }, payload) {
      commit("notifications", payload);
    },
    toggleDrawer({ commit }, value) {
      commit("toggleDrawer", value);
    },
    toggleRightDrawer({ commit }, value) {
      commit("toggleRightDrawer", value);
    },
    // SET THE DATA OF THE USER IN STATE
    setUser({ commit }, user) {
      commit("setUser", user);
    },
    setNewUser({commit},user){
      commit('setNewUser',user)
    },
    // SET THE SATAE OF THE USER
    setAuth({ commit }, isauth) {
      commit("isAuthanticated", isauth);
    },
    // SET TOKEN FOR USER
    setToken({ commit }, token) {
      commit("token", token);
    },
  },
  modules: {},
});
