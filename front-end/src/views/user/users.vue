<template>
  <v-app>
 
<app-overlay :overlay="overlay" v-if="overlay"></app-overlay>

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
            <v-list-item @click="vistiProfile(user._id)">
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
                    @click.stop="sendFriendRequest(user._id) "
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
      user:'',
      act: "add",
      users:null,
      isFriend: null,
      isInRequest: null,
    };
  },
  methods: {
    checkingUser(userId) {
      let user = this.user.newFriendsTest.find((p) => {
        return p.friendId === userId;
      });
      if (user) {
        return true;
      } else {
        return false;
      }
    },
    checkingfriendRequest(userId) {
      let user = this.user.friendsRequests.find((p) => {
        return p === userId;
      });
      if (user) {
        return true;
      } else {
        return false;
      }
    },
    vistiProfile(friendId) {
      this.$router.push("/FriendProfile/" + friendId);
    },

    async sendFriendRequest(friendId) {

      let CurrentUser = this.currentUser;
      const button = document.getElementById(friendId);
          const requestInfo = {
          userId: CurrentUser._id,
          name: CurrentUser.name,
          img: CurrentUser.img,
          friendId: friendId,
          action:"newNotification",
          msg:' have sent you friend request ',
        };
      try {

        await Functions.sendFriendRequest(requestInfo);
        button.classList.remove("success")
        button.classList.add("yellow")
        button.innerText = "pending"
        button.disabled = 'disabled'
    
        this.$soketio.emit("sendFriendRequest", requestInfo);
      
      } catch (error) {
        console.log(error);
      }
    },
  },
  
  async mounted() {
    try {
      this.overlay = true
      let currentuser = this.$store.getters.getUser._id
      const {data} = await Functions.getCurrentUser(currentuser)
      this.overlay = false
      this.user=data.user
      this.users = this.allUsers.filter(i=>{
        return i._id !==currentuser
      });
    } catch (error) {
      this.overlay = false
      this.errors=error
   
    }
  },
  computed: {
    allUsers() {
      return this.$store.getters.users 
    }
  },
};
</script>

<style lang="scss" scoped>
</style>