<template>
  <div class="text-center">
    <v-row>
      <v-col cols="auto">
        <v-dialog
          transition="dialog-bottom-transition"
          max-width="600"
          v-model="dialog"
          persistent
        >
          <!-- <v-card v-if="!showCropper">
            <v-toolbar dark dense class="text-capitalize"
              >
               <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>upload image</v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pb-1">
              <div >
                <v-row justify="center" align="center">
                  <v-col cols="6">
                    <v-img max-height="288" :src="src" aspect-ratio="1"></v-img>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="uploadImg" color="red" 
                >upload</v-btn
              >

              <v-btn text color="green"  @click="editImg"
                >eidt</v-btn
              >
            </v-card-actions>
          </v-card> -->

          <v-card >
            <v-toolbar class="text-capitalize" dark dense
              >
               <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>edit image</v-toolbar-title>
              
            </v-toolbar>
            <v-card-text class="pb-1">
              <div v-if="src">
                <Image-Cropper :mode="mode" :src="src"  @closeDialog="closeDialog($event)" ></Image-Cropper>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import ImageCropper from "./image-cropper";
import Functions from "../../../../server/api"
export default {
  components: {
    'Image-Cropper':ImageCropper,
  },
  props: ['imgsrc',"mode"],
  

  data() {
    return {
      dialog: false,
      showCropper: false,
      src: "",
    };
  },
  mounted () {
    this.dialog = true;
    this.src = this.imgsrc
    
  },
  methods: {
    editImg() {
      this.showCropper = true;
    },
    async uploadImg(){
      try {
        if (this.src) {
          
        const formData = new FormData();
          formData.append("files", this.src);
          formData.append("mode", this.mode);
          const res = await Functions.uploadCroppedImage({
            userId: this.currentUser._id,
            formData,
          })
           if (this.mode == "profile") {
                this.$store.commit("updateProfileImg", res.data.newImg);
              } else {
                this.$store.commit("updateCoverImg", res.data.newImg);
              }

              this.dialog =false
              this.closeDialog()
        }

        
      } catch (error) {
          console.log(error);
      }

     },
     closeDialog() {
      this.$emit("closeDialog", false);
    },


  },
   watch: {
    dialog(newValue) {
      if (newValue == false) {
        this.closeDialog();
        console.log('closed');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>