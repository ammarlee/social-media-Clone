<template>
  <div class="text-center pt-15 pb-15">
    <template>
      <div>
        <router-link to="/" tag="span">
          <v-icon style="cursor: pointer; font-size: 68px">mdi-facebook</v-icon>
        </router-link>
        <v-card class="mx-auto" style="max-width: 500px">
          <v-toolbar class="teal mt-4 lighten-1" cards dark flat>
            <v-card-title
              class="
                title
                text-h4 text-capitalize
                white--text
                font-weight-regular
              "
            >
              <h5>log in</h5>
            </v-card-title>
          </v-toolbar>
          <v-form
            ref="form"
            @submit.prevent="login"
            v-model="form"
            class="pa-4 pt-6"
          >
            <v-alert
              v-if="errors"
              dense
              outlined
              type="error"
              class="text-capitalize mx-auto"
              style="max-width: 500px"
              >{{ errors }}</v-alert
            >
            <v-text-field
              append-icon="mdi-email"
              v-model="user.email"
              :rules="[rules.email]"
              outlined
              color="deep-purple"
              dense
              label="Email address"
              type="email"
            ></v-text-field>

            <v-text-field
              v-model="user.password"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              @click:append="show2 = !show2"
              :rules="[rules.required, rules.length(6)]"
              outlined
              dense
              color="deep-purple"
              counter="6"
              label="Password"
            ></v-text-field>
            <v-divider class="mt-3"></v-divider>
            <v-card-actions class="mt-2">
              <v-btn
                :disabled="!form"
                :loading="loading"
                class="white--text teal lighten-1"
                type="submit"
                depressed
                block
                >Submit</v-btn
              >
            </v-card-actions>
          </v-form>
          <div class="pt-2 pb-5 text-capitalize">
            <p>
              <router-link to="/signup" class="mr-2"
                >signup new account ?</router-link
              >
              <router-link to="/forgetPassword">forget password ?</router-link>
              <a href="/auth/facebook" class="btn btn-primary"
                ><span class="fa fa-facebook"></span> Facebook</a
              >
            </p>
            <div class="pa-16 pt-6">

            <v-btn @click="siginWithFb" class="mb-3 py-6 text-capitalize  d-flex  justify-space-around" outlined block
              > 
              <v-icon color="primary"  large>mdi-facebook</v-icon>
               <span >log in with Facebook  </span>
              </v-btn
            >
            <v-btn @click="siginWithGoogle" outlined block class="py-6 text-capitalize d-flex   justify-space-around"
              ><v-icon color="red" large>mdi-google</v-icon><span >sign With google  </span></v-btn
            >
             
            </div>
          </div>
        </v-card>
      </div>
    </template>
  </div>
</template>
<script>
import Functions from "../../../server/api";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
export default {
  name: "login",

  data() {
    return {
      user: {
        email: "ammarlee16@gmail.com",
        password: "123123Aa!",
      },
      user2:[
        {
        email: "ammarlee16@gmail.com",
        password: "123123Aa!",
      },
      {
        email: "ammar@gmail.com",
        password: "123123Aa!",
      }

      ],
      show2: false,
      form: false,
      errors: null,
      loading: false,
      loader: null,
      rules: {
        email: (v) => !!(v || "").match(/@/) || "Please enter a valid email",
        length: (len) => (v) =>
          (v || "").length >= len ||
          `Invalid character length, required ${len}`,
        password: (v) =>
          !!(v || "").match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/
          ) ||
          "Password must contain an upper case letter, a numeric character, and a special character",
        required: (v) => !!v || "This field is required",
      },
    };},

  methods: {
    siginWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          

          console.log(token);
          console.log(user);
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(errorCode);
          console.log(errorMessage);
          console.log(email);
          console.log(credential);
          // ...
        });
    },
    siginWithFb() {
      const provider = new FacebookAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = FacebookAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log(token);
          console.log(user);
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = FacebookAuthProvider.credentialFromError(error);
          console.log(errorCode);
          console.log(errorMessage);
          console.log(email);
          console.log(credential);
          // ...
        });
    },
    nav(){
      window.location.replace('https://www.google.com/')
    },
  async  red(){
      try {
                  console.log("click");
                  const res = await Functions.redirect()
                  console.log(res);
                  
                } catch (error) {
                  console.log(error);
                }
    },
    async login() {
      try {
        this.loading = true;
        const currentUser = await Functions.login(this.user);
        this.loading = false;
        if (currentUser.status == "200") {
          let msg = `hello ${currentUser.data.user.name}`;
          this.dialogNotifySuccess(msg);
          
          this.$store.dispatch("setallUserData", currentUser);
          this.$store.dispatch('logInToCometChat',currentUser.data.user);

          this.$router.push("/");
          // this.$router.push("/Vedio");
        }
      } catch (error) {
        this.alertError(error);
        this.errors = error.response.data.error;
      }
    },
  },
};
</script>

<style lang="scss" scoped >
.about {
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>