import guardPage from "./Guards/guardPage";
import header from "../views/user/includesComponent/NavBar.vue";
import footer from "../views/user/includesComponent/Footer.vue";
export default [
  //  friend and his childrens
  {
    path: "/friends-request",
    name: "request",
    beforeEnter: guardPage,
    components: {
      default:()=>{ return import("../views/user/friendsRequest.vue")},
      header,
      footer,
    },
  },

  {
    path: "/friendProfile/:id",

    beforeEnter: guardPage,
    components: {
      default: ()=>{ return import("../views/user/friend/friendProfile.vue")},
      header,
      footer,
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
]