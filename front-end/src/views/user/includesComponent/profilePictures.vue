<template>
  <div class="text-center">

    <app-overlay :overlay="overlay" v-if="overlay"></app-overlay>

    <div v-else>

      <div v-if="user && user.pics">
        <v-row v-if="user.pics.length > 0">
          <v-col v-for="(pic,i) in user.pics" 
          :key="i" 
          class="d-flex child-flex" cols="4">

            <v-img
            @class="index=i"
              :src="pic"
              :lazy-src="pic"
              aspect-ratio="1"
              class="grey lighten-2 image"
              @click="index = i"
              :style="{ backgroundImage: 'url(' + pic + ')',cursor:'pointer' }"
            >
       

              <template ate v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
                 <CoolLightBox
                :items="items"
                :fullScreen="true"
                :index="index"
                @close="index = null"
              ></CoolLightBox>
        </v-row>


      </div>
      <div v-else>
       <app-Alert color="red" msg="there is no pictures avalible"></app-Alert>
      </div>
    </div>
  </div>
</template>

<script>
import Functions from "../../../../server/api";
export default {
  name: "picturesComponetent",
  props: ["userId"],
  data() {
    return {
      user:null,
      index: null,
       items: null,
    };
  },
  async mounted() {
    try {
      this.overlay = true;
      let {data} = await Functions.getCurrentUser(this.userId);
      this.user = data.user;
      this.items =data.user.pics
      this.overlay = false;
    } catch (error) {
      this.overlay = false;
      this.errors = error;
    }
  },
};
</script>

<style lang="scss" scoped>
</style>