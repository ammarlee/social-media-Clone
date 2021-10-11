<template >
  <div class="home" id="theMainHome">
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-app>
      <v-main class="grey lighten-3 pt-2" v-if="currentUser">
        <v-container id="inspire" fluid>
          <v-row>
            <!-- left bar content -->
            <v-col cols="12" sm="3" class="d-none d-sm-block rounded-lg">
              <v-sheet rounded="lg" min-height="268">
                <router-link :to="'/profile/'+user._id" tag="div">
                  <v-list two-line class="pb-0" style="cursor: pointer">
                    <template>
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-img :src="user.img"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title
                            class="text-capitalize font-weight-bold"
                            v-html="user.name"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list>
                </router-link>
                <app-links></app-links>
              </v-sheet>
            </v-col>
            <!-- contnent of all -->

            <app-content></app-content>

            <!-- right bar content -->
            <v-col cols="12" sm="3" class="d-none d-sm-block">
              <v-sheet rounded="lg" height="268">
                <router-link
                  to="/massage"
                  tag="h3"
                  class="text-capitalize pt-3=2 text-center"
                >online</router-link>
                <app-onlineUsers></app-onlineUsers>
              </v-sheet>
            </v-col>
            <!-- pop up chat msg -->
            <app-chatting
              id="theChatBox"
              v-if="hideMsg "
              :chatIdfromanother="getChatId"
            ></app-chatting>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script>
import content from "./user/includesComponent/content";
import onlineUsers from "./massage/onlineUsers";
import chatting from "./massage/massageTest";
// import socketMixins from '../plugins/Socket-Mixins';

export default {
  name: "Home",
    // mixins :[socketMixins],
  components: {
    "app-content": content,
    "app-onlineUsers": onlineUsers,
    "app-chatting": chatting,
  },
  data() {
    return {
      socket: "",
      thePosition: "",
    };
  },

  mounted() {
    if (!this.user) {
      this.$router.push('/login')

  }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    getChatId() {
      return this.$store.getters.chatId;
    },
    height() {
      return window.innerHeight;
    },
    hideMsg() {
      return this.$store.getters.hideMsg;
    },
    getTheWidth() {
      let s = "";
      window.addEventListener("resize", () => {
        s = window.innerHeight;
      });
      return s;
    },
  },
  beforeDestroy() {
    // Unregister the event listener before destroying this Vue instance
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.thePosition = window.innerHeight - 334;
    },
    nag() {
      window.addEventListener("resize", () => {
        return window.innerHeight;
      });
    },
    addTheNotification(data) {
      this.sweetAlertwithImage(
        data.name,
        data.msg,
        data.img,
        "50",
        "50",
        "bottom-left",
        "5000"
      );

      this.$store.commit("setAllNotifications", data);
    },
  },
};
</script>
<style lang="scss" scoped>
#theChatBox {
  position: fixed;
  left: 80px;
  min-height: 220px; 
  max-height: 221px;
  top:25%;
  width: 320px;
}
</style>
