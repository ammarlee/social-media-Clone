<template>
    <div>
     <v-footer padless class="d-block">
    <v-card
      flat
      tile
       style="background:#232F3E"
      class=" white--text text-center"
    >
      <v-card-text>
        <v-btn
          v-for="icon in icons"
          :key="icon.id"
          class="mx-4 white--text "
          icon
          large
         

        >
            <a  class="text-decoration-none white--text" 
            :href="icon.link">
          <v-icon size="24px"  :class="icon.color" >
            {{ icon.name }}
          </v-icon>
            </a>
        </v-btn>
      </v-card-text>

      <v-card-text class="white--text pt-0">
        Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo interdum. Praesent ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim 
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong class="text-capitalize">ammarLee</strong>
      </v-card-text>
    </v-card>
  </v-footer>

    </div>
</template>

<script>
    export default {
        name:'footerPage',
    data: () => ({
      icons: [
          {id:'356131584',name:'mdi-facebook' ,link:'https://www.instagram.com/ammar200811/', color: 'indigo--text',},
          {id:'352615584',name:'mdi-twitter' ,link:'https://www.instagram.com/ammar200811/', color: 'info--text'},
          {id:'356415584',name:'mdi-linkedin' ,link:'https://www.instagram.com/,ammar200811/',color: 'cyan--text darken-1',},
          {id:'35161584',name:'mdi-instagram' ,link:'https://www.instagram.com/ammar200811/', color: 'red--text lighten-3',},
       
      ],
    }),
        
    }
</script>

<style lang="scss" scoped>

</style>