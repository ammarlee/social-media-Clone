<template>
  <v-tabs
    fixed-tabs
    next-icon="mdi-arrow-right-bold-box-outline"
    prev-icon="mdi-arrow-left-bold-box-outline"
    show-arrows
    center-active
    background-color="orange accent-1"
    color="black"
    class="rounded-lg"
    light
  >
    <v-tab v-for="(tab,i) in tabs " :key="i" class="pa-0">
      <div class="therouter px-0">
        <router-link
          tag="div"
          class="therouter d-flex align-center justify-center"
          :to="header+tab.id+tab.pageName"
        >{{tab.name}}</router-link>
      </div>
    </v-tab>
  </v-tabs>
</template>

<script>
export default {
    props:['tabs','header'],
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.therouter {
  width: 100%;
  height: 100%;
  text-transform: capitalize;
  font-weight: bold;
}
</style>