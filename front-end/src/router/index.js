import Vue from "vue";
import VueRouter from "vue-router";
// footer and header
import header from "../views/user/includesComponent/Add";
import footer from "../views/user/includesComponent/Footer";
// auth guard
import guardPage from "@/router/guardPage.js";
// import guardadmin from "@/router/admin.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    components: {
      default:()=>{ return import("../views/Home.vue")},
      header: header,
      footer: footer,
    },
  },
 
 
  {
    path: "/massage",
    name: "massage",
    beforeEnter: guardPage,
    components: {
      default:()=>{ return import("../views/massage/massage.vue")},
      header: header,
      footer: footer,
    },
  },
  {
    path: "/massageTest/:id",
    name: "massageTest",
    beforeEnter: guardPage,
    components: {
      default:()=>{ return import("../views/massage/massageTest.vue")},
      header: header,
      footer: footer,
    },
  },

  {
    path: "/singlePost/:id",
    name: "singlePost",
    components: {
      default:()=>{ return import("../views/post/singlePost.vue")},
      header: header,
      footer: footer,
    },
  },
  {
    path: "/all-users",
    name: "allUsers",
    beforeEnter: guardPage,
    components: {
      default:()=>{ return import("../views/user/users.vue")},
      header: header,
      footer: footer,
    },
  },
  {
    path: "/friends-request",
    name: "request",
    beforeEnter: guardPage,
    components: {
      default:()=>{ return import("../views/user/friendsRequest.vue")},
      header: header,
      footer: footer,
    },
  },
  {
    path: "/saved-posts/:id",
    naeme:'savedPosts',
    beforeEnter: guardPage,
    components: {
      default:()=>{ return import("../views/user/profile/savedPosts.vue")},
      header: header,
      footer: footer,
    },
  },
  // prifile and its children
  {
    path: "/profile/:id",
    beforeEnter: guardPage,
    components: {
      default:()=>{ return import("../views/user/profile/Profile.vue")},
      header: header,
      footer: footer,
    },
    children: [
      { path: "", name: "profilePosts",  components: {
        default:()=>{ return import("../views/user/profile/posts.vue")}}
      },

      {
        path: "profileDetails",
        name: "profileDetails",
        components: {
          default:()=>{ return import("../views/user/profile/details.vue")}}
      },

      {
        path: "profileFriends",
        name: "profileFriends",
        components: {
          default:()=>{ return import("../views/user/profile/friends.vue")}}
      },

      { path: "profilePics", name: "profilePics", components: {
        default:()=>{ return import("../views/user/profile/pics.vue") }}},
    ],
  },
  //  friend and his childrens

  {
    path: "/friendProfile/:id",

    beforeEnter: guardPage,
    components: {
      default: ()=>{ return import("../views/user/friend/friendProfile.vue")},
      header: header,
      footer: footer,
    },
    children: [
      { path: "", name: "friendPosts", components: {
        default:()=>{ return import("../views/user/friend/friendPost.vue")}
      }, },

      {
        path: "friendDetails",
        name: "friendDetails",
        components: {
          default:()=>{ return import("../views/user/friend/friendDetails.vue")}
        }, },

      {
        path: "friendFriends",
        name: "friendFriends",
        components: {
          default:()=>{ return import("../views/user/friend/friendFriends.vue")}
        }, },

      { path: "friendPics", name: "friendPics",  components: {
        default:()=>{ return import("../views/user/friend/friendPic.vue")}
      }, 
    }
    ],
  },

  {
    path: "/login",
    name: "login",
    components: {
      default:()=>{ return import("../views/auth/Login.vue")}
    }
  },
  {
    path: "/signup",
    name: "signup",
    // component: signup,
    components: {
      default:()=>{ return import("../views/auth/Signup.vue")}
    }
  },
  {
    path: "/forgetPassword",
    name: "forgetPassword",
    components: {
      default:()=>{ return import("../views/auth/forgetPassword.vue")}
    }
  },
  {
    path: "/reset/:token",
    name: "resetPassword",
    components: {
      default:()=>{ return import("../views/auth/resetPassword.vue")}
    }
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  
  scrollBehavior () {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              { x: 0, y: 100 },
            )
          }, 500)
        })
        
        
 
  }
  // scrollBehavior(to,from,savePosition){
  //   console.log(from);
  //   if (savePosition) {
  //     console.log('11 > savePosition');
  //     return savePosition
      
  //   }
  //   if (to.hash) {
  //     console.log('2 > tohash');
  //     console.log(to.hash);

  //     return{selector:to.hash}
      
  //   }
  //   console.log('3333333');
  //   return {x:0,y:0}
  // }
});

export default router;
