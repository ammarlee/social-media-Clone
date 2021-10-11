import Vue from "vue";
import VueRouter from "vue-router";
// footer and header
import header from "../views/user/includesComponent/NavBar.vue";
import footer from "../views/user/includesComponent/Footer.vue";
// auth guard
import guardPage from "./Guards/guardPage";
import AuthanticationRoutes from './Authantication-Routers';
import FriendsRoutes from "./Freinds-Routers"
import PostRoutes from "./Post-Routers"
import ProfileRoutes from "./Profile-Routers"
import MassageRoutes from "./Massage-Routers"

// import guardadmin from "@/router/admin.js";

Vue.use(VueRouter);

const routes = [
  ...AuthanticationRoutes,
  ...PostRoutes,
  ...FriendsRoutes,
  ...ProfileRoutes,
  ...MassageRoutes,



  {
    path: "/",
    name: "Home",
    components: {
      default:()=>{ return import("../views/Home.vue")},
      header: header,
      footer: footer,
    },
  },
  
  // {
  //   path: "/test",
  //   name: "test",
  //   components: {
  //     default:()=>{ return import("../views/post/test.vue")},
  //     header: header,
  //     footer: footer,
  //   },
  // },
  {
    path: "/vedio",
    name: "Video",
    beforeEnter: guardPage,
    components: {
      default:()=>{ return import("../views/Vedio/Vedio.vue")},

   
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

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  
  // scrollBehavior () {
  //       return new Promise((resolve) => {
  //         setTimeout(() => {
  //           resolve(
  //             { x: 0, y: 100 },
  //           )
  //         }, 500)
  //       })
        
        
 
  // }
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
