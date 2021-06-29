<template>
  <v-app>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div v-if="!overlay" class="content">
      <div class="cover" id="cover-img">
        <v-btn id="edit-btn" text @click="editCover">
          <v-icon large class="white--text">mdi-pencil</v-icon>

          <input type="file" ref="coverInput" @change="uploadCover" class="d-none" />
        </v-btn>
        <v-btn class="red edit-btn" small text @click.prevent="doit" v-if="showcoverbtn">update cover</v-btn>
        <div
          class="cover-img"
          id="theCoverImg"
          :style="{ 'background-image': 'url(' + user.coverImg + ')' }"
          alt="cover"
        ></div>
        <div class="user">
          <div id="profile-img">
            <v-avatar size="128" class="the-avatar">
              <img :src="user.img" alt="profilepic" />
            </v-avatar>
          </div>
          <div class="text-center text-capitalize">
            <h1>{{user.name}}</h1>
            <p>
              {{user.bio}}
              <!-- EDIT BUTTON -->
              <v-btn small class="info" v-bind="attrs" v-on="on" @click="editProfile" fab>
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </p>
          </div>
        </div>
      </div>
      <v-container class="pt-0">
        <div class="head">
          <app-profile-tabs header='/profile/' :tabs="tabs" ></app-profile-tabs>
        
        </div>
        <router-view></router-view>

        <!-- edit dialog -->
        <div class="dialog-edit">
          <v-dialog v-model="editDialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="d-none" v-bind="attrs" v-on="on"></v-btn>
            </template>
            <v-card>
              <v-card-title class="headline text-center text-capitalize grey lighten-2">edit profile</v-card-title>
              <v-divider></v-divider>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="oldUserData.name" label="First name" required></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field v-model="oldUserData.bio" label="bio" required></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field v-model="oldUserData.email" label="E-mail" required></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      type="number"
                      v-model="oldUserData.age"
                      label="age"
                      required
                      :value="oldUserData.age"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field type="number" v-model="oldUserData.phone" label="phone" required></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="oldUserData.city" label="city" required></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn
                      class="text-capitalize mb-3"
                      @click="$refs.profileImg.click()"
                    >upload profile photo</v-btn>
                    <v-avatar tile>
                      <v-img v-if="oldUserData.img" :src="oldUserData.img"></v-img>
                    </v-avatar>
                    <input type="file" class="d-none" @change="uploadProfileImg" ref="profileImg" />
                  </v-col>
                </v-row>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" block @click="submitProfile">edit</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-container>
    </div>
  </v-app>
</template>
<script>
import Functions from "../../../../server/api";
import tabsProfileVue from '../includesComponent/tabsProfile.vue';
export default {
  name: "mainProfile",
   components:{
    'app-profile-tabs':tabsProfileVue
  },
  data() {
    return {
      dialog: false,
      editDialog: false,
      showcoverbtn: false,
      rout: this.$route.name,
      items: null,
      on: "",
      attrs: "",

      oldUserData: {
        name: "",
        id: "",
        email: "",
        age: "",
        city: "",
        phone: "",
        bio: "",
      },
      userCover: [],
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
  mounted() {},
  computed: {
    user() {
      console.log('computed work');
      return this.$store.getters.getUser;
    },
    user_id() {
      return this.$route.params.id;
    },
  },

  methods: {
    editProfile() {
      this.editDialog = true;
      let u = this.user;
      this.oldUserData = {
        name: u.name,
        userId: u._id,
        email: u.email,
        age: u.age,
        city: u.city,
        phone: u.phone,
        bio: u.bio,
        img: u.img,
      };
    },
    async submitProfile() {
      try {
        if (this.oldUserData.img == this.user.img) {
          this.oldUserData.img = null;
        }
        // this.overlay = true;
        const res = await Functions.editProfile(this.oldUserData);
        this.editDialog = false;
        this.$store.commit("updateUser", res.data);
        // this.overlay = false;
      } catch (error) {
        // this.overlay = false;
        this.errors = error;
      }
    },

    editCover() {
      this.$refs.coverInput.click();
    },
    async doit() {
      try {
        const formData = new FormData();
        for (const i of Object.keys(this.userCover)) {
          formData.append("files", this.userCover[i]);
        }
        this.overlay = true;
        let res = await Functions.editCover({
          userId: this.user._id,
          formData,
        });
        this.showcoverbtn = false;
        this.user.coverImg = res.data.newImage
        this.$store.commit("updateUserCover", res.data);
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.errors = error;
      }
    },
    uploadProfileImg(e) {
      const input = e.target.files;
      var reader = new FileReader();
      reader.readAsDataURL(input[0]);
      reader.onload = () => {
        this.oldUserData.img = reader.result;
      };
      alert(this.oldUserData.img);
    },
    uploadCover(e) {
      this.userCover = e.target.files;
      this.showcoverbtn = true;
    },
    uploadFile(e) {
      const input = e.target.files;
      var reader = new FileReader();
      reader.readAsDataURL(input[0]);
      reader.onload = () => {
        this.dialogData.img.push(reader.result);
      };
    },
  },
};
</script>

<style lang="scss" scoped>
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
