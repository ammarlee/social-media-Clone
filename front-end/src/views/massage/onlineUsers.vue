<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">

          <v-list v-if="onlineUsers.length >0">
            <v-list-item v-for="chat in onlineUsers" :key="chat.title">
              <v-list-item-avatar>
                <v-img :alt="`${chat.friendImg} avatar`" :src="chat.friendImg"></v-img>
              </v-list-item-avatar>
 
              <v-list-item-content>
                <v-list-item-title v-text="chat.friendName"></v-list-item-title>
              </v-list-item-content>

              <v-btn @click="getSpecificChat(chat.chatId)" icon>
                <v-icon color="deep-purple accent-4'">mdi-message-outline</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
          <div v-else>
            <h4 class="text-capitalize pink--text">there is no online users</h4>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

export default {
  name: "onlineusers",
  mounted() {
    this.socket = this.$soketio;
    if (this.$store.getters.getUser) {
      this.socket.emit("goOnlineTwo", this.$store.getters.getUser);
    }
    this.socket.on("currentOnlineFriendsTwo", (data) => {
      let editOnlineUsers = data.map((i) => {
        return {
          chatId: i.chatId,
          friendName: i.friendId.name,
          friendImg: i.friendId.img,
          friendId: i.friendId._id,
        };
      });
      this.$store.commit("onlineUsers", editOnlineUsers);
      this.recent = editOnlineUsers;
    });
  },
  data() {
    return {
      socket: "",
      recent: [],
      allRecentUser: "",
      chatId: "",
    };
  },
  methods: {
    getSpecificChat(id) {
      this.chatId = id;
      this.$store.commit('sendChatId',id)
      this.$store.commit('hideMsg',true)

    },
  },
  computed: {
    onlineUsers() {
      return this.$store.getters.onlineUsers;
    },
  },

};
</script>

<style lang="scss" scoped>
</style>