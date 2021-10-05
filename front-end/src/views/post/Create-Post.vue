<template>
  <div class="rounded-lg mb-10" id="mainDiv">
    <div class="red"></div>
    <v-list one-line class="rounded-lg">
      <v-list-item>
        <v-row dense justify="start" align="center"> 
          <v-col cols="1">
        <v-list-item-avatar style="cursor: pointer" @click="navigateToProfile">
          <v-img :src="currentUser.img"></v-img>
        </v-list-item-avatar>

          </v-col>
          <v-col cols="8">


       <app-overlay :overlay="overlay" v-if="overlay"></app-overlay>
       <app-create-post v-else mode="create" ></app-create-post>

          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import createPost from "../user/includesComponent/editDialog"

export default {
  components: { "app-create-post":createPost },
  methods: {
        navigateToProfile() {
      this.$router.push("/profile/" + this.user._id);
    },
  },

};
</script>

<style lang="scss" scoped>
#mainDiv {
  box-shadow: 1px 9px 15px 2px rgb(35 26 26 / 50%);
  padding: 15px;
}
#img-box {
  position: relative;
  #img-span {
    position: absolute;
  color: red;
  display:none;
  cursor: pointer;
  left: 0;
  top: 0;

  }
  &:hover #img-span {
  display:inline-block;
  }
}

@media (min-width: 0) and (max-width: 300px) {
  #mainDiv {
    overflow: scroll;
  }
  #theBtn {
    font-size: 1px;
  }
}
@media (min-width: 300px) and (max-width: 850px) {
  #mainDiv {
    overflow: scroll;
  }
  #theBtn {
    font-size: 15px;
  }
}
</style>