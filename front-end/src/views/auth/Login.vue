<template>
  <div class="text-center pt-15 pb-15">
    <template>
      <div>
        <router-link to="/" tag="span">
          <v-icon style="cursor: pointer;font-size: 68px;">mdi-facebook</v-icon>
        </router-link>
        <v-card class="mx-auto" style="max-width: 500px;">
          <v-toolbar class="teal mt-4 lighten-1" cards dark flat>
            <v-card-title class="title text-h4 text-capitalize white--text font-weight-regular">
              <h5>log in</h5>
            </v-card-title>
          </v-toolbar>
          <v-form ref="form" @submit.prevent="login" v-model="form" class="pa-4 pt-6">
            <v-alert
              v-if="errors"
              dense
              outlined
              type="error"
              class="text-capitalize mx-auto"
              style="max-width: 500px;"
            >{{errors}}</v-alert>
            <v-text-field
              v-model="user.email"
              :rules="[rules.email]"
              filled
              color="deep-purple"
              label="Email address"
              type="email"
            ></v-text-field>

            <v-text-field
              v-model="user.password"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              @click:append="show2 = !show2"
              :rules="[rules.required, rules.length(6)]"
              filled
              color="deep-purple"
              counter="6"
              label="Password"
              style="min-height: 96px"
            ></v-text-field>
            <v-divider class="mt-3"></v-divider>
            <v-card-actions class="mt-2">
              <v-btn
                :disabled="!form"
                :loading="loading"
                class="white--text teal lighten-1"
                depressed
                type="submit"
                block
              >Submit</v-btn>
            </v-card-actions>
          </v-form>
          <div class="pt-2 pb-5 text-capitalize">
            <p>
              <router-link to="/signup" class="mr-2">signup new account ?</router-link>
              <router-link to="/forgetPassword">forget password ?</router-link>
            </p>
          </div>
        </v-card>
      </div>
    </template>
  </div>
</template>
<script>
import Functions from "../../../server/api";

export default {
  name: "login",
 
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
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
    };
  },

  methods: {
    async login() {
      try {
        this.loading = true;
        const currentUser = await Functions.login(this.user);
        this.loading = false;
        if (currentUser.status =="200") {
          this.sweetAlert(
            "success",
            `hello ${currentUser.data.user.name}`,
            2000,
            "top"
          );
          this.$store.dispatch("setallUserData", currentUser);
          this.$router.push("/");
        }
      } catch (error) {
        const er = error.response.data.errors;
        this.loading = false;
        this.errors = error.response.data.error;
        this.sweetAlert("error", er, 4000, "top");
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