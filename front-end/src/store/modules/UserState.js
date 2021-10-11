import { CometChat } from "@cometchat-pro/chat";
import Functions from "../../../server/api";


const state = {
  user: null,
  users: [],
  onlineUsers: [],
  notifications: [],
  allNotifications: [],
};
const getters = {
  onlineUsers(state) {
    return state.onlineUsers;
  },
  getUser(state) {
    return state.user;
  },

  users(state) {
    return state.users;
  },
  notifications(state) {
    return state.notifications;
  },

  allNotifications(state) {
    return state.allNotifications;
  },
};
const mutations = {
 
  updateProfileImg(state, payload) {
    state.user.img = payload;
  },
  updateCoverImg(state, payload) {
    state.user.coverImg = payload;
  },
  updateNotification(state, payload) {
    let indexofElement = state.allNotifications.findIndex((i) => {
      return i._id.toString() == payload._id.toString();
    });
    state.allNotifications[indexofElement].seen = true;
  },
  pushNewNotification(state, payload) {
    state.user.notifications.unshift(payload.lastNotification);
  },
  setNotifications(state, payload) {
    state.notifications = payload;
  },
  // friend notification
   friendRequestNotifications(state, payload) {
    state.notifications.unshift(payload);
  },
  setAllNotifications(state, payload) {
    state.allNotifications.unshift(payload);
  },

  setAllNotificationsAfterLogin(state, payload) {
    state.allNotifications = payload;
  },
  setNewUser(state, payload) {
    state.users.push(payload);
  },
  updateUser(state, payload) {
    state.user = payload.user;
  },
  onlineUsers(state, payload) {
    state.onlineUsers = payload;
  },
  pushNewOnlineUser(state, payload) {
    let checkingIt = state.onlineUsers.some((p) => {
      return p._id.toString() == payload._id.toString();
    });
    checkingIt ? true : state.onlineUsers.unshift(payload);
  },
  removeUserOffline(state, payload) {
    state.onlineUsers = state.onlineUsers.filter((i) => {
      return i._id.toString() !== payload._id.toString();
    });
  },
  userLocation(state, payload) {
    let userIndex = state.onlineUsers.findIndex((i) => {
      return i._id.toString() == payload._id.toString();
    });
    if (userIndex > -1) {
      state.onlineUsers[userIndex].page = payload.page;
    } else {
      this.errors = "there are an error with location ";
    }
  },
  setUser(state, user) {
    state.user = user;
  },
 async setUsers(state) {
   try {
     const res = await Functions.getusers();
     state.users = res.data.users;
   } catch (error) {
     console.log(error);
     
   }
  },
  onlinUsers(state, users) {
    state.onlinUsers = users;
  },
  updateUserCover(state, payload) {
    state.user.coverImg = payload.newImage;
  },
};
const actions = {
  fetchUsersFromDb({ commit }) {
    commit("setUsers");
 
  }, 
  updateNotification({ commit }, payload) {
    commit("updateNotification", payload);
  },
  notifications({ commit }, payload) {
    commit("notifications", payload);
  },
  setUser({ commit }, user) {
    commit("setUser", user);
  },
  
  setNewUser({ commit }, user) {
    commit("setNewUser", user);
  },
  onlinUsers({ commit }, payload) {
    commit("onlinUsers", payload);
  },
  pushNewOnlineUser({ commit }, payload) {
    commit("pushNewOnlineUser", payload);
  },
  removeUserOffline({ commit }, payload) {
    commit("removeUserOffline", payload);
  },
  logInToCometChat(context, { _id }) {
    console.log(context);

    const authKey = "ee8f55c76496b045a2838c2a67ee45e8e1b439ca";
    const uid = _id;

    CometChat.login(uid, authKey).then(
      () => {
        console.log("Login Successful:");
      },
      (error) => {
        console.log("Login failed with exception:", { error });
      }
    );
  },
  signUpToCometChat({ commit }, { _id, name, img }) {
    const apikey = "6d14f1b553354275a85ff1e51bfb86de3ed937df";
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        apiKey: apikey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: _id,
        name: name,
        avatar: img,
      }),
    };

    fetch("https://1951298f8c4d3d74.api-eu.cometchat.io/v3.0/users", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
    console.log(commit("s"));
  },

  initCometChat({ commit }) {
    const appID = "1951298f8c4d3d74";
    const region = "eu";

    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();

    CometChat.init(appID, appSetting).then(
      () => {
        console.log("Initialization completed successfully");
      },
      (error) => {
        console.log(commit("s"));
        console.log("Initialization failed with error:", error);
      }
    );
  },
  logOutCometChat({ commit }) {
    CometChat.logout()
      .then(() => {
        console.log("Logout completed successfully");
      })
      .catch((error) => {
        console.log("Logout failed with exception:", { error });
        console.log(commit("s"));
      });
  },
  setallUserData({ commit, dispatch }, currentUser) {
    console.log(currentUser);
    const { token, user, authanticated } = currentUser.data;
    const {
      friendsNotifications,
      AllNotifications,
      messageNotifications,
    } = user;
    let date = new Date();
    date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 7 * 1000);
    let expires = "expires=" + date.toUTCString();
    document.cookie = "TokenUser=" + token + ";" + expires + ";path=/";

    dispatch("setUser", user);
    dispatch("setAuth", authanticated);
    dispatch("setToken", token);
    commit("setNotifications", friendsNotifications);
    commit("setAllNotificationsAfterLogin", AllNotifications);
    commit("setUserMessages", messageNotifications);
    localStorage.setItem("userToken", token);
  },
};
export default {
  state,
  getters,
  mutations,
  actions,
};
