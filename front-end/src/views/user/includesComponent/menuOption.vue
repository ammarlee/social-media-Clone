<template>
  <div>
    <!--  menu for the (save-edit-delete-hide) -->
          <app-Edit-Post
                v-if="show"
                :post="selected"
                mode="edit"
                @hideDialog="show=$event"
              ></app-Edit-Post>
            
    <v-menu
      transition="slide-y-transition"
      bottom
      :close-on-click="closeOnClick"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ml-auto font-weight-bold"
          @click="openOptions(post.userId._id)"
          text
          v-bind="attrs"
          v-on="on"
          >...</v-btn
        >
      </template>

      <v-list>
        <div v-if="items">
          <v-list-item>
            <v-list-item-title>
              <v-btn class="text-capitalize" text @click.stop="savePost(post)">
                <v-icon :class="{ 'pink--text': checking }">mdi-star</v-icon
                >{{ checking ? "saved" : "save post" }}
              </v-btn>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>
              <!-- edit the post  -->
               <v-btn
                    class="text-capitalize"
                    text
                    @click="editPost(post)"
                  >
                    <v-icon class="success--text">mdi-pencil</v-icon>edit post
                  </v-btn>

            </v-list-item-title>
          </v-list-item>
          <!-- '''''''''''' -->

          <v-list-item>
            <v-list-item-title>
              <v-btn class="text-capitalize" text @click="deletePost(post)">
                <v-icon class="red--text text-capitalize">mdi-delete</v-icon
                >delete post
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </div>

        <div v-else>
          <v-list-item>
            <v-list-item-title>
              <v-btn class="text-capitalize" text @click.stop="savePost(post)">
                <v-icon :class="{ 'pink--text': checking }">mdi-star</v-icon
                >{{ checking ? "saved" : "save post" }}
              </v-btn>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>
              <v-btn class="text-capitalize" text @click="hidePost(post)">
                <v-icon>mdi-eye-off</v-icon> hide post
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </div>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import Functions from "../../../../server/api";
import createPost from "./editDialog";
export default {
  components: { "app-Edit-Post": createPost },
  props: ["post"],
  data() {
    return {
      selected: null,
      show:false,
      closeOnClick: true,
      errors: null,
      overlay: false,
      rout: this.$route.name,
      items: null,
 
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    user_id() {
      return this.$route.params.id;
    },
    checking() {
      return this.user.savedPosts.some((p) => {
        return p.postId == this.post._id;
      });
    },
  },

  methods: {
    async savePost(post) {
      try {
        if (!this.checking) {
          const res = await Functions.savePost({ post, userId: this.user._id });
          this.$store.commit("updateUser", res.data);
        } else {
          return;
        }
      } catch (error) {
        this.errors = error;
      }
    },
  
    async deletePost(post) {
      const postId = post._id;
      if (this.user._id === post.userId._id) {
        const agre = confirm("are you wanna to delete it ");
        if (agre) {
          try {
            await Functions.deletPost(postId);
          } catch (error) {
            this.errors = error;
          }
        }
      }
    },
    
    editPost(post) {
      this.show = true
      this.selected = post

    },


    hidePost(post) {
      let posthidden = document.querySelector("#div" + post._id);
      posthidden.style.display = "none";
    },

    openOptions(userId) {
      let user = this.user._id;
      user === userId ? (this.items = true) : (this.items = false);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>