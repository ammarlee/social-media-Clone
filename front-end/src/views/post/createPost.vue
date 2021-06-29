<template>
  <div class="rounded-lg mb-10" id="mainDiv">
    <v-list one-line class="rounded-lg">
      <v-list-item>
        <v-list-item-avatar style="cursor: pointer" @click="navigateToProfile">
          <v-img :src="user.img"></v-img>
        </v-list-item-avatar>
        <v-overlay :value="overlay" v-if="overlay">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-dialog e-else v-model="dialog" :max-width="600 " class="ma-0">
          <!-- <v-card> -->
          <template v-slot:activator="{ on, attrs }">
            <div class="rounded-lg text-capitalize" style="width:100%" v-bind="attrs" v-on="on">
              <v-text-field
                solo
                rows="1"
                row-height="15"
                prepend-inner-icon="mdi-pencil"
                hide-details
                readonly 
                :label="'what is in yor mind '+user.name"
              ></v-text-field>
            </div>
          </template>
          <v-card>
            <v-card-title
              class="headline justify-start text-center text-capitalize grey lighten-2"
            >Create new post</v-card-title>
            <v-divider></v-divider>
            <div class="ml-2 container">
              <div>
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
                <textarea-emoji-picker v-model="description" />
              </div>
              <div class="features mt-2">
                <v-btn @click="refs" class="text-capitalize">
                  add to your post
                  <v-icon class="ml-2">mdi-camera</v-icon>
                </v-btn>
                <input class="d-none" ref="uploading" type="file" @change="uploadFile" multiple />
              </div>
            </div>
            <v-card-actions class="justify-end">
              <v-btn text color="red" @click="creatPost">post</v-btn>
            </v-card-actions>
            <!-- <v-card-actions> -->
          </v-card>
          <!-- </v-card> -->
        </v-dialog>

      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import Functions from "../../../server/api";
import TextareaEmojiPicker from "./emojiPicker";
export default {
  components: { TextareaEmojiPicker },
  data() {
    return {
      text: "",
      dialog: false,
      description: " ",
      pic: [],
    };
  },
  methods: {
    clearInputs() {
      this.dialog = false;
      this.overlay = false;
      this.pic = [];
      this.description = " ";
    },
    navigateToProfile() {
      this.$router.push("/profile/" + this.user._id);
    },
    refs() {
      this.$refs.uploading.click();
    },
    uploadFile(e) {
      this.pic = e.target.files;
    },
    async creatPost() {
      const postdata = {
        description: this.description,
        userId: this.user._id,
      };
      const formData = new FormData();
      for (const i of Object.keys(this.pic)) {
        formData.append("files", this.pic[i]);
      }
      formData.append("data", JSON.stringify(postdata));
      try {
        this.dialog = false;
        this.overlay = true;
        await Functions.createPost(formData);
        this.clearInputs();
          this.dialogNotifySuccess("added new post ")
      } catch (error) {
        this.alertError(error)
        this.overlay = false;
        this.errors = error;
      }
    },
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
};
</script>

<style lang="scss" scoped>
#mainDiv {
  box-shadow: 1px 9px 15px 2px rgb(35 26 26 / 50%);
  padding: 15px;
}
#theBtn {
}

@media (min-width: 0) and (max-width: 300px) {
  #mainDiv {
    overflow: scroll;
  }
  #theBtn {
    font-size: 1px;
  }
}
@media (min-width: 300px) and (max-width: 850px) {
  #mainDiv {
    overflow: scroll;
  }
  #theBtn {
    font-size: 15px;
  }
}
</style>