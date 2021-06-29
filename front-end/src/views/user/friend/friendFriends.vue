<template>
  <v-app>
    <v-overlay :value="overlay" v-if="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container>
      <div class="text-capitalize text-center">
        <div class="nav-bar">
          <h1 class="mb-5">
            friends
            <span class="text--h5">({{friendsList.length}})</span>
          </h1>
          <v-text-field label="seach friends" solo></v-text-field>
        </div>
      </div>
      <div class="friends">
        <v-row>
          <v-col cols="12" sm="6" md="6" v-for="friend in friendsList" :key="friend.id">
            <div
              class="d-flex main-div align-self-end"
              @click="navegatetoprofile(friend.friendId._id)"
            >
              <div class="friend-img">
                <v-avatar>
                  <v-img :src="friend.friendId.img"></v-img>
                </v-avatar>
              </div>
              <div class="img-details ml-2">
                <h4>{{friend.friendId.name}}</h4>
              </div>
              <div>
                <v-menu transition="slide-y-transition" open-on-hover offset-y bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="ml-auto font-weight-bold"
                      style="margin-left: 111px !important; font-size: 18px;"
                      fab
                      text
                      v-bind="attrs"
                      v-on="on"
                    >...</v-btn>
                  </template>
                  <v-list>
                    <div>
                      <v-list-item>
                        <v-list-item-title>
                          <v-btn text :id="friend.id" @click="addFriend(friend.id)">
                            <v-icon>mdi-facebook</v-icon>add friend
                          </v-btn>
                        </v-list-item-title>
                      </v-list-item>
                    </div>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </v-col>
          <v-col cols="12" v-if="friendsList.length <= 0">
            <v-alert color="red" outlined type="info">there is no friends avalible for that user</v-alert>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-app>
</template>
 
<script>
import Functions from "../../../../server/api";

export default {
  async mounted() {
    try {
      this.overlay = true;
      const res = await Functions.getFriends(this.$route.params.id);
      this.socket = this.$soketio;
      this.users = res.data.users;
      this.friendsList = res.data.friends.filter((i) => {
        return i.friendId._id !== this.$store.getters.getUser._id;
      });
      this.overlay = false;
    } catch (error) {
      this.overlay = false;
      this.errors = error;
    }
  },
  methods: {
    navegatetoprofile(friendId) {
      this.$router.push("/").then(() => {
        this.$router.push("/FriendProfile/" + friendId);
      });
    },

    async addFriend(friendId) {
      const but = document.getElementById(friendId);
      try {
      this.overlay = true;
        
        const res = await Functions.sendFriendRequest({
          userId: this.$route.params.id,
          friendId: friendId,
        });
        but.classList.add("yellow");
        but.innerText = "pending";
        let u = this.$store.getters.getUser;
        const noti = {
          userId: u._id,
          name: u.name,
          img: u.img,
          friendId: friendId,
        };
        this.socket.emit("sendFriendRequest", noti);
        console.log(res);
      this.overlay = false;

      } catch (error) {
        this.overlay = false
      this.errors=error
      }
    },
  },
  data() {
    return {
      friendsList: "",
      userId: this.$store.getters.getUser._id,
    };
  },
};
</script>

<style lang="scss" scoped>
.main-div {
  cursor: pointer;
  width: 54%;
  border: 2px solid darkgray;
  padding: 3px;
  overflow: hidden;
}
</style>