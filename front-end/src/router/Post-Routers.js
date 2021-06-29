import guardPage from "./Guards/guardPage";
import header from "../views/user/includesComponent/NavBar.vue";
import footer from "../views/user/includesComponent/Footer.vue";
export default [
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
        path: "/saved-posts/:id",
        naeme:'savedPosts',
        beforeEnter: guardPage,
        components: {
          default:()=>{ return import("../views/user/profile/savedPosts.vue")},
          header: header,
          footer: footer,
        },
      },
]