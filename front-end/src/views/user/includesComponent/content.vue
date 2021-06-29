<template>
  <v-col v-if="currentUser" cols="12" sm="6">
    <app-new-post></app-new-post>

    <app-all-posts v-for="(post,key) in posts" :post="post" heights="270" :key="key" :id="'div'+post._id">
      <div slot="options">
        <app-options :post="post"></app-options>
      </div>
    </app-all-posts>
    <div class="text-center" v-if="posts.length <=0">
      <span class="pink--text text-h5 mr-2 text-capitalize">there is no posts </span>
      
    </div>
  </v-col>
</template>
<script>
import addPost from "../../../views/post/createPost";
import allPosts from "../../post/one";
import allOptions from "../profile/menuOption";

export default {
  name: "conetent",
  components: {
    "app-new-post": addPost,
    "app-all-posts": allPosts,
    "app-options": allOptions,
  },
  data() {
    return {
      dialog: false,
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
    posts() {
      
      return this.$store.getters.posts;
    },
  },

  methods: {
    details(productId) {
      this.$router.push("/details/" + productId);
    },
  },
};
</script>

