<template>
  <v-app>

   <app-overlay :overlay="overlay" v-if="overlay"></app-overlay>
        
    <v-container v-if="!overlay" id="mainCont" class="d-flex justify-center align-center">

      <v-card max-width="450" v-if="users.length>0" class="mx-auto">
        <v-toolbar color="cyan" dark>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
          <v-toolbar-title>friends requests</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list two-line>
          <v-row>
            <template v-for="user in users" style="cursor: pointer">
              <v-col cols="12" sm="12" md="12" :key="user.name">
                <v-list-item @click="navegatetoprofile(user._id)" :key="user.name">
                  <v-list-item-avatar>
                    <v-img :src="user.img"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-html="user.name"></v-list-item-title>
                    <div class="mt-2">
                      <v-btn
                        @click.stop="acceptFriend(user._id)"
                        class="success d-inline mr-2"
                        small
                      >acccept</v-btn>

                      <v-btn @click="rejectfriend(user._id)" class="pink d-inline" small>refuse</v-btn>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </template>
          </v-row>
        </v-list>
      </v-card>
       <app-Alert v-else color="red" msg="you have not any new friends requests"></app-Alert>
  
    </v-container>
  </v-app>
</template>

<script>
import Functions from "../../../server/api";


export default {
  name: "friendsRequest",
  data() {
    return {
      users:[],
    };
  },
  async mounted() {
    try {
     this.socket = this.$soketio;
      this.overlay = true;
      const res = await Functions.getFreindRequest(
        this.currentUser._id
      );
      console.log(res);
      this.users = res.data.friends;
      this.overlay = false;
    } catch (error) {
      console.log(error);
      this.errors = error;
      this.overlay = false;
    }
  },
  methods: {
    navegatetoprofile(friendId) {
      this.$router.push("/FriendProfile/" + friendId);
    },
    async acceptFriend(friendId) {
      try {
        let currentUser = this.currentUser
        const requestInfo = {
            userId: currentUser._id,
            name: currentUser.name,
            img: currentUser.img,
            friendId: friendId,
            action:"newNotification",
            msg:' have acccepted  your friend request ',
          };
        this.overlay = true;
        let res =await Functions.acceptNewFriend(requestInfo);
        console.log(res.status);
        this.removeFriendFromList(friendId);
        if (res.status ==200) {
          
          this.socket.emit("sendFriendRequest", requestInfo);
        }
        
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.errors = error;
      }
    },
    async rejectfriend(friendId) {
      try {
        let data = {
          userId: this.$store.getters.getUser._id,
          friendId: friendId,
        };
        this.overlay = true;
        await Functions.rejectfriend(data);
        this.removeFriendFromList(friendId);
        this.overlay = false;

      } catch (error) {
        this.overlay = false;
        this.errors = error;
      }
    },
    removeFriendFromList(id) {
      this.users = this.users.filter((p) => {
        return p._id !== id;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>