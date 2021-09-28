import Vue from "vue";
import Vuex from "vuex";

import UserState from "./modules/UserState"
import DrawerState from "./modules/DrawerState"
import AuthanticationState from "./modules/AuthanticationState"
import PostState from "./modules/PostState"
import MassegeState from "./modules/MassegeState"
import CommentState from "./modules/CommentState"
import NotificationState from "./modules/NotificationState"
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    errors: null,
    searching: null,
    chatId: null,
    friendId: null,
    appId:'192061e662432a3b',
    apiKey:'a80f01769131283be6c1af603192d3c2202856cd'
  },
  // GETTERS TO SEND DATA ANOTHER PLACE
  getters: {
    getFriendId(state) {
      return state.friendId;
    },
    appId(state) {
      return state.appId;
    },
    apiKey(state) {
      return state.apiKey;
    },
    chatId(state) {
      return state.chatId;
    },
    getSearching(state) {
      return state.searching;
    },
  },
  mutations: {
    setFriendId(state, value) {
      state.friendId = value;
    },
    sendChatId(state, payload) {
      state.chatId = payload;
    },
    setSearchingResult(state, payload) {
      state.searching = payload;
    },
    setErros(state, payload) {
      state.errors = payload;
    },
    
  },
  // THE ALL ACTIONS
  actions: {
   
   
  },
  modules: {
    DrawerState,
    UserState,
    NotificationState,
    CommentState,
    MassegeState,
    PostState,
    AuthanticationState,
  },
});
