<template>
  <div>
    <!--  menu for the (save-edit-delete-hide) -->
    <v-menu transition="slide-y-transition" bottom   :close-on-click="closeOnClick">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ml-auto font-weight-bold"
          @click="openOptions(post.userId._id)"
          text
          v-bind="attrs"
          v-on="on"
        >...</v-btn>
      </template>
      <v-list>
        <div v-if="items">
          <v-list-item>
            <v-list-item-title>
             <v-btn text  @click.stop="savePost(post)">
                <v-icon :class="{'pink--text':checking} ">mdi-star</v-icon>{{checking? 'saved':'save post'}} 
              </v-btn>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>
              <!-- edit the post  -->
              <v-dialog v-model="dialog" width="700">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text v-bind="attrs" v-on="on" @click="editPost(post)">
                    <v-icon class="success--text">mdi-pencil</v-icon>edit post
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title
                    class="headline text-center text-capitalize grey lighten-2"
                  >edit post</v-card-title>
                  <v-divider></v-divider>
                  <div class="ml-2 container">
                    <!-- user details {name / img } -->
                    <div class="my-3">
                      <v-list one-line class="pt-0 pb-0">
                        <v-list-item>
                          <v-list-item-avatar>
                            <v-img :src="user.img"></v-img>
                          </v-list-item-avatar>

                          <v-list-item-content class="pt-0">
                            <v-list-item-subtitle
                              class="text-h6 font-weight-bold text-capitalize"
                            >{{user.name}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>

                    <div>
                      <div>
                        <textarea-emoji-picker v-model="dialogData.description" />
                      </div>
                    </div>

                    <div class="features my-2">
                      <v-btn @click="refs" class="text-capitalize">
                        add to your post
                        <v-icon class="ml-2">mdi-camera</v-icon>
                      </v-btn>
                      <input
                        class="d-none"
                        ref="uploading"
                        type="file"
                        @change="uploadFile"
                        multiple
                      />
                    </div>
                    <div v-if="post.img.length >0" class="rounded-lg" style="max-width=150px;max-height:190px">
                      <v-img style="max-width=150px;height:190px" :src="dialogData.img[0]"></v-img>
                    </div>
                  </div>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" block @click="editThePost">edit post</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-list-item-title>
          </v-list-item>
          <!-- '''''''''''' -->
          <v-list-item>
            <v-list-item-title>
              <v-btn text @click="deletePost(post)">
                <v-icon class="red--text">mdi-delete</v-icon>delete post
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </div>

        <div v-else>
          <v-list-item>
            <v-list-item-title>
              <v-btn text  @click.stop="savePost(post)">
                <v-icon :class="{'pink--text':checking} ">mdi-star</v-icon>{{checking? 'saved':'save post'}} 
              </v-btn>
                
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>
              <v-btn text @click="hidePost(post)">
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
import TextareaEmojiPicker from "../../post/emojiPicker";
export default {
  components: { TextareaEmojiPicker },
  props: ["post"],
  data() {
    return {
      dialog: false,
       closeOnClick: true,
      editDialog: false,
      errors: null,
      overlay: false,
      rout: this.$route.name,
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
    checking(){
      return this.user.savedPosts.some((p) => {
        return p.postId == this.post._id;
      });

    }
   
  },

  methods: {
    async savePost(post) {
      try {
        console.log(this.checking);
        if (!this.checking) {
          const res =await Functions.savePost({post,userId:this.user._id})
           this.$store.commit('updateUser',res.data)
        } else{
          return
        }
        
      } catch (error) {
        this.errors = error
        
      }
    },
    refs() {
      this.$refs.uploading.click();
    },
    uploadFile(e) {
       this.dialogData.img = e.target.files;
    },
    
    async deletePost(post) {
      const postId = post._id;
      if (this.user._id === post.userId._id) {
        const agre = confirm("are you wanna to delete it ");
        if (agre) {
          try {
            await Functions.deletPost(postId);
          } catch (error) {
            this.errors=error
          }
        }
      }
    },
    async editThePost() {
      try {
         const formData = new FormData();
      for (const i of Object.keys(this.dialogData.img)) {
        formData.append("files", this.dialogData.img[i]);
      }
      formData.append("data", JSON.stringify(this.dialogData));
       this.dialog = false;
        this.overlay = true
         await Functions.editPost(formData);
        this.overlay = false
      } catch (error) {
         this.overlay = false;
        this.errors = error;
      }
    },
    editPost(post) {
      this.dialogData = {
        id: post._id,
        description: post.description,
        img: post.img,
      };
      this.dialog = true;
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