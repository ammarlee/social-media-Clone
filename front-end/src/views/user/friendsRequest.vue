<template>
  <v-app>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container v-if="!overlay">
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
      <h2
        v-else
        class="text-capitalize text-center mt-10 pink--text font-weight-bold"
      >you have not any new friends requests</h2>
    </v-container>
  </v-app>
</template>

<script>
import Functions from "../../../server/api";


export default {
  name: "friendsRequest",
  data() {
    return {
      users: "",
    };
  },
  async mounted() {
    try {
     this.socket = this.$soketio;
      this.overlay = true;
      const res = await Functions.getFreindRequest(
        this.currentUser._id
      );
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
        let u = this.$store.getters.getUser;
        let data = {
          userId: u._id,
          friendId: friendId,
        };
        this.overlay = true;
        let res =await Functions.acceptNewFriend(data);
        console.log(res.status);
        this.removeFriendFromList(friendId);
        if (res.status ==200) {
          const noti = {
            userId: u._id,
            name: u.name,
            img: u.img,
            friendId: friendId,
            action:"newNotification",
            msg:' have acccepted  your friend request ',
          };
          await Functions.friendRequestNotifications(noti)
          this.socket.emit("sendFriendRequest", noti);
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
      console.log(id);
      this.users = this.users.filter((p) => {
        return p._id !== id;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>