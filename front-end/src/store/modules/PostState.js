const state = {
    posts: [],
}
const getters = {
    posts(state) {
        return state.posts;
      },

}
const mutations = {
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

}
const actions = {
    editPost({ commit }, payload) {
        commit("editPost", payload);
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
     
    
}
export default {
    state,
    getters,
    mutations,
    actions
}