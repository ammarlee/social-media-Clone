<template>
  <v-app>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container v-if="!overlay">
      <v-row>
        <v-col cols="12" sm="12" md="12" lg="12">

      <v-card class="mx-auto">
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>users</v-toolbar-title>
        </v-toolbar>

        <v-list>
            <v-row  >
          <template v-for="(user) in users" style="cursor: pointer" >
            <v-col cols="12" sm="4" md="4" :key="user.name">
            <v-list-item @click="navegatetoprofile(user._id)">
              <v-list-item-avatar>
                <v-img :src="user.img"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-html="user.name">test</v-list-item-title>

                <v-list-item-action class="flex-row">
                  <v-btn 
                    class="pink"
                    v-if="checkingUser(user._id)"
                    :id="user._id"
                    
                    small
                  >friend</v-btn>

                  <v-btn
                    class="yellow"
                    v-else-if="checkingfriendRequest(user._id)"
                    :id="user._id"
                    small
                  >pending</v-btn>
                  <v-btn
                    class="success"
                    v-else
                    :id="user._id"
                    small
                    @click.stop="addFriend(user._id) "
                  >add</v-btn>
                </v-list-item-action>
              </v-list-item-content>
            </v-list-item>

            </v-col>

          </template>
            </v-row>
        </v-list>
      </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Functions from "../../../server/api";
export default {
  data() {
    return {
      socket: "",
      users: "",
      user:'',
      act: "add",
      isFriend: null,
      isInRequest: null,
    };
  },
  methods: {
    checkingUser(userId) {
      let s = this.user.newFriendsTest.find((p) => {
        return p.friendId === userId;
      });
      if (s) {
        return true;
      } else {
        return false;
      }
    },
    checkingfriendRequest(userId) {
      let s = this.user.friendsRequests.find((p) => {
        return p === userId;
      });
      if (s) {
        return true;
      } else {
        return false;
      }
    },
    navegatetoprofile(friendId) {
      this.$router.push("/FriendProfile/" + friendId);
    },

    async addFriend(friendId) {
      const but = document.getElementById(friendId);
      try {

        await Functions.sendFriendRequest({
          userId: this.$store.getters.getUser._id,
          friendId: friendId,
        });
        but.classList.remove("success")
        but.classList.add("yellow")
        but.innerText = "pending"
        but.disabled = 'disabled'
        let u = this.currentUser;
        const noti = {
          userId: u._id,
          name: u.name,
          img: u.img,
          friendId: friendId,
          action:"newNotification",
          msg:' have sent you friend request ',
        };
        await Functions.friendRequestNotifications(noti)
        this.socket.emit("sendFriendRequest", noti);
      
      } catch (error) {
        console.log(error);
      }
    },
  },
  
  async mounted() {
    try {
      this.overlay = true
      let currentuser = this.$store.getters.getUser._id
      this.socket = this.$soketio;
      const res = await Functions.getusers();
      const u = await Functions.getCurrentUser(currentuser)
      this.user=u.data.user
      this.users = res.data.users.filter(i=>{
        return i._id !==currentuser
      });
      this.overlay = false
    } catch (error) {
      this.overlay = false
      this.errors=error
   
    }
  },
};
</script>

<style lang="scss" scoped>
</style>