import guardPage from "./Guards/guardPage";

import header from "../views/user/includesComponent/NavBar.vue";
import footer from "../views/user/includesComponent/Footer.vue";
export default [
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
        },
      },
]