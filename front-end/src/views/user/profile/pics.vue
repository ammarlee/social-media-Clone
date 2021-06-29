<template>
 <div>
   <app-user-pictures :userId="this.$route.params.id"></app-user-pictures>
   
 </div>
</template>

<script>
import profilePicturesVue from '../includesComponent/profilePictures.vue';
export default {
  name:'friendPictures',
  components:{
    "app-user-pictures":profilePicturesVue
  },
  
 
};
</script>

<style lang="scss" scoped>
</style>