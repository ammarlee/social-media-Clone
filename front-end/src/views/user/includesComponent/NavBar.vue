<template>
<div>
    <v-app-bar   dense clipped-left clipped-right color="cyan darken-2" dark app>
      <v-toolbar-title  class="headline text-uppercase">
        <v-icon large  class="d-none  d-sm-block">mdi-facebook</v-icon>
        <v-icon large class="d-sm-none" @click="drawer=!drawer">mdi-menu</v-icon>
      </v-toolbar-title>
      
       <v-spacer></v-spacer>
      <v-toolbar-items class="d-none d-md-inline">
        <v-btn text v-for="(item,i) in navbarLinks" :key="i" :to="item.link" :title="item.title" class="questrial text-none font-weight-bold">
          <v-icon x-large>{{item.icon}}</v-icon>
          </v-btn>
          
         <v-btn text :to="'/profile/'+getUser._id +'/profileFriends'" title="Friends" class="questrial text-none font-weight-bold">
          <v-icon x-large>mdi-account-group-outline</v-icon>
          </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
        <app-searching-bar ></app-searching-bar>
      <v-spacer></v-spacer>
             <!-- right icon for online users -->
      <v-app-bar-nav-icon
        class="mr-0 d-sm-none"
        @click="rightDrawer=!rightDrawer"
        style="cursor: pointer;"
      >
        <v-icon class="white--text">mdi-facebook-messenger</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-items  class="d-none d-sm-block">
        <div  class="pt-3" v-if="getUser">
         <v-badge color="green" class="mr-3"  overlap bordered :content="allNotifications.length">
            <v-menu
            transition="slide-y-transition"
              v-if="getUser"
              class="allTHeOne"
              style="overflow: scroll !important; max-height: 500px !important;"
              bottom
              min-width="200px"
              rounded
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-btn icon small class="d-none d-sm-inline mt-1"  v-on="on">
                  <v-icon class="white--text">mdi-bell-ring</v-icon>
                </v-btn>
              </template>
              <!-- menu for notifications -->
              <v-card max-height="500" style="overflow-y: scroll">
                <v-list-item-content class="justify-center">
                  <div class="mx-auto text-center">
                    <v-btn depressed rounded text>notification {{allNotifications.length}}</v-btn>
                    <v-divider class="my-3"></v-divider>

                    <div v-for="(item, index) in allNotifications" :key="index">
                      <v-list three-line class="theListDiv pt-0 pb-0">
                        <v-list-item
                          class="text-left text-capitalize"
                          :key="item.senderName"
                          @click="navegateToPost(item.postId)"
                        >
                          <v-list-item-avatar>
                            <v-img :src="item.img"></v-img>
                          </v-list-item-avatar>

                          <v-list-item-content class="pt-0">
                            <v-list-item-title class="font-weight-bold">{{item.name}}</v-list-item-title>
                            <v-list-item-subtitle
                              class="font-weight-bold text-capitalize"
                              v-html="item.msg"
                            ></v-list-item-subtitle>
                            <v-list-item-subtitle>{{new Date(+item.date).getHours() + ':'+ new Date(+ item.date).getMinutes()}}</v-list-item-subtitle>

                            <!--  -->
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>
                  </div>
                </v-list-item-content>
              </v-card>
            </v-menu>
          </v-badge>
          <!-- menu for messg -->
          <v-badge color="pink" overlap class="mr-3" bordered :content="allMsgs.length">
            <v-menu
            transition="slide-y-transition"
              v-if="getUser"
              bottom
              min-width="200px"
              style="overflow: scroll !important; max-height: 500px !important;"
              rounded
              offset-y
            >
              <template v-slot:activator="{ on }" >
                <v-btn icon small  class="d-none d-sm-inline mt-1" v-on="on">
                  <v-icon class="white--text">mdi-facebook-messenger</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-list-item-content class="justify-center">
                  <div class="mx-auto mb-0 text-center">
                    <v-btn to="/massage" text block class="text-capitalize">messages</v-btn>
                    <v-divider class="mb-3"></v-divider>

                    <div v-for="(item,i) in allMsgs " :key="i">
                      <v-list three-line class="theListDiv pt-0 pb-0">
                        <v-list-item
                          class="text-left text-capitalize"
                          :key="item.senderName"
                          @click="goToMsg(item.chatId)"
                        >
                          <v-list-item-avatar>
                            <v-img :src="item.senderImg"></v-img>
                          </v-list-item-avatar>

                          <v-list-item-content class="pt-0">
                            <v-list-item-title class="font-weight-bold">{{item.senderName}}</v-list-item-title>
                            <v-list-item-subtitle
                              class="font-weight-bold text-capitalize"
                              v-html="item.content"
                            ></v-list-item-subtitle>
                            <v-list-item-subtitle>{{new Date(+item.date).getHours() + ':'+ new Date(+ item.date).getMinutes()}}</v-list-item-subtitle>

                            <!--  -->
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>
                    <v-divider class="my-3"></v-divider>
                    <router-link to="/massage" tag="div">
                      <v-btn depressed rounded text to="/massage">message</v-btn>
                    </router-link>
                  </div>
                </v-list-item-content>
              </v-card>
            </v-menu>
          </v-badge>
          <!--  end messge -->
          <!-- friend Requests -->
          <v-badge color="green" class="mr-3" overlap bordered :content="notifications.length">
            <v-menu
            transition="slide-y-transition"
              v-if="getUser"
              style="overflow: scroll !important; max-height: 500px !important;"
              bottom
              min-width="200px"
              rounded
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-btn icon small  class="d-none d-sm-inline mt-1" v-on="on">
                  <v-icon class="white--text">mdi-account-multiple-plus</v-icon>
                </v-btn>
              </template>
              <!-- new   -->
              <v-card max-height="500" style="overflow-y: scroll">
                <v-list-item-content class="justify-center">
                  <div class="mx-auto text-center">
                    <v-btn depressed rounded text>friend requests ({{notifications.length}})</v-btn>
                    <v-divider class="my-3"></v-divider>

                    <div v-for="(item, index) in notifications" :key="index">
                      <v-list three-line class="theListDiv pt-0 pb-0">
                        <v-list-item
                          class="text-left text-capitalize"
                          :key="item.senderName"
                          @click="navegateToFriendsRequest()"
                        >
                          <v-list-item-avatar>
                            <v-img :src="item.img"></v-img>
                          </v-list-item-avatar>

                          <v-list-item-content class="pt-0">
                            <v-list-item-title class="font-weight-bold">{{item.name}}</v-list-item-title>
                            <v-list-item-subtitle
                              class="font-weight-bold text-capitalize"
                              v-html="item.msg"
                            ></v-list-item-subtitle>
                            <v-list-item-subtitle>{{new Date(+item.date).getHours() + ':'+ new Date(+ item.date).getMinutes()}}</v-list-item-subtitle>

                            <!--  -->
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>
                  </div>
                </v-list-item-content>
              </v-card>
            </v-menu>
          </v-badge>
         <!-- user options  -->
          <v-menu  transition="slide-y-transition" v-if="getUser" bottom min-width="200px" rounded offset-y>
            <template v-slot:activator="{ on }">
              <v-btn small  fab text  v-on="on" class="mt-n2">
                  <v-avatar  :size="30">
                    <img :src="getUser.img" alt="avatar">
                  </v-avatar>
              </v-btn>
            </template>
            <v-card>
              <v-list-item-content class="justify-center">
                <div class="mx-auto text-center">
                  <router-link :to="'/profile/'+getUser._id">
                    <v-avatar>
                      <v-img v-if="getUser.img" :src="getUser.img"></v-img>
                    </v-avatar>
                  </router-link>
                  <h3>{{ getUser.name }}</h3>
                  <p class="caption mt-1">{{ getUser.email }}</p>

                  <v-divider class="my-3"></v-divider>
                  <v-btn depressed rounded @click="savedposts" text>
                    <v-icon>mdi-heart</v-icon>save posts
                  </v-btn>
                  <v-divider class="my-3"></v-divider>
                  <v-btn depressed rounded @click="logout" text>
                    <v-icon>mdi-logout</v-icon>logout
                  </v-btn>
                </div>
              </v-list-item-content>
            </v-card>
          </v-menu>
        </div>
        
        
      </v-toolbar-items>
      <template v-if="$screen.width <= 599" v-slot:extension>
        <!-- <v-row class=" d-sm-none themobile"> -->
        <app-mobile-notifications class="d-sm-none"></app-mobile-notifications>
        <!-- </v-row> -->
      </template>
    </v-app-bar>
