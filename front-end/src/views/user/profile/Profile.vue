<template>
  <v-app>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div v-if="!overlay" class="content">

      <div class="cover" id="cover-img">
        <v-btn id="edit-btn" text @click="selectCoverImg">
          <v-icon large class="white--text">mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          class="red edit-btn"
          small
          text
          @click.prevent="submitCoverUpdate"
          v-if="showcoverbtn"
          >update cover
          </v-btn >
        <CoolLightBox
          :items="[user.coverImg]"
          :fullScreen="true"
          :index="index"
          @close="index = null"
        ></CoolLightBox> 
        
         <CoolLightBox
          :items="[user.img]"
          :fullScreen="true"
          :index="ProfileIndex"
          @close="ProfileIndex = null"
        ></CoolLightBox>



        <div
          @click="index = 0"
          :src="[user.coverImg][0]"
          class="cover-img"
          id="theCoverImg"
          :style="{ 'background-image': 'url(' + user.coverImg + ')' }"
          alt="cover"
        ></div>

        <div class="user">
          <div id="profile-img" @click="ProfileIndex = 0" :src="[user.img][0]">
            <v-hover v-slot="{ hover }">
              <v-avatar size="128" class="the-avatar">
                <v-img
                  :src="user.img"
                  alt="profilepic"
                  aspect-ratio="2"
                ></v-img>
                <v-fade-transition>
                  <v-overlay v-if="hover" absolute color="#036358">
                    <v-icon color="white" @click.stop="selectProfileImg"
                      >mdi-pencil</v-icon
                    >
                  </v-overlay>
                </v-fade-transition>
              </v-avatar>
            </v-hover>
          </div>
          <!-- img cropper -->
           <input
                type="file"
                class="d-none"
                @change="uploadProfileImg"
                ref="profileImg"
              />

        <app-upload-image v-if="openCropperDialog"  @closeDialog="openCropperDialog= $event" :imgsrc="profileImgSrc" :mode="mode"></app-upload-image>

          <div class="text-center text-capitalize">
            <h1>{{ user.name }}</h1>
            <p>
              {{ user.bio }}
              <!-- EDIT BUTTON -->
              <v-btn
                small
                class="info"
                v-bind="attrs"
                v-on="on"
                @click="editProfile"
                fab
              >
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </p>
          </div>
        </div>
      </div>
      <v-container class="pt-0">
        <div class="head">
          <app-profile-tabs header="/profile/" :tabs="tabs"></app-profile-tabs>
        </div>
        <router-view></router-view>

        <!-- edit dialog -->
        <div class="dialog-edit">
          <v-dialog v-model="editDialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="d-none" v-bind="attrs" v-on="on"></v-btn>
            </template>
            <v-card>
              <v-card-title
                class="headline text-center text-capitalize grey lighten-2"
                >edit profile</v-card-title
              >
              <v-divider></v-divider>
              <v-container>
                <v-row class="dense">
                  <v-col cols="12" >
                    <v-text-field
                      hide-details
                      outlined
                      dense
                      v-model="oldUserData.name"
                      label="First name"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" >
                    <v-text-field
                      hide-details
                      outlined
                      dense
                      v-model="oldUserData.bio"
                      label="bio"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" >
                    <v-text-field
                      hide-details
                      outlined
                      dense
                      v-model="oldUserData.email"
                      label="E-mail"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" >
                    <v-text-field
                      hide-details
                      outlined
                      dense
                      type="number"
                      v-model="oldUserData.age"
                      label="age"
                      required
                      :value="oldUserData.age"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" >
                    <v-text-field
                      hide-details
                      outlined
                      dense
                      type="number"
                      v-model="oldUserData.phone"
                      label="phone"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" >
                    <v-text-field
                      hide-details
                      outlined
                      dense
                      v-model="oldUserData.city"
                      label="city"
                      required
                    ></v-text-field>
                  </v-col>
                 
                </v-row>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" block @click="updateProfile"
                  >edit</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <!-- /img dialog  -->
      </v-container>
    </div>
  </v-app>
</template>
<script>
import Functions from "../../../../server/api";
import tabsProfileVue from "../includesComponent/tabsProfile.vue";
import uploadImage from "./Upload-Image";
export default {
  name: "mainProfile",
  components: {
    "app-profile-tabs": tabsProfileVue,
    'app-upload-image':uploadImage
    
    ,
  },

  data() {
    return {
      overlay: false,
      mode:"",
      openCropperDialog: false,
      editDialog: false,
      showcoverbtn: false,
      rout: this.$route.name,
      items: null,
      on: "",
      attrs: "",
      index: null,
      ProfileIndex: null,
      profileImgSrc: null,

      oldUserData: {
        name: "",
        id: "",
        email: "",
        age: "",
        city: "",
        phone: "",
        bio: "",
      },
      tabs: [
        { id: this.$route.params.id, pageName: "", name: "posts" },
        {
          id: this.$route.params.id,
          pageName: "/profileFriends",
          name: "friends",
        },
        {
          id: this.$route.params.id,
          pageName: "/profilePics",
          name: "pictures",
        },
      ],
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
    uploadProfileImg(e) {
      const input = e.target.files;
      var reader = new FileReader();
      reader.readAsDataURL(input[0]);
      reader.onload = () => {
        this.profileImgSrc = reader.result;
        this.openCropperDialog = true

        // this.showSelectBtn = false;
        // this.showCropper = true;
        // this.showEditor = true;
        // this.showImgAfterEdit = false;
      };
    },
    selectProfileImg(){
      this.mode = 'profile'
      // this.openCropperDialog=true
      this.$refs.profileImg.click();


    },
   
      selectCoverImg() {
      this.mode="cover"
      this.$refs.profileImg.click();
    },
    editProfile() {
      this.editDialog = true;
      const { img, bio, phone, city, age, email, name } = this.user;
      this.oldUserData = {
        userId: this.user._id,
        img,
        bio,
        phone,
        city,
        age,
        email,
        name,
      };
    },
    async updateProfile() {
      try {
        // this.overlay = true;
        const {data} = await Functions.editProfile(this.oldUserData);
        this.editDialog = false;
        this.$store.commit("updateUser", data);
        // this.overlay = false;
      } catch (error) {
        // this.overlay = false;
        this.errors = error;
      }
    },

  },
};
</script>

<style lang="scss" scoped>
#cover-img,
#profile-img {
  cursor: pointer;
}
#cover-img {
  position: relative;
  #edit-btn,
  .edit-btn {
    display: block;
    position: absolute;
    z-index: 2;
    bottom: 24%;
    left: 6px;
  }
  .edit-btn {
    left: 80px;
  }

  #profile-img {
    border-style: none;
    max-width: 130px;
    max-height: 152px;
    margin: 10px auto;
    display: block;
    position: absolute;
    z-index: 2;
    bottom: 16%;
    left: 45%;
    .the-avatar {
      border: 4px solid white;
    }
  }
  #theCoverImg {
    min-height: 409px;
    max-height: 410px;
    background-size: cover;
    background-position: center;
  }
  @media only screen and (max-width: 600px) {
    #profile-img {
      bottom: 26%;
      left: 29%;
    }
    #theCoverImg {
      max-height: 240px;
      min-height: 240px;
    }
    #edit-btn,
    .edit-btn {
      bottom: 29%;
    }
  }
}
</style>
