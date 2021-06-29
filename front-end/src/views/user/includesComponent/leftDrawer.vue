<template>
  <!-- left drawer -->
  <v-navigation-drawer
    temporary
    v-model="drawer"
    style="position: absolute"
    class="white black--text"
    :style="{  'min-height': $screen.height + 'px' }"
    v-if="currentUser"
  >
    <div style="cursor: pointer ;background:#232F3E" @click="profileNavigate">
      <v-list-item-avatar
        style="height: 64px;
                min-width: 40px;
                width: 64px;
                margin: 0 auto;
                display: inline-block;"
        v-if="currentUser"
      >
        <img :src="currentUser.img" alt="name" v-if="currentUser.img" />
      </v-list-item-avatar>
      <v-list-item-group class="text-capitalize d-inline-block text-center white--text">
        <v-list-item-content>
          <v-list-item-title v-if="currentUser" class="font-weight-medium white--text ml-2">
            Hello , {{ currentUser.name }}
            <br />
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item-group>
    </div>
    <v-divider></v-divider>
    <v-list dense>
      <v-row>
        <v-col cols="12" sm="12">
          <v-sheet rounded="lg" max-height="268">
            <app-links></app-links>
          </v-sheet>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <!-- log Out -->
       
      <v-list-item block v-if="currentUser" @click="logout">
        <v-btn text style="width:100% " class="pl-0 ml-3 font-weight-bold text-capitalize d-flex justify-start">
          <v-icon left large class="mr-4">mdi-logout</v-icon>logout
        </v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import Functions from '../../../../server/api';
export default {
  computed: {
    drawer: {
      get() {
        return this.$store.getters.drawer;
      },
      set(value) {
        this.$store.dispatch("toggleDrawer", value);
      },
    },
  },
  methods: {
    profileNavigate() {
      this.$router.push("/profile/" + this.currentUser._id);
    },
   async logout() {
      try {
        await Functions.logout();
        this.$store.dispatch("setUser", null);
        this.$store.dispatch("setAuth", false);
        this.$router.push("/login");
      } catch (error) {
        this.errors = error;
      }
    },

  },
};
</script>

<style lang="scss" scoped>
</style>