</div>

</template>
<script>
import Functions from "../../../../server/api";
import { mapGetters } from "vuex";
import searchingBar from "./searchingBar.vue";
import mobilNoficicationsVue from "./mobilNoficications.vue";

export default {
  components: {
    "app-searching-bar": searchingBar,
    "app-mobile-notifications": mobilNoficicationsVue,
  },
  name: "navbar",
  data() {
    return {
      agree:false,
      items: [],
      tab: null,
      test: null,
      on: "",
      navbarLinks:[
        {name:'home',icon:'mdi-home-variant-outline',link:'/',title:'home'},
        {name:'users',icon:'mdi-account-search-outline',link:'/all-users',title:'Find-Friends'},
        {name:'requests',icon:'mdi-account-clock-outline',link:'/friends-request',title:'Friends-Request'},
       ]
       
    };
  },
 
  mounted() {
    this.test = this.$store.getters.notifications;
    this.socket = this.$soketio;
  },
  methods: {
    goToMsg(chatId) {
      this.$router.push("/massageTest/" + chatId);
      if (this.$route.name === "massageTest") {
        this.$router.push("/").then(() => {
          this.$router.push("/massageTest/" + chatId);
        });
      } else {
        this.$router.push("/massageTest/" + chatId);
      }
    },
    savedposts() {
      this.$router.push(`/saved-posts/${this.getUser._id}`);
    },

    navegateToPost(id) {
      if (this.$route.name === "singlePost") {
        this.$router.push("/").then(() => {
          this.$router.push("/singlePost/" + id);
        });
      } else {
        this.$router.push("/singlePost/" + id);
      }
    },
    navegateToFriendsRequest() {
      // if (this.$route.name === "Home") {
      //   this.$router.push("/FriendProfile/" + id);
      // } else {
      //   this.$router.push("/").then(() => {
      //     this.$router.push("/FriendProfile/" + id);
      //   });
      // }
        this.$router.push("/friends-request/");

    },

    async logout() {
      try {
        await Functions.logout();
        document.cookie = "TokenUser" + "=; Max-Age=-99999999;";
        document.cookie = "my test" + "=; Max-Age=-99999999;";
        localStorage.removeItem("userToken");
        this.$store.dispatch("setUser", null);
        this.$store.dispatch("setAuth", false);
        this.$store.commit("setNotifications", null);
        this.$store.commit("setAllNotificationsAfterLogin", null);
        this.$store.commit("setUserMessages", null);
        this.$store.dispatch("setToken", null);
        localStorage.setItem("userToken", null);
        this.$router.push("/login");
      } catch (error) {
        this.errors = error;
      }
    },

    profileNavigate() {
      this.$router.push("/profile" + this.getUser._id);
    },
    openDrawer() {
      this.drawer = !this.drawer;
    },
    goHome(){
      this.$router.push("/");
    }
  },
  computed: {
    ...mapGetters([
      "getUser",
      "isLoggedIn",
      "token",
      "notifications",
      "allNotifications",
    ]),
    allMsgs() {
      return this.$store.getters.messages ||[];
    },

    rightDrawer: {
      get() {
        return this.$store.getters.rightDrawer;
      },
      set(value) {
        this.$store.dispatch("toggleRightDrawer", value);
      },
    },
  },
};
</script>

<style>
.v-text-field.v-text-field--solo .v-input__control{
  min-height: 22px
}
.v-text-field.v-text-field--solo .v-input__append-inner, .v-text-field.v-text-field--solo .v-input__prepend-inner{
  margin-bottom: 5px
}
</style>
