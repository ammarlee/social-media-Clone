<template>
  <v-app>
    <v-container>
      <div>
        <div>
          <v-row>
            <v-col cols="3" class="d-none d-sm-block">
              
            </v-col>
            
            <v-col cols="12" sm="6">
              <app-new-post></app-new-post>
              <div v-if='posts.length>0'>
              <app-all-posts
                v-for="(post,key) in posts"
                :id="'div'+post._id"
                :post="post"
                 heights="270"
                :key="key"
              >
              <div slot="options">
                <app-options :post="post"></app-options>
              </div>
              
              </app-all-posts>

              </div>
              <div v-else>
               <v-alert color="red" outlined type="info"> there is no posts avalible for that user</v-alert>
               </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import addPost from "../../../views/post/createPost";
import allPosts from "../../post/one";
import allOptions from './menuOption'

export default {
  name: "posts",
  components: {
    "app-new-post": addPost,
    "app-all-posts": allPosts,
    "app-options": allOptions,
  },
  data() {
    return {
      rout: this.$route.name,
      showPostcomments: false,
      items: null,
      dialogData: {
        id: "",
        description: "",
        img: [],
      },
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    user_id() {
      return this.$route.params.id;
    },
    posts() {
      return this.$store.getters.posts.filter((p) => {
        return p.userId._id == this.$route.params.id;
      });
    },
  },

  methods: {
    savePost(postId) {
      console.log(postId);
    },
  },
};
</script>


<style lang="scss" scoped>
</style>