<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="12" >
          <v-list v-if="onlineUsers.length >0">
            <v-list-item v-for="chat in onlineUsers" :key="chat.title">
              <v-list-item-avatar>
                <v-img :alt="`${chat.friendImg} avatar`" :src="chat.friendImg"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="chat.friendName"></v-list-item-title>
              </v-list-item-content>
              
              <v-btn  @click="getSpecificChat(chat.chatId)" icon>
                <v-icon color="deep-purple accent-4'">mdi-message-outline</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
          <div v-else class="text-capitalize font-weight-bold text-center">
            <h4>there is no online users</h4>
          </div>
    <v-divider class="pink my-4"></v-divider>

          <div v-if="chatId">
          <h2>chat</h2>
          <app-message :chatIdfromanother="chatId" ></app-message>
          </div>
        </v-col>

      </v-row>
    </v-container>

  </v-app>
</template>

<script>

import message from './massageTest'
export default {
  name: "message",
  components:{
    'app-message':message
  },

  mounted() {
    this.socket = this.$soketio;
    if (this.$store.getters.getUser) {
      this.socket.emit("goOnlineTwo", this.$store.getters.getUser);
    }
    this.socket.on("currentOnlineFriendsTwo", (data) => {
      let t = data.map((i) => {
        return {
          chatId: i.chatId,
          friendName: i.friendId.name,
          friendImg: i.friendId.img,
          friendId: i.friendId._id,
        };
      });
      this.$store.commit("onlineUsers", t);
      this.recent = t;
    });
  },
  data() {
    return {
      socket: "",
      recent: [],
      allRecentUser: "",
      chatId:''
    };
  },
  methods: {
    getSpecificChat(id){
      console.log('work');
      this.chatId = id
    }
  },
  computed: {
    onlineUsers() {
      return this.$store.getters.onlineUsers;
    },
  },
  watch: {
    recent(val) {
      console.log("changed");
      console.log(val);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>