<template>
  <v-app>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container v-if="!overlay">
      <v-row>
        <v-col cols="12" v-if="posts">
          <v-card v-if="posts &&posts.length >0" class="mx-auto">
            <v-toolbar color="cyan" dark>
              <v-toolbar-title>saved Posts</v-toolbar-title>
            </v-toolbar>

            <v-list>
              <v-row>
                <template v-for="(post) in posts" style="cursor: pointer">
                  <v-col cols="12" :key="post._id">
                    <v-list-item @click="navegatetoPost(post.postId)">
                      <v-list-item-avatar v-if="post.img">
                        <v-img :src="post.img"></v-img>
                      </v-list-item-avatar>
                       <v-list-item-avatar v-else>
                        <v-icon>mdi-facebook</v-icon>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title
                          class="text-capitalize font-weight-bold"
                          v-html="post.description"
                        ></v-list-item-title>

                        <div style=" position: absolute;right: 4px;top: 8px"><v-btn class="pink--text" icon @click.stop="removePostFromFavourite(post)">
                          <v-icon>
                            mdi-delete</v-icon></v-btn></div>
                      </v-list-item-content>
                    </v-list-item>
                  </v-col>
                </template>
              </v-row>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" v-if="posts && posts.length <=0">
          <h2 class="text-center text-capitalize pink--text">there is no saved posts for you</h2>
        </v-col>
      </v-row>
    </v-container>
    <div class="chat">
      <v-row>
        <v-col cols="12" class="chat d-flex justify-center text-center ">
          <h2>start chatting</h2>
             <div>
             <v-btn class="red pa-4 ma-3" @click="signupnewone">
               sign up
             </v-btn>
             </div>
  <div>

  </div>
          <!-- <app-home></app-home> -->

        </v-col>
        <v-col>

          <app-vedio></app-vedio> 
        </v-col>
      </v-row>
    </div>
  </v-app>
</template>

<script>
import Functions from "../../../../server/api";
import vedio from './vedio';
import axios from 'axios';
// import home from './hometest.vue';
import { CometChat } from "@cometchat-pro/chat";

export default {
  name: "saved-Posts-Page",
  components: {
    "app-vedio":vedio,
    // "app-home":home,
  },
  data() {
    return {
      posts: null,
      username:null,
      uid:null,
    };
  },
  async mounted() {
    try {
      this.overlay = true;
      const res = await Functions.getSavedPosts(this.$route.params.id);
      this.posts = res.data.savedposts;
      this.overlay = false;
    } catch (error) {
      this.overlay = false;
      this.errors = error;
    }
  },

  methods: {
    signupnewone(){
   const url = "https://api-us.cometchat.io/v2.0/users";
   console.log(this.appId , " >> ", this.apiKey);
      axios
        .post(
          url,
          { uid: this.currentUser._id, name: this.currentUser.name},
          {
            headers: { 
              Accept: "application/json",
              appId: "1920602d3d81185e",
              apiKey: "d356d67a296d9e36284081c60a2bd5e82656011e",
              "Content-Type": "application/json",
            },
          }
        )
        .then((user) => {
          console.log(user);
        }).catch((err) => {
          console.log(err);
        });
    },
    startVideoChat() {
      if (!this.receiver_id) this.error = true;
      var receiverID = this.receiver_id;
      var callType = CometChat.CALL_TYPE.VIDEO;
      var receiverType = CometChat.RECEIVER_TYPE.USER;
      var call = new CometChat.Call(receiverID, callType, receiverType);
      CometChat.initiateCall(call).then(
        outGoingCall => {
          this.showSpinner = false;
          console.log("Call initiated successfully:", outGoingCall);
          // perform action on success. Like show your calling screen.
        },
        error => {
          console.log("Call initialization failed with exception:", error);
        })
        },
     getLoggedInUser() {
     CometChat.getLoggedinUser().then(
        user => {
          console.log(user);
          this.username = user.name;
          this.uid = user.uid;
        },
        error => {
          console.log(error);
        }
      );
    },
      authLoginUser() {
          console.log(this.currentUser.name);
          CometChat.login('superhero1', this.apiKey).then(
            (res) => {
              console.log('loged',res);
            },
            error => {
              console.log("Login failed with error:", error);
            }
          );
        },
    navegatetoPost(id) {
      this.$router.push("/singlePost/" + id);
    },

    async removePostFromFavourite(post) {
      try {
        const res = await Functions.removeSaved({
          postId: post.postId,
          userId: this.currentUser._id,
        });
        this.posts =res.data.user
        console.log(res.data.user);
      } catch (error) {
        this.errors = error;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>