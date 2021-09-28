<template>
     <v-row>
          <v-col cols="12">
            <v-alert :color="color" class="text-capitalize font-weight-bold" outlined type="info">
                {{msg}}
                
                </v-alert>
          </v-col>
        </v-row>
</template>

<script>
    export default {
        props: ['msg','color']
        
    }
</script>

<style lang="scss" scoped>

</style>