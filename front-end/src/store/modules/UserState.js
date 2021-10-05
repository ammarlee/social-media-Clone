const state = {
user: null,
    users: [],
    onlineUsers: [],
    notifications: [],
    allNotifications: [],
    

}
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

}
const mutations = {
  updateProfileImg(state, payload){
    state.user.img=payload
  },
  updateCoverImg(state, payload){
    state.user.coverImg=payload
  },
    updateNotification(state,payload){
        let indexofElement = state.user.notifications.findIndex(i=>{
           return i._id.toString()==payload._id.toString()
         })
         state.user.notifications[indexofElement].seen = true
       },
       pushNewNotification(state,payload){
        state.user.notifications.unshift(payload.lastNotification);
     },
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
    
    setAllNotificationsAfterLogin(state, payload) {
      state.allNotifications = payload;
    },
     setNewUser(state, payload) {
       state.users.push(payload) ;
     },
     updateUser(state, payload) {
       state.user = payload.user;
     },
    
     pushNewOnlineUser(state, payload) {
        let checkingIt = state.onlineUsers.some((p) => {
          return p._id.toString() == payload._id.toString();
        });
        checkingIt ? true : state.onlineUsers.unshift(payload);
      },
      removeUserOffline(state, payload) {
        state.onlineUsers = state.onlineUsers.filter((i) => {
          return i._id.toString() !== payload._id.toString()
        });
      },
      userLocation(state, payload) {
        let userIndex=state.onlineUsers.findIndex(i=>{
          return i._id.toString() == payload._id.toString()
        })
        if (userIndex > -1 ) {
          console.log(state.onlineUsers[userIndex].page);
          state.onlineUsers[userIndex].page =payload.page 
          
        } else {
          this.errors = 'there are an error with location '
          
        }
       
      },
      setUser(state, user) {
        state.user = user;
      },
      setUsers(state, users) {
        state.users = users;
      },
      onlinUsers(state, users) {
        console.log('wwwwwwwwwwwwww');
        state.onlinUsers = users;
      },
      updateUserCover(state, payload){
        state.user.coverImg=payload.newImage
  
      },

}
const actions = {
  updateNotification({commit},payload){
    commit('updateNotification',payload)
  },
  notifications({ commit }, payload) {
    commit("notifications", payload);
  },
    setUser({ commit }, user) {
        commit("setUser", user);
      },
      setUsers({ commit }, payload) {
        commit("setUsers", payload);
      },
      setNewUser({commit},user){
        commit('setNewUser',user)
      },
      onlinUsers({commit},payload){
        commit('onlinUsers',payload)
      },
      pushNewOnlineUser({commit},payload){
        commit('pushNewOnlineUser',payload)
      },
      removeUserOffline({commit},payload){
        commit('removeUserOffline',payload)
      },
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
      
 
     
    
}
export default {
    state,
    getters,
    mutations,
    actions
}