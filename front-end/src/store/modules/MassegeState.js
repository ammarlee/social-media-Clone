const state = {
  hideMsg: false,
  messages: [],
  conversations: [],
};
const getters = {
  hideMsg(state) {
    return state.hideMsg;
  },
  conversations(state) {
    return state.conversations;
  },

  messages(state) {
    return state.messages;
  },
};
const mutations = {
  setConversations(state,payload) {
    state.conversations = payload
  },
  addMsgToConversations(state, payload) {
    state.conversations.push(payload);
  },

  hideMsg(state, payload) {
    state.hideMsg = payload;
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
};
const actions = {


};
export default {
  state,
  getters,
  mutations,
  actions,
};
