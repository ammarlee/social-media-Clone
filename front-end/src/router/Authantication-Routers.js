
import onlineGuard from "./Guards/onlineUser";

export default [
    // START  ROUTER FOR AUTHANTICATIONS 
  {
    path: "/login",
    name: "login",
    beforeEnter:onlineGuard,
    components: {
      default:()=>{ return import("../views/auth/Login.vue")},
    }
  },
  {
    path: "/signup",
    name: "signup",
    // component: signup,
    beforeEnter:onlineGuard,

    components: {
      default:()=>{ return import("../views/auth/Signup.vue")}
    }
  },
  {
    path: "/forgetPassword",
    name: "forgetPassword",
    beforeEnter:onlineGuard,

    components: {
      default:()=>{ return import("../views/auth/forgetPassword.vue")}
    }
  },
  {
    path: "/reset/:token",
    name: "resetPassword",
    beforeEnter:onlineGuard,

    components: {
      default:()=>{ return import("../views/auth/resetPassword.vue")}
    }
  },

]