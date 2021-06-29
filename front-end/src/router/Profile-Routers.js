import guardPage from "./Guards/guardPage";
import header from "../views/user/includesComponent/NavBar.vue";
import footer from "../views/user/includesComponent/Footer.vue";
export default [
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
]