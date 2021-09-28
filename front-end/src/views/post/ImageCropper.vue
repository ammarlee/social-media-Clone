<template>
  <div>
    <img  ref="image" :src="src" >
    <v-btn red @click="clickit">vlick</v-btn>
  </div>
</template>

<script>
    import Cropper from 'cropperjs';
  export default {
    name:"imgCropper",
    props:['src'],
    data() {
      return {
        cropper: {},
        destination:{},
        image:{}
      }
    },
      mounted () {
   
      },
      methods: {
          clickit() {
                 this.image =this.$refs.image
      this.cropper =new Cropper(this.image, {
          aspectRatio: 1,
        minCropBoxWidth: 256,
        minCropBoxHeight: 256,
        viewMode: 3,
        dragMode: 'move',
        background: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
      })
          }
      },


  }
</script>

<style lang="scss" scoped>
.cropper-canvas {
  cursor: crosshair;
  background-color: #fff;
  opacity: 0; /* that's the problem */
  filter: alpha(opacity=0);
}
</style>