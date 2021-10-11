import Functions from "../../../server/api";
const state = {
  posts: [],
  comments: [],
};
const getters = {
  posts(state) {
    return state.posts;
  },
  comments(state) {
    return state.comments;
  },
};
const mutations = {
  getComments(state, payload) {
    state.comments = payload;
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
  deleteComment(state, payload) {
    let postId = payload.postId;
    let commentId = payload.commentId;
    let post = state.posts.findIndex((i) => {
      return i._id == postId;
    });
    let comments = state.posts[post].comments.filter((i) => {
      return i._id !== commentId;
    });
    state.posts[post].comments = comments;
  },
  editComment(state, payload) {
    let { commentId, newComment, postId } = payload;
    let post = state.posts.findIndex((i) => {
      return i._id == postId;
    });
    // let comment =state.posts[post].comments.filter(i=>{
    //   return i._id ==commentId
    // })
    let commentIndex = state.posts[post].comments.findIndex((i) => {
      return i._id == commentId;
    });
    // comment[0].description = newComment

    state.posts[post].comments[commentIndex].description = newComment;
  },
  addPost(state, payload) {
    let finalData = {
      ...payload.post,
      userId: payload.userDate,
    };
    state.posts.unshift(finalData);
  },
 async fetchPostsFromDb(state,) {
   try {
    const posts = await Functions.getPosts();
    state.posts = posts.data.posts;
    return
    
  } catch (error) {
    console.log(error);
  }

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
};
const actions = {
  fetchPostsFromDb ({ commit }) {
    commit("fetchPostsFromDb");
  },
  editComment({ commit }, payload) {
    commit("editComment", payload);
  },
  deleteComment({ commit }, payload) {
    commit("deleteComment", payload);
  },
  pushNewComment({ commit }, payload) {
    commit("pushNewComment", payload);
  },
  getComments({ commit }, payload) {
    commit("getComments", payload);
  },

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
};
export default {
  state,
  getters,
  mutations,
  actions,
};
