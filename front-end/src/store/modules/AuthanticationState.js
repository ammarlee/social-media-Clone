const state = {
    isAuthanticated: false,
    token: null,
}
const getters = {
    isLoggedIn(state) {
        return state.isAuthanticated;
      },
      token(state) {
        return state.token;
      },

}
const mutations = {
    token(state, token) {
        state.token = token;
      },
      isAuthanticated(state, payload) {
        state.isAuthanticated = payload;
      },
  
      logoutUser(state) {
        state.isAuthanticated = false;
      },
}
const actions = {
     // SET THE SATAE OF THE USER
     setAuth({ commit }, isauth) {
        commit("isAuthanticated", isauth);
      },
      // SET TOKEN FOR USER
      setToken({ commit }, token) {
        commit("token", token);
      },
    
}
export default {
    state,
    getters,
    mutations,
    actions
}