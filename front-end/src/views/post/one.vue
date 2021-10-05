<template>
  <div>
    <v-sheet class="mb-3" rounded="lg">
      <v-card class="mx-auto" v-if="post" rounded="lg" style="cursor: pointer">
        <!-- new -->
        <!-- the user data and time  -->
        
        <v-list two-line class="theListDiv pt-0 pb-0">
          <v-list-item>
            <v-list-item-avatar style="cursor: pointer">
              <v-img class="elevation-6" :src="post.userId.img"></v-img>
            </v-list-item-avatar>

           

            <v-list-item-content class="pt-0">
              <v-list-item-subtitle
                @click="navegatetoprofile(post.userId._id)"
                style="cursor: pointer"
                class="text-h6 font-weight-bold text-capitalize"
              >
                {{post.userId.name}}
                <div style=" position: absolute;right: 4px;top: 8px;">
                  <slot name="options"></slot>
                </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle>{{post.date}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>


        <!-- the post content description and image  -->
        <v-list-item>
          <v-card-text class="mb-0 mt-0 pb-0 pt-0">
            <div class="my-4 subtitle-1 text-capitalize" @click="goTo(post)">{{post.description}}</div>
          </v-card-text>
        </v-list-item>
        <div v-if="post.img[0]">
          <v-img
            @click="index = 0"
            class="image"
            :style="{ backgroundImage: 'url(' + post.img[0] + ')' }"
            :max-height="heights"
            :src="post.img[0]"
          ></v-img>

           <CoolLightBox :items="post.img " :fullScreen="true" :index="index" @close="index = null"></CoolLightBox>
        </div>
        <!-- the post actions like like and comments  -->

        <v-card-actions>
          <v-menu open-on-hover top offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="deep-purple lighten-2"
                text
                v-bind="attrs"
                v-on="on"
                @click="addLike(post)"
              >
                <v-icon :class="{'pink--text':checking}">mdi-heart</v-icon>
                <small v-if="post.reacts" class="text-caption">({{post.reacts.length}})</small>
              </v-btn>
            </template>
            <v-list v-if="post.reacts.length >0">
              <v-list-item v-for="(item, index) in post.reacts" :key="index">
                <v-list-item-avatar
                  size="30"
                  style="cursor: pointer"
                  @click="navegatetoprofile(item.userId._id)"
                >
                  <v-img class="elevation-6" :src="item.userId.img"></v-img>
                </v-list-item-avatar>

                <v-list-item-content class="pt-0">
                  <v-list-item-subtitle
                    @click="navegatetoprofile(item.userId._id)"
                    style="cursor: pointer"
                    class="text-subtitle"
                  >{{item.userId.name}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-list v-else>
              <v-list-item-content class="pt-0">there no likes</v-list-item-content>
            </v-list>
          </v-menu>
          <v-btn color="deep-purple lighten-2" text @click="show=!show">
            <v-icon>mdi-comment</v-icon>
            <small v-if="post.comments">({{post.comments.length}})</small>
          </v-btn>

          <v-btn color="deep-purple lighten-2" text @click="reserve">
            <v-icon>mdi-share</v-icon>
          </v-btn>
        </v-card-actions>
        <!-- comment -->
        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>
            <v-card v-if="post" class="mx-auto" style="height:100%; width:100%" rounded="lg">
              <div class="pl-3">
                <v-row v-if="this.user">
                  <v-col cols="11">
                    <v-text-field
                      label="comment "
                      hide-details
                      @keyup.enter="addComment(post._id,post) "
                      v-model="comment"
                      @click:append="toggleMarker"
                      append-icon="mdi-emoticon-excited"
                    >
                      <template v-slot:prepend>
                        <v-avatar size="33">
                          <img :src="user.img" alt />
                        </v-avatar>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </div>

              <!-- new -->
              <v-list
                three-line
                v-for="comment in post.comments"
                :key="comment._id"
                :id="comment._id"
                class="theListDiv text-capitalize pt-0 pb-0"
              >
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img class="elevation-6" :src="comment.img[0]"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content class="pt-0">
                    <v-list-item-subtitle
                    @click="navegatetoprofile(comment.userId)"
                    style="cursor: pointer"
                      class="text-body-1 mb-0 font-weight-bold text-capitalize black--text"
                    >{{comment.name}}</v-list-item-subtitle>
                    <v-list-item-subtitle class="font-weight-bold ">
                      {{comment.description}}
                      <span v-if="checkit(comment)" class="ml-3">
                        <app-options-comment :comment="comment" :postId="post._id"></app-options-comment>
                      </span>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle small>{{comment.date}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </div>
        </v-expand-transition>
      </v-card>
    </v-sheet>
  </div>
</template>

<script>
import Functions from "../../../server/api";
import optionsComment from "../post/optionsComment";
export default {
  name: "one",
  components: {
    "app-options-comment": optionsComment,
    
  },
  props: ["post", "heights"],
  data() {
    return {
      on: "",
      name: "",
      index: null,
      comment: "",
      show: false,
      checking: null,
    };
  },
  mounted() {
   this.socket = this.$soketio;
    let reactsListUsers = this.post.reacts.find((p) => {
      return p.userId._id === this.user._id;
    });
    if (reactsListUsers) {
      this.checking = true;
    } else {
      this.checking = false;
    }
  },
  methods: {
    checkit(comment) {
      if (comment.userId == this.user._id) {
        return true;
      }
      return false;
    },
    toggleMarker() {
      console.log("appened method ");
    },
    reserve() {
      this.show = !this.show;
    },
    goTo(post) {
      this.$router.push("/singlePost/" + post._id);
    },
    navegatetoprofile(friendId) {
      this.$router.push("/FriendProfile/" + friendId);
    },
    async addComment(postId, post) {
      try {
        await Functions.creatComment({
          user: this.user,
          postId,
          comment: this.comment,
        });
        this.comment = "";
        const prepareNotificationData = {
          userId: this.user._id,
          name: this.user.name,
          img: this.user.img,
          friendId: post.userId._id,
          postId: post._id,
          action: "newCommentNotification",
          msg: " have comment on your post  ",
        };
        await Functions.pushToAllNotifications(prepareNotificationData);
        this.socket.emit("makeComment", prepareNotificationData);
      } catch (error) {
        console.log(error);
      }
    },
    async addLike(post) {
      let postData = {
        postId: post._id,
        user: this.user,
      };
      try {
        if (this.checking) {
          let res = await Functions.removeLike(postData);
          console.log(res.data.post.reacts);
          this.post.reacts = res.data.post.reacts;
          //  post.reacts.push({})
          this.checking = false;
        } else {
          const res = await Functions.addLike(postData);
          this.post.reacts = res.data.post.reacts;
          const noti = {
            userId: this.user._id,
            name: this.user.name,
            img: this.user.img,
            friendId: post.userId._id,
            postId: post._id,
            action: "newLikeNotification",
            msg: " have like on your post  ",
          };

          this.$store.dispatch("editPost", res.data.post);
          await Functions.pushToAllNotifications(noti);
          this.socket.emit("addLike", noti);
          this.checking = true;
        }
      } catch (error) {
        console.log(error);
        this.errors = error;
      }
    },
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },

    postId() {
      return this.$route.params.id;
    },
  },
};
</script>

<style lang="scss" scoped>
.checking {
  color: blue !important;
  font-size: 30px;
  .ico {
    color: rgb(187, 4, 34) !important;
  }
}
.theActionOne {
  position: absolute;
  right: 33px;
  top: 28px;
  font-size: 20px;
}
</style>