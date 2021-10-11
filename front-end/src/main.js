import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import socktConnect from "socket.io-client";
import VueSweetalert2 from "vue-sweetalert2";
import Functions from "../server/api";
import VueScreen from "vue-screen";
import CoolLightBox from "vue-cool-lightbox";
import VuetifyDialog from "vuetify-dialog";
import "sweetalert2/dist/sweetalert2.min.css";
import "vue-cool-lightbox/dist/vue-cool-lightbox.min.css";
import "vuetify-dialog/dist/vuetify-dialog.css";
// Components
import "./plugins/Components";
// mixins
import Mixins from "./plugins/mixins";
import socketMixins from "./plugins/Socket-Mixins"
Vue.mixin(Mixins);
// vue photos

Vue.config.productionTip = false;
Vue.use(require('vue-moment'));
Vue.use(CoolLightBox);
Vue.use(VueScreen);
Vue.use(VueSweetalert2);
Vue.use(VuetifyDialog, {
  context: {
    vuetify,
  },
});

const usedUrl = {
  local: "http://localhost:3000/",
  global: "https://facebook-clones.herokuapp.com/",
};
let currentUrl = usedUrl.local;
Vue.prototype.$soketio = socktConnect(currentUrl);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),

  created() {
    this.$store.commit("initFirebase");
    this.$store.dispatch("initCometChat");
  },

  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  mixins :[socketMixins],
  async mounted() {
    try {
      let userToken = localStorage.getItem("userToken");
      if (!userToken && !this.user) {
        this.$router.push("/login");
      }else if(!userToken){
        this.$router.push("/login");
      } else {
        Functions.getuserWithToken(userToken).then((currentUser) => {
          if (currentUser.data.user == null) {
            this.$router.push("/login");
          } else {
            this.$store
              .dispatch("setallUserData", currentUser)
              .then(() => {
              
                this.$router.push("/");
              });
          }
        });
      }
    } catch (ee) {
      this.errors = ee;
    }
  },
  watch: {
    user(newValue) {
      if (newValue) {
        this.initSocket()
        this.$store.dispatch("fetchUsersFromDb")
        this.$store.dispatch('fetchPostsFromDb')
        
      }
    }
  },

 
}).$mount("#app");
