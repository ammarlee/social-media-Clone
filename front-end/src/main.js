import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";
import socktConnect from "socket.io-client";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Functions from "../server/api";
import VueScreen from 'vue-screen';
import links from './views/user/includesComponent/linkes.vue'
import leftDrawer from './views/user/includesComponent/leftDrawer.vue'
import rightDrawer from './views/user/includesComponent/rightDrawer.vue'
// vue photos
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
Vue.use(VueScreen);
Vue.use(CoolLightBox)

Vue.component('app-links', links)
Vue.component('app-left-drawer', leftDrawer)
Vue.component('app-right-drawer', rightDrawer)
Vue.prototype.$soketio = socktConnect("https://facebook-clones.herokuapp.com/");
Vue.mixin({
  data() {
    return {
      errors: null,
      overlay: false,
      socket: "",
    };
  },
  computed: {
    drawer: {
      get() {
        return this.$store.getters.drawer;
      },
      set(value) {
        this.$store.dispatch("toggleDrawer", value);
      },
    },
    currentUser(){
      return this.$store.getters.getUser
    }
  },
  methods: {
    sweetAlert(icon, msg, time,position) {
      const Toast = this.$swal.mixin({
        toast: true,
        position:position ,
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", this.$swal.stopTimer);
          toast.addEventListener("mouseleave", this.$swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: icon,
        title: msg,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    },
    sweetAlertwithImage( title, text,imageUrl,imageWidth,imageHeight,position,time) {
      const Toast = this.$swal.mixin({
        toast: true,
        position:position ,
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", this.$swal.stopTimer);
          toast.addEventListener("mouseleave", this.$swal.resumeTimer);
        },
      });

      Toast.fire({
        html:`
        <img src='${imageUrl}'
         style='border-radius: 50%;
        height: ${imageWidth}px;
        width: ${imageHeight}px;
        display: inline-block;'/>
        <p ><b>${title}</b>${text}</p>

        `,
        imageAlt: 'Custom image',
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    },
    playSound(sound) {
      if (sound) {
        var audio = new Audio(sound);
        audio.play();
      }
    }
  },
});

const base = axios.create({
  baseURL: "https://facebook-clones.herokuapp.com/",
});
Vue.prototype.$http = base;

Vue.use(VueSweetalert2);

Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),

  async mounted() {
    try {
      const posts = await Functions.getPosts();
      const users = await Functions.getusers();
      this.$store.dispatch("getPosts", posts.data.posts);
      this.$store.commit("setUsers", users.data.users);
      const socket = socktConnect("https://facebook-clones.herokuapp.com/");
        this.socket = socktConnect("https://facebook-clones.herokuapp.com/");

      // let userToken = localStorage.getItem("userToken");

      // if (this.user) {
      //   this.socket = socktConnect("https://facebook-clones.herokuapp.com/");
      //   // join the room
      //   this.socket.emit("joinnotificationsRoom", this.$store.getters.getUser
      //   );
      //   //  socket for likes
      //   this.socket.on("newLikeNotification", (data) => {
      //     if (this.user._id.toString()  ==data.userId.toString() ) {
      //       console.log('the same user');
            
      //     }else{
      //     this.addTheNotification(data);

      //     this.playSound(
      //       "http://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3"
      //     );}
      //   });
      //   //   socket for new comments
      //   this.socket.on("newCommentNotification", (data) => {
       
      //     if (this.user._id.toString() ==data.userId.toString() ) {
      //       console.log('the same user');
            
      //     }else{
      //     this.addTheNotification(data);
      //     this.playSound(
      //       "http://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3"
      //     );}
      //   });

      // }else{
      //   if(userToken=="null"){
      //     this.$router.push("/login");

      //   }else{
      //     Functions.getuserWithToken(userToken).then((currentUser) => {
      //       if(currentUser.data.user==null){
      //      this.$router.push("/login");
      //       }else{
      //         this.$store.dispatch("setUser", currentUser.data.user);
      //         this.$store.dispatch("setAuth", currentUser.data.authanticated);
      //         this.$store.commit(
      //           "setNotifications",
      //           currentUser.data.user.friendsNotifications
      //         );
      //         this.$store.commit(
      //           "setAllNotificationsAfterLogin",
      //           currentUser.data.user.AllNotifications
      //         );
      //         this.$store.commit(
      //           "setUserMessages",
      //           currentUser.data.user.messageNotifications
      //         );

      //       }
      //     });

      //   }

      // }
      socket.on("post", (data) => {
        if (data.action == "create") {
          this.$store.dispatch("pushNewPost", data);
        } else if (data.action == "delete") {
          this.$store.dispatch("removePost", data.post._id);
        } else if (data.action == "edit") {
          this.$store.dispatch("editPost", data.post);
        } else if (data.action == "comment") {
          this.$store.dispatch("pushNewComment", data.comment);
        } else if (data.action == "deleteComment") {
          this.$store.dispatch("deleteComment", {commentId:data.commentId,postId:data.postId});
        } else if (data.action == "editComment") {
          this.$store.dispatch("editComment", data);
        }
        else if (data.action == "signupNewUser") {
          this.$store.dispatch("setNewUser", data.user);
        }
      });
      // this for get online users when they are online
      socket.on("hello", (data) => {
        const filterTheOnloneUsers = this.user.newFriendsTest.find((friend) => {
          return friend.friendId == data._id;
        });
        if (filterTheOnloneUsers) {
          let a = {
            chatId: filterTheOnloneUsers.chatId,
            friendName: data.name,
            friendImg: data.img,
            friendId: data._id,
          };
          this.$store.commit("pushNewOnlineUser", a);
        } else {
          return false;
        }
      });
      // for removing offline users from online list
      this.socket.on("broadcast",data=>{
        this.$store.commit("removeUserOffline", data);
 
      })
    } catch (ee) {
      this.errors = ee
    }
  },
  methods:{
   
    addTheNotification(data) {
      this.sweetAlertwithImage(data.name , data.msg,data.img,"50","50","bottom-left","5000")
      this.$store.commit("setAllNotifications", data);
  },
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    users() {
      return this.$store.getters.users;
    },
  },
}).$mount("#app");
