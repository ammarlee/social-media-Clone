<template>
  <div>
    <app-cropper src="https://res.cloudinary.com/ammarleejot/image/upload/v1630276233/mevnstack/yvr8drvinz92za0d7oru.jpg"></app-cropper>

  </div>
</template>

<script>
import vueCropper from './ImageCropper'
  export default {
    components: {
      "app-cropper":vueCropper,
    },
    
  }
</script>

<style lang="scss" scoped>

</style>