<template>
  <div>
    <v-dialog v-model="dialog" max-width="900 " class="ma-0">
      <!-- <v-card> -->
      <template v-slot:activator="{ on, attrs }">
        <div
          class="rounded-lg text-capitalize"
          style="width: 100%"
          v-bind="attrs"
          v-on="on"
        >
          <v-text-field
            solo
            rows="3"
            row-height="15"
            prepend-inner-icon="mdi-pencil"
            hide-details
            readonly
            :label="'what is in yor mind ' + currentUser.name"
          ></v-text-field>
        </div>
      </template>
      <v-card>
        <v-card-title
          class="headline text-center text-capitalize grey lighten-2"
        >
          {{ mode == "create" ? "create post" : "edit post" }}
        </v-card-title>
        <v-divider></v-divider>
        <div class="ml-2 container">
          <!-- user details {name / img } -->
          <div class="my-3">
            <v-list one-line class="pt-0 pb-0">
              <v-list-item>
                <v-list-item-avatar>
                  <v-img :src="currentUser.img"></v-img>
                </v-list-item-avatar>

                <v-list-item-content class="pt-0">
                  <v-list-item-subtitle
                    class="text-h6 font-weight-bold text-capitalize"
                    >{{ currentUser.name }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>

          <div>
            <div>
              <textarea-emoji-picker v-model="selected.description" />
            </div>
          </div>

          <div class="features my-2">
            <v-btn class="text-capitalize" @click="refs">
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

          <div
            v-if="imgReviewer"
            class="rounded-lg"
            style="max-width=150px;max-height:190px"
          >
            <v-img
              contain
              style="max-width=100%;height:190px"
              :src="imgReviewer"
            ></v-img>
          </div>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="text-capitalize"
            color="primary"
            block
            @click="create"
            >{{ mode == "create" ? "create post" : "edit post" }}</v-btn
          >
          
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TextareaEmojiPicker from "../../post/emojiPicker";
import Functions from "../../../../server/api";

export default {
  components: { TextareaEmojiPicker, },
  props: ["mode", "post"],
  data() {
    return {
      imgReviewer: null,
      dialog:false,
      selected:{},
        pic: [],
    };
  },
  mounted() {

    if (this.mode =="edit") {
      this.dialog = true;
      this.selected.id = this.post._id
       this.selected.description=this.post.description,
        this.selected.img=this.post.img,
      this.imgReviewer = this.post.img[0];

    }
  },

  methods: {
    refs() {
      this.$refs.uploading.click();
    },
    uploadFile(e) {
       this.pic = e.target.files;
      this.imgReviewer = URL.createObjectURL(e.target.files[0]);
    },
 
    create() {
      if (this.selected._id) {
        // edit the post
        this.sumbitEdit()
      } else {
        this.creatPost()
      }
    },
      clearInputs() {
      this.dialog = false;
      this.overlay = false;
      this.pic = [];
      this.imgReviewer = null;
      this.selected= {};
    },
    async sumbitEdit() {
      try {
        const formData = new FormData();
        for (const i of Object.keys(this.pic)) {
          formData.append("files", this.pic[i]);
        }
        formData.append("data", JSON.stringify(this.selected));
        this.overlay = true;
        await Functions.editPost(formData);
        this.clearInputs();
      } catch (error) {
        this.overlay = false;
        this.errors = error;
      }
    },


     async creatPost() {
      const postdata = {
        description: this.selected.description,
        userId: this.currentUser._id,
      };
      const formData = new FormData();
      for (const i of Object.keys(this.pic)) {
        formData.append("files", this.pic[i]);
      }
      formData.append("data", JSON.stringify(postdata));
      try {
        this.overlay = true;
        await Functions.createPost(formData);
        this.clearInputs();
        this.dialogNotifySuccess("added new post ");
      } catch (error) {
        this.alertError(error);
        this.overlay = false;
        this.errors = error;
      }
    },
  },
  watch: {
    dialog(newValue) {
      if (newValue==false) {
        this.$emit("hideDialog",false)

      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>