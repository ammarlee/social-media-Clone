<template>
     <v-autocomplete
        v-model="model"
        style="max-width:470px ;border-radius: 24px;"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        clearable
        light
        hide-details
        hide-selected
        item-text="description"
        item-value="description"
        label="Search in facebook "
        solo
        dense
      >
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>
              Search in facebook
              <strong>posts</strong>
            </v-list-item-title>
          </v-list-item>
        </template>
        <template v-slot:selection="{ attr, on, item, selected }">
          <v-chip
            v-bind="attr"
            :input-value="selected"
            color="blue-grey"
            class="white--text"
            v-on="on"
          >
            <v-icon left>mdi-bitcoin</v-icon>
            <span v-text="item.description"></span>
          </v-chip>
        </template>
        <template v-slot:item="{ item }">
          <v-list-item-avatar color="indigo" class="headline font-weight-light white--text">
            <v-avatar>
              <v-img :src="item.img[0]"></v-img>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content @click="details(item.objectID)">
            <v-list-item-title v-text="item.description"></v-list-item-title>
            <v-list-item-subtitle v-text="item.userId.name"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-bitcoin</v-icon>
          </v-list-item-action>
        </template>
      </v-autocomplete>
</template>
<script>
import axios from 'axios'
    export default {
        data() {
            return {
            isLoading: false,
            items: [],
            model: null,
            search: null,
            tab: null,
            }
        },
        methods: {
    details(id){
      if (this.$route.name ==='Home') {
        console.log('its the home page ');
          this.$router.push('/singlePost/'+id)
        
      }else{
          this.$router.push('/').then(()=>{
          this.$router.push('/singlePost/'+id)
          })
      }
        }
        },
    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]
        setTimeout(() => (this[l] = false), 3000)
        this.loader = null
      },
      model (val) {
        if (val != null) this.tab = 0
        else this.tab = null
      },
      search (val) {
        // Items have already been loaded
        if (this.isLoading) return
        this.isLoading = true

        // Lazily load input items
        axios.post(`https://facebook-clones.herokuapp.com/searching-post`,{name:val})
          .then(res => {
            this.items = res.data
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      },
    
    },
        
    }
</script>

<style lang="scss" scoped>

</style>