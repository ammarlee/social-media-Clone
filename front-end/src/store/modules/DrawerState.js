const state = {
  drawer: false,
  rightDrawer: false,
};
const getters = {
  drawer(state) {
    return state.drawer;
  },
  rightDrawer(state) {
    return state.rightDrawer;
  },
};
const mutations = {
  toggleDrawer(state, value) {
    state.drawer = value;
  },
  toggleRightDrawer(state, value) {
    state.rightDrawer = value;
  },
};
const actions = {
  toggleDrawer({ commit }, value) {
    commit("toggleDrawer", value);
  },
  toggleRightDrawer({ commit }, value) {
    commit("toggleRightDrawer", value);
  },
};
export default {
  state,
  getters,
  mutations,
  actions,
};
