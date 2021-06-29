<template>
  <!-- for mobile  -->
  <v-row v-if="getUser">
    <!-- here will remove the home and use slot to add it -->
    <v-col cols="2">
      <router-link to="/" tag="span" exact>
        <v-btn small icon >
          <v-icon  large class="white--text">mdi-home-outline</v-icon>
        </v-btn>
      </router-link>
    </v-col>
    <v-col cols="3">
      <!-- 1 for notifications -->
      <v-badge  color="green" class="mr-3" overlap bordered :content="allNotifications.length">
        <v-menu
          v-if="getUser"
          bottom
          class="allTHeOne"
          min-width="200px"
          style="overflow: scroll !important; max-height: 500px !important``;"
          rounded
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn icon small class="mt-1" v-on="on">
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
                        <v-list-item-subtitle>{{editTime(item.date)}}</v-list-item-subtitle>

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
    </v-col>
    <!-- 2 menu for messg -->
    <v-col cols="3">
      <v-badge  color="pink" overlap class="mr-3" bordered :content="allMsgs.length">
        <v-menu v-if="getUser" bottom min-width="200px" rounded offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon small class="mt-1" v-on="on">
              <v-icon class="white--text">mdi-facebook-messenger</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <h3 class="text-capitalize">messages</h3>
                <v-divider class="my-3"></v-divider>

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
                        <v-list-item-subtitle>{{editTime(item.date)}}</v-list-item-subtitle>

                        <!--  -->
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </div>
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text to="/massage">message</v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
      </v-badge>
    </v-col>
    <!--  end messge -->
    <!-- 3 friendRequest -->
    <v-col cols="2">
      <v-badge color="green" class="mr-3" overlap bordered :content="notifications.length">
        <v-menu v-if="getUser" bottom min-width="200px" rounded offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon small class="mt-1" v-on="on">
              <v-icon class="white--text">mdi-account-multiple-plus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-list>
                  <h3
                    class="text-capitalize red--text font-weight-bold pl-3 mb-1"
                  >notifications {{notifications.length}}</h3>
                  <v-divider class></v-divider>
                  <v-list-item
                    class="pt-3 pb-3 mb-1 rounded-0 blue"
                    v-for="(item, index) in notifications"
                    :key="index"
                  >
                    <v-list-item-title
                      outlined
                      style="cursor: pointer;"
                      @click="navegateToProfile(item.userId)"
                    >
                      <div>
                        <v-avatar class="d-inline-block">
                          <v-img :src="item.img" class="d-inline-block"></v-img>
                        </v-avatar>
                        <h5>{{item.name}}</h5>
                        <p class="d-inline pl-3 text-capitalize">{{item.msg}}</p>
                      </div>
                    </v-list-item-title>

                    <v-divider class="mt-1 mb-1"></v-divider>
                  </v-list-item>
                </v-list>

                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text>notification</v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
      </v-badge>
    </v-col >
    <v-col cols="2">
      <!-- WEILL REMOVE IT AND USE SLOT INSTEAD  -->
     <router-link :to="'/profile/'+getUser._id" tag="span" exact>
        <v-btn icon small>
          <v-icon large class="white--text">mdi-account-circle-outline</v-icon>
        </v-btn>
      </router-link>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  methods: {
    editTime(date) {
       return new Date(++date).getHours() + ':'+ new Date(++date).getMinutes()
    },
    goToMsg(chatId) {
      this.$router.push("/massageTest/" + chatId);
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
      profileNavigate() {
      this.$router.push("/profile/" + this.getUser._id);
    },
    navegateToProfile() {
        this.$router.push("/friends-request/");

    },
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
      return this.$store.getters.messages;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>