<template>
  <div class="d-inline-block">
    <!--  menu for the (save-edit-delete-hide) -->
    <v-menu transition="slide-y-transition" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ml-auto font-weight-bold"
          icon
          v-bind="attrs"
          v-on="on"
        ><v-icon class="success--text">mdi-pencil</v-icon></v-btn>
      </template>
      <v-list>
        <div >
          <v-list-item>
            <v-list-item-title>
              <v-btn class="text-capitalize" text @click.stop="deleteComment(comment)">
                <v-icon class="pink--text">mdi-delete</v-icon>delete
              </v-btn>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>
              <!-- edit the post  -->
              <v-dialog v-model="dialog" width="500" style="min-height:300px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text  class="text-capitalize" v-bind="attrs" v-on="on" @click="editComment(comment)">
                    <v-icon class="info--text">mdi-pencil</v-icon>edit 
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title
                    class="headline text-center text-capitalize success lighten-2"
                  >edit comment</v-card-title>
                  <v-divider></v-divider>
                  <div class="ml-2 container">
                    <div>
                      <div>
                        <textarea-emoji-picker v-model="dialogData.description" />
                      </div>
                    </div>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" block @click="submitEdit">edit comment</v-btn>
                  </v-card-actions>
                  </div>
                </v-card>
              </v-dialog>
            </v-list-item-title>
          </v-list-item>
         
        </div>

      </v-list>
    </v-menu>
  </div>
</template>

<script>
import Functions from "../../../server/api";
import TextareaEmojiPicker from "./emojiPicker";
export default {
  components: { TextareaEmojiPicker },
  props: ["comment","postId"],
  data() {
    return {
      dialog: false,
      editDialog: false,
      overlay: false,
      dialogData: {
        id: "",
        description: "",
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
  },

  methods: {
    async deleteComment(comment) {
      console.log(comment);
      const commentId = comment._id;
      if (this.user._id === comment.userId) {
        const agre = confirm("are you wanna to delete it ");
        if (agre) {
          try {
             await Functions.deleteComment({commentId,postId:this.postId});
          } catch (error) {
            this.errors = error;
          }
        }
      }
    },
    async editComment(comment) {
        this.dialogData.description = comment.description;
    },
  async  submitEdit(){
      try {
          let data = {
               commentId : this.comment._id,
               newComment :  this.dialogData.description,
               postId : this.postId
          }
         await Functions.editComment(data)
          this.dialog=false

          
      } catch (error) {
          this.errors = error
          this.dialog=false
      }


    }
  },
};
</script>

<style lang="scss" scoped>
</style>