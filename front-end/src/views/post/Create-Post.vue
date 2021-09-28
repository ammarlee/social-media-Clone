<template>
  <div class="rounded-lg mb-10" id="mainDiv">
    <div class="red"></div>
    <v-list one-line class="rounded-lg">
      <v-list-item>
        <v-list-item-avatar style="cursor: pointer" @click="navigateToProfile">
          <v-img :src="user.img"></v-img>
        </v-list-item-avatar>

       <app-overlay :overlay="overlay" v-if="overlay"></app-overlay>

        <v-dialog v-else v-model="dialog" max-width="900 " class="ma-0">
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
                :label="'what is in yor mind ' + user.name"
              ></v-text-field>
            </div>
          </template>
          <v-card>
            <v-card-title
              class="
                headline
                justify-start
                text-center text-capitalize
                grey
                lighten-2
              "
              >Create new post</v-card-title
            >
            <v-divider></v-divider>
            <v-card-text>
              <div>
                <div>
                  <v-list one-line class="pt-0 pb-0">
                    <v-list-item>
                      <v-list-item-avatar>
                        <v-img :src="user.img"></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content class="pt-0">
                        <v-list-item-subtitle
                          class="text-h6 font-weight-bold text-capitalize"
                          >{{ user.name }}</v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </div>
                <div>
                  <textarea-emoji-picker v-model="description" />
                </div>
                <div class="features mt-2">
                  <v-btn @click="refs" fab text>
                    <v-icon color="red" fab>mdi-camera</v-icon>
                  </v-btn>
                  <input
                    class="d-none"
                    ref="uploading"
                    type="file"
                    @change="uploadFile"
                    multiple
                  />
                </div>

                <!-- <div class="reviewImg">
                 <div class="img-container" v-if="theImg" 
                 style="display: block; max-width: 100%;">
                    <v-img id="imginfo" contain   height="80" width="100" :src="theImg"></v-img>
                    <img ref="image" :src="theImg" :alt="theImg">
                    <span id="span" @click="deletePic">X</span>
                  </div>
              </div> -->
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn block color="primary" @click="creatPost">share</v-btn>
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
      theImg:
        "https://res.cloudinary.com/ammarleejot/image/upload/v1630276233/mevnstack/yvr8drvinz92za0d7oru.jpg",
      text: "",
      dialog: false,
      description: " ",
      pic: [],
    };
  },

  methods: {
    deletePic() {
      this.theImg = null;
    },
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
      this.theImg = URL.createObjectURL(e.target.files[0]);
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
        this.dialogNotifySuccess("added new post ");
      } catch (error) {
        this.alertError(error);
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
.img-container {
  // transition: all 0.5s ease-out;
  //   position: relative;
  width: 600px;
  height: 400px;
}
#span {
  position: absolute;
  color: red;
  cursor: pointer;
  left: 0;
  top: 0;
}
#imginfo:hover #imginfo #span {
  color: blue !important;
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