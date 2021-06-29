<template>
  <v-app>
    <v-container>
      <div style="min-height:200px" class="mt-3">
        <app-one :post="post[0]" heights="450" ></app-one>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import one from "./one";

export default {
  name: "three",
   
  data(){
    return{
       items: [
        'https://cdn.vuetifyjs.com/images/cards/cooking.png',
        'https://cdn.vuetifyjs.com/images/cards/cooking.png',
      ],
      index: null
    }
  },
  components: {
    "app-one": one,
  },
  computed: {
    post() {
      return this.$store.getters.posts.filter((p) => {
        return p._id == this.$route.params.id;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>