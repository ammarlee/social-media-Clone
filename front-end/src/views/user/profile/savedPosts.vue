<template>
  <v-app>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container v-if="!overlay">
      <v-row>
        <v-col cols="12" v-if="posts">
          <v-card v-if="posts.length >0" class="mx-auto">
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
        <v-col cols="12" v-if="posts.length <=0">
          <h2 class="text-center text-capitalize pink--text">there is no saved posts for you</h2>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Functions from "../../../../server/api";
export default {
  name: "saved-Posts-Page",
  data() {
    return {
      posts: null,
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