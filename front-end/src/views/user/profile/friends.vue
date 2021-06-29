<template>
<div>

  <v-app >
    <v-overlay :value="overlay" v-if="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container>
      <div class="text-capitalize text-center">
        <div class="nav-bar">
          <h1 class="mb-5">
            friends
            <span class="text--h5" v-if="friendsList">({{friendsList.length}})</span>
          </h1>
        </div>
        <div  class="friends">
          <v-row>
            <v-col cols="12" sm="5" md="3" v-for="friend in friendsList" :key="friend._id">
              <div
                class="d-flex main-div align-self-end"
                @click="navegatetoprofile(friend._id)"
              >
                <div class="friend-img">
                  <v-avatar>
                    <v-img :src="friend.img"></v-img>
                  </v-avatar>
                </div>
                <div class="img-details ml-2">
                  <h4>{{friend.name}}</h4>
                </div>
                <div>
                  <v-menu transition="slide-y-transition" open-on-hover offset-y bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="ml-auto font-weight-bold optionButton"
                        style=" font-size: 18px;"
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
                            <v-btn text @click="deleteFriend(friend._id)">
                              <v-icon>mdi-facebook</v-icon>delte friend
                            </v-btn>
                          </v-list-item-title>
                        </v-list-item>
                      </div>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
        <div v-if="friendsList" >
          <v-alert v-if="friendsList.length<=0" color="red" outlined type="info">there is no friends avalible</v-alert>
        </div>
      </div>
    </v-container>
  </v-app>
 
</div>

</template>

<script>
import Functions from "../../../../server/api";
export default {
  data() {
    return {
      friendsList: null,
      userId: this.$store.getters.getUser._id,
    };
  },
  async mounted() {
    try {
      this.overlay = true;
      const res = await Functions.getFriends(this.$store.getters.getUser._id);
      this.friendsList = res.data.friends;
      this.overlay = false;
    } catch (error) {
      this.overlay = false;
      this.errors = error;
    }
  },
  methods: {
    navegatetoprofile(friendId) {
      this.$router.push("/FriendProfile/" + friendId);
    },
    async deleteFriend(friendId) {
      try {
        const deleteData = {
          userId: this.userId,
          friendId: friendId,
        };
        this.overlay = true;
        let res = await Functions.deleteFriend(deleteData);
        console.log(res);
        this.friendsList=this.friendsList.filter(i=>{
          return i._id !==deleteData.friendId;
        })
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.errors = error;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main-div {
  cursor: pointer;
  // width: 54%;
  border: 2px solid darkgray;
  padding: 3px;
  overflow: hidden;
  position: relative;
  .optionButton {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>