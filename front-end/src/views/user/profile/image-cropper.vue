<template>
  <div>
	 
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >

        <v-card>
          <v-toolbar dark color="black">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn title="delete" icon @click="reset"
                ><v-icon color="pink">mdi-delete</v-icon></v-btn
              >

              <v-btn :disabled="!this.canvas" icon @click="uploadImage" title="upload image">
                <v-icon color="yellow">mdi-cloud-upload</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <div id="app ">
			  <v-row justify="center" class="pt-13" >
	

              <cropper :src="image" ref="cropper" v-if="showCropper" />
                <v-img
				v-if="showImgAfterEdit"
                  :src="image"
                  max-height="300"
                  max-width="459"
                  :alt="image"
                >
                </v-img>
			  </v-row>
			</div>
 <v-row justify="center" align="center">
				<!-- input and select btn -->
              <div v-if="showSelectBtn" >
                <input
                  type="file"
                  class="d-none"
                  @change="uploadProfileImg"
                  ref="profileImg"
                />
                <v-btn
                  x-large
                  icon
                  text
                  class="text-capitalize mb-3 pink white--text"
                  @click="selectImage"
                  ><v-icon x-large title="select image"
                    >mdi-folder-upload</v-icon
                  ></v-btn
                >
              </div>
 </v-row>

				<!-- editors btn -->
              <div
                
                v-if="showEditor"
                id="editorTools"
              >
                <v-btn
                  title="crop"
                  icon
                  text
                  class="red white--text"
                  @click="crop"
                  ><v-icon small>mdi-crop</v-icon></v-btn
                >
                <v-btn
                  title="rotate"
                  icon
                  text
                  class="green white--text"
                  @click="rotate(90)"
                  ><v-icon small>mdi-format-rotate-90</v-icon></v-btn
                >
                <v-btn
                  title="flip"
                  icon
                  text
                  class="green white--text"
                  @click="flip"
                  ><v-icon small>mdi-flip-horizontal</v-icon></v-btn
                >
                <v-btn
                  title="delete"
                  icon
                  text
                  class="pink white--text"
                  @click="reset"
                  ><v-icon small>mdi-delete</v-icon></v-btn
                >
              </div>
          </v-card-text>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import Functions from "../../../../server/api";
export default {
	props: ['mode'],
  components: {
    Cropper,
  },
  mounted() {
    this.showSelectBtn = true;
    this.showCropper = false;
	this.selectImage()
  },
  data() {
    return {
      showSelectBtn: true,
	  showImgAfterEdit:false,
	  canvas:"",
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
    reset() {
      this.image = null;
      this.showSelectBtn = true;
    },
    flip(x, y) {
      this.$refs.cropper.flip(x, y);
    },
    rotate(angle) {
      this.$refs.cropper.rotate(angle);
    },
	closeDialog(){
		this.$emit('closeDialog',false)
	},
	selectImage(){
		this.$refs.profileImg.click()
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
			  if (this.mode=='profile') {
				    this.$store.commit('updateProfileImg',res.data.newImg)
			  } else {
				    this.$store.commit('updateCoverImg',res.data.newImg)
			  }

			  this.closeDialog()
            })
            .catch((err) => {
              console.log(err);
            });
        }, "image/jpeg");
      }
    },
  },
  watch: {
	  dialog(newValue) {
		  if (newValue==false) {
			  
			  this.closeDialog()
		  }
		  
	  }
  },
};
</script>

<style scoped>
h2 {
  color: red;
  text-transform: capitalize;
}
.cropper {
  height: 600px;
  background: #ddd;
}
#editorTools {
  position: absolute;
  left: 11%;
  top: 13%;
  height: 400px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content:space-around
}
</style>