<template>
  <v-app>
    <div class="content">
      <div class="cover" id="cover-img">
        <div
          class="cover-img"
          id="theCoverImg"
          :style="{ 'background-image': 'url(' + user.coverImg + ')' }"
          alt="cover"
        ></div>
        <div class="user">
          <div id="profile-img">
            <v-avatar size="128" class="the-avatar">
              <img :src="user.img" alt="profilepic" />
            </v-avatar>
          </div>

          <div class="text-center text-capitalize">
            <h1>{{user.name}}</h1>
            <p>{{user.bio}}</p>
            <v-container class="pt-0 mt-5 pb-0">
              <v-row>
                <v-col cols="12">
                  <div id="actionDiv">
                    <!-- 1- if the user in friend list -->
                    <div v-if="infriendsList">
                      <v-btn large icon outlined class="success mr-2">
                        <v-icon class="mr-1 white--text">mdi-account-star-outline</v-icon>
                      </v-btn>
                      <v-btn outlined class="pink white--text" @click="unfriend()">
                        <v-icon class="mr-1" small>mdi-account-cancel-outline</v-icon>unfriend
                      </v-btn>
                    </div>
                    <div v-else-if="newFriendsRequests">
                      <v-btn
                        outlined
                        class="yellow white--text mr-1"
                        v-if="inrequestFriends"
                        @click="cancelFriendRequest() "
                      >
                        <v-icon class="mr-1" small>mdi-account-alert-outline</v-icon>cancle
                      </v-btn>
                      <v-btn
                        outlined
                        class="primary white--text"
                        v-if="inrequestFriends"
                        @click="acceptFriend() "
                      >
                        <v-icon class="mr-1" small>mdi-account-alert-outline</v-icon>accept
                      </v-btn>
                    </div>

                    <div v-else>
                      <v-btn outlined class="success white--text" @click="addFriend()">
                        <v-icon small>mdi-account-arrow-right-outline</v-icon>add friend
                      </v-btn>
                    </div>
                    <!-- will appear anyway the msg button -->
                    <div>
                      <v-btn outlined class="success ml-1 white--text" @click="sendMsg()">
                        <v-icon small class="mr-1">mdi-facebook-messenger</v-icon>message
                      </v-btn>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="head">
                    <app-profile-tabs header="/friendProfile/" :tabs="tabs"></app-profile-tabs>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
      </div>
      <v-container class="pt-0 mt-5">
        <v-divider></v-divider>
        <router-view></router-view>
      </v-container>
    </div>
  </v-app>
</template>
<script>
import Functions from "../../../../server/api";
import tabsProfileVue from "../includesComponent/tabsProfile.vue";

export default {
  name: "friendProfile",
  components: {
    "app-profile-tabs": tabsProfileVue,
  },
  data() {
    return {
      tabs: [
        { id: this.$route.params.id, pageName: "", name: "posts" },
        {
          id: this.$route.params.id,
          pageName: "/friendFriends",
          name: "friends",
        },
        {
          id: this.$route.params.id,
          pageName: "/friendPics",
          name: "pictures",
        },
      ],
      user: "",
      infriendsList: null,
      inrequestFriends: null,
      newFriendsRequests: null,
      id: this.$route.params.id,
      data: {
        userId: this.$store.getters.getUser._id,
        friendId: this.$route.params.id,
      },
    };
  },
  async mounted() {
    this.socket = this.$soketio;
    try {
      let alldata = {
        friendId: this.$route.params.id,
        userId: this.$store.getters.getUser,
      };
      const res = await Functions.getYourProfile(alldata);
      this.user = res.data.user;
      let statues =res.data
      this.buttonsStatus(statues.infriendsList,statues.inRequestFriends,statues.newFriendsRequests)
    } catch (error) {
      this.errors = error;
    }
  },
  methods: {
    buttonsStatus(a,b,c){
      this.infriendsList = a;
      this.inrequestFriends = b;
      this.newFriendsRequests = c;
    },
    async addFriend() {
      try {
        await Functions.sendFriendRequest(this.data);
        this.buttonsStatus('false','true','false')
        
        let u = this.currentUser;
        const noti = {
          userId: u._id,
          name: u.name,
          img: u.img,
          friendId: this.data.friendId,
          action: "newNotification",
          msg: " have sent you friend request ",
        };
        await Functions.friendRequestNotifications(noti);
        this.socket.emit("sendFriendRequest", noti);
      } catch (error) {
        this.errors = error;
      }
    },

    async unfriend() {
      try {
        const res = await Functions.deleteFriend(this.data);
        console.log(res);
        this.infriendsList = false;
        this.inrequestFriends = false;
      } catch (error) {
        console.log(error);
      }
    },
    async cancelFriendRequest() {
      try {
        const res = await Functions.rejectfriend(this.data);
        this.infriendsList = false;
        this.inrequestFriends = false;

        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    async acceptFriend() {
      try {
        let u = this.currentUser;
        let data = {
          userId: u._id,
          friendId: this.$route.params.id,
        };
        this.overlay = true;
        let res = await Functions.acceptNewFriend(data);
        if (res.status == 200) {
          this.buttonsStatus("true","false","false")
          const noti = {
            userId: u._id,
            name: u.name,
            img: u.img,
            friendId: data.friendId,
            action: "newNotification",
            msg: " have acccepted  your friend request ",
          };
          await Functions.friendRequestNotifications(noti);
          this.socket.emit("sendFriendRequest", noti);
        }

        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.errors = error;
      }
    },
    sendMsg() {
      if (this.infriendsList) {
        let u = this.$store.getters.getUser;
        let s = u.newFriendsTest.filter((p) => {
          return p.friendId == this.id;
        });
        let chatId = s[0].chatId;
        this.$router.push("/massageTest/" + chatId);
      } else {
        console.log("not in friend list ");

        let thedata = {
          userId: this.$store.getters.getUser._id,
          otherId: this.id,
        };
        Functions.msgFromOthers(thedata)
          .then((result) => {
            let chatId = result.data.chatId._id;
            this.$store.commit("setFriendId", this.id);
            this.$router.push("/massageTest/" + chatId);
          })
          .catch((err) => {
            this.errors = err;
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
#actionDiv div {
  text-transform: capitalize;
  display: inline-block;
}
#theCoverImg {
  min-height: 409px;
  max-height: 410px;
  background-size: cover;
  background-position: center;
}
#cover-img {
  position: relative;

  #profile-img {
    border-style: none;
    max-width: 130px;
    max-height: 152px;
    margin: 10px auto;
    display: block;
    position: absolute;
    z-index: 2;
    bottom: 34%;
    left: 45%;
    .the-avatar {
      border: 4px solid white;
    }
  }
  @media only screen and (max-width: 600px) {
    #profile-img {
      bottom: 47%;
      left: 29%;
    }
    #theCoverImg {
      max-height: 240px;
      min-height: 240px;
    }
  }
}
</style>
  