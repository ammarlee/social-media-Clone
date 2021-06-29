<template>
  <v-navigation-drawer
    temporary
    right
    width="200"
    v-model="rightDrawer"
    style="position: absolute"
    class="white text-capitalize black--text"
  >
    <h4 class="pa-4  ">online friends</h4>
    <div class="text-center">
      <div class="mb-2">
            <app-massage></app-massage>
      </div>
    </div>
  </v-navigation-drawer>
</template>
<script>
import phoneMessage from '../../massage/phoneMessage'

export default {
  name: "Home",
  components: {
    "app-massage": phoneMessage,
  },
  computed: {
    rightDrawer: {
      get() {
        return this.$store.getters.rightDrawer;
      },
      set(value) {
        this.$store.dispatch("toggleRightDrawer", value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
</style>