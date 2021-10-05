<template>
  <div>
     <!-- <v-card> -->
       <v-container>
          <div id="app ">
            <v-row justify="center" class="pt-0">
              <v-col cols="8">
                <cropper
                  :src="image"
                  ref="cropper"
                  v-if="showCropper"
                  style="max-height: 400px"
                />
                <v-img v-if="showImgAfterEdit" :src="image" :alt="image">
                </v-img>
              </v-col>
            </v-row>
          </div>
     
          <div class="d-flex justify-center" v-if="!showImgAfterEdit">
          <p>
            crop image first to be able to upload it 
          </p>
          </div>

          <!-- editors btn -->
          <v-row style="max-width: 500px" v-if="src && !showImgAfterEdit" class="mx-auto grey lighten-3 rounded-lg"  >
            <v-col
              ><v-btn
                title="crop"
                icon
                text
                class="red white--text"
                @click="crop"
                ><v-icon >mdi-crop</v-icon></v-btn
              ></v-col  >
            <v-col>
              <v-btn
                title="rotate"
                icon
                text
                class="green white--text"
                @click="rotate(90)"
                ><v-icon >mdi-axis-z-rotate-clockwise</v-icon></v-btn
              ></v-col  >
                 <v-col>
              <v-btn
                title="rotate"
                icon
                text
                class="green white--text"
                @click="rotate(-90)"
                ><v-icon >mdi-axis-z-rotate-counterclockwise</v-icon></v-btn
              ></v-col  >

            <v-col>
              <v-btn
                title="flip"
                icon
                text
                class="green white--text"
                @click="flip"
                ><v-icon >mdi-flip-horizontal</v-icon></v-btn
              ></v-col
            >
            <!-- <v-col> -->
              <!-- <v-btn
                title="delete"
                icon
                text
                class="pink white--text"
                @click="reset"
                ><v-icon >mdi-delete</v-icon></v-btn
              ></v-col
            > -->
          </v-row>
     

         <v-card-actions class="justify-end pb-0 mb-0 mt-3">
            <v-btn
              :disabled="!this.canvas"
              text color="green"
              @click="uploadImage"
              title="upload image"
            >
            upload
            </v-btn>

         </v-card-actions>
       </v-container>

    
  </div>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import Functions from "../../../../server/api";
export default {
  props: ["mode", "src"],
  components: {
    Cropper,
  },
  mounted() {
    this.showSelectBtn = true;
    this.showCropper = true;
    this.image = this.src;
  },
  data() {
    return {
      showSelectBtn: true,
      showImgAfterEdit: false,
      canvas: "",
      showCropper: false,
      showEditor: false,
      dialog: true,
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      image: null,
    };
  },
  methods: {
    uploadProfileImg(e) {
      const input = e.target.files;
      var reader = new FileReader();
      reader.readAsDataURL(input[0]);
      reader.onload = () => {
        this.image = reader.result;
        this.showSelectBtn = false;
        this.showCropper = true;
        this.showEditor = true;
        this.showImgAfterEdit = false;
      };
    },
    crop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult();
      this.coordinates = coordinates;
      this.canvas = canvas;
      this.image = canvas.toDataURL();
      this.showCropper = false;
      this.showEditor = false;
      this.showImgAfterEdit = true;
    },
    // reset() {
    //   this.image = null;
    //   this.showSelectBtn = true;
    // },
    flip(x, y) {
      this.$refs.cropper.flip(x, y);
    },
    rotate(angle) {
      this.$refs.cropper.rotate(angle);
    },
   
    selectImage() {
      this.$refs.profileImg.click();
    },
    uploadImage() {
      let canvas = this.canvas;
      if (canvas) {
        const formData = new FormData();
        canvas.toBlob((blob) => {
          formData.append("files", blob);
          formData.append("mode", this.mode);
          Functions.uploadCroppedImage({
            userId: this.currentUser._id,
            formData,
          })
            .then((res) => {
              if (this.mode == "profile") {
                this.$store.commit("updateProfileImg", res.data.newImg);
              } else {
                this.$store.commit("updateCoverImg", res.data.newImg);
              }

                  this.closeDialog()
            })
            .catch((err) => {
              console.log(err);
            });
        }, "image/jpeg");
      }
    },
    closeDialog(){

      this.$emit('closeDialog',false)
    }
  },
  watch: {
    dialog(newValue) {
      if (newValue == false) {
        this.closeDialog()
       
        
      }
    },
  },
};
</script>

<style scoped>