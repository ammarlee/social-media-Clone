<template>
  <v-app>
    <v-container>
      <div>
        <div> 
          <v-row>
            <v-col cols="3"></v-col>
            <v-col cols="12" sm="6">
              <div v-if="posts.length >0">
              <app-all-posts
                v-for="(post,key) in posts"
                :post="post"
                :key="key"
                 heights="270"
                :id="'div'+post._id"
              >
                <div slot="options">
                  <app-options :post="post"></app-options>
                </div>
              </app-all-posts>
              </div>
              <div v-else>
                <h2 class="text-capitalize text-center mt-10 pink--text font-weight-bold">there is no posts here</h2>

              </div>
            </v-col>
            <v-col cols="3"></v-col>
          </v-row>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import allPosts from "../../post/one";
import allOptions from "../profile/menuOption";

export default {
  name: "posts",
  components: {
    "app-all-posts": allPosts,
    "app-options": allOptions,
  },
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$route.params.id
    },

    posts() {
      return this.$store.getters.posts.filter((p) => {
        return p.userId._id === this.user;
      });
    },
  },
};
</script>


<style lang="scss" scoped>
</style>