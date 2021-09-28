<template>
  <div class="text-center pt-15 pb-15 info--text">
    <router-link to="/login" tag="span">
      <v-icon style="cursor: pointer;font-size: 68px;">mdi-facebook</v-icon>
    </router-link>
    <v-card class="mx-auto mt-4" max-width="500">
      <v-card-title class="title font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
        <v-avatar color="primary lighten-2" class="subheading white--text" size="24" v-text="step"></v-avatar>
      </v-card-title>
      <v-form ref="form" v-model="form" class="pa-4 pt-6">
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <v-text-field label="Name" v-model="user.name" color="deep-purple" type="text"></v-text-field>
              <v-text-field
                label="Email"
                :rules="[rules.email]"
                type="email"
                color="deep-purple"
                v-model="user.email"
              ></v-text-field>

              <span class="caption text-capitalize grey--text text--darken-1">
                have an account?
                <router-link tag="a" to="/login">login</router-link>
              </span>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text>
              <v-text-field label="phone" type="number" color="deep-purple" v-model="user.phone"></v-text-field>
              <v-textarea v-model="user.bio" auto-grow color="deep-purple" label="Bio" rows="1"></v-textarea>

              <span class="caption grey--text text--darken-1">Please your information</span>
            </v-card-text>
          </v-window-item>
          <v-window-item :value="3">
            <v-card-text>
              <v-text-field
                label="Password"
                type="password"
                :rules="[rules.password, rules.length(8)]"
                v-model="user.password"
              ></v-text-field>

              <span
                class="caption grey--text text--darken-1"
              >Please enter a password for your account</span>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-form>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn :disabled="step === 1" text @click="step--">Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn :disabled="step === 3" color="primary" depressed v-if="step <3" @click="step++">Next</v-btn>
        <v-btn
          v-else
          :disabled="!form"
          :loading="isLoading"
          type="submit"
          @click="addNewUser"
          depressed
          class="green"
        >signup</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import Functions from "../../../server/api";
import axios from 'axios'
export default {
  data() {
    return {
      step: 1,
      id: null,
      pass: null,
      cpass: null,
      user: {
        name: "",
        email: "a@a.gmail.com",
        password: "123123Aa!",
        confirmPassword: "",
        phone: undefined,
        bio: "Far far away, ",
      },
      select: null,
      loading: false,
      items: [],
      errors: null,
      search: null,
      radios: null,
      date: null,
      menu: false,
      agreement: false,
      dialog: false,
      form: false,
      isLoading: false,
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
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Sign-up";
        case 2:
          return "Please your information";
        default:
          return "Create a password ";
      }
    },
  },

  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    async addNewUser() {
      try {
        this.isLoading = true;
        let currentUser = await Functions.signup({ ...this.user });
        this.isLoading = false;
        if (currentUser.status == "200") {
          let msg =`hello ${currentUser.data.user.name}`

           const url = "https://api-us.cometchat.io/v2.0/users";
      axios
        .post(
          url,
          { uid:currentUser.data.user._id, name:currentUser.data.user.name},
          {
            headers: { 
              Accept: "application/json",
              "Content-Type": "application/json",
              appId: this.appId,
              apiKey: this.apiKey,
            },
          }
        )
        .then((user) => {
          console.log(user);
        });
          this.dialogNotifySuccess(msg)
          this.$store.dispatch("setallUserData", currentUser);
          this.$router.push("/");
        }
      } catch (error) {
        this.alertError(error)
        this.isLoading = false;
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="scss"  scoped>
</style>