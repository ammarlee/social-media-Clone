<template>
<v-app >
  <template>
    <div class="mt-10">
      <router-link to="/login" tag="div"  class="mx-auto text-center ">
         <v-icon  style="cursor: pointer;font-size: 68px;" >mdi-facebook</v-icon>
        </router-link>
      <v-card
      class="mx-auto mt-3"
      style="max-width: 500px;"
    >
    
    <v-toolbar
      color="deep-purple accent-4"
      cards
      dark
      flat
    >
      <v-card-title class="title  text-h4  text-capitalize white--text font-weight-regular">
        forget Email
      </v-card-title>
    </v-toolbar>
    <v-form
      ref="form"
      @submit.prevent="forgetPw"
      v-model="form"
      class="pa-4 pt-6"
    >
    
     <v-alert v-if="msg"  dense
      outlined
      type="success"
      class="text-capitalize mx-auto"
     style="max-width: 500px;" >
       {{msg}}
      </v-alert>

       <v-alert v-if="errors"  dense
      outlined
      type="error"
      class="text-capitalize mx-auto"
     style="max-width: 500px;" >
     {{errors}}
    </v-alert>

      <v-text-field
        v-model="email"
        :rules="[rules.email]"
        filled
        color="deep-purple"
        label="Email address"
        type="email"
      ></v-text-field>

    <v-divider class="mt-3"></v-divider>
    <v-card-actions class="mt-2">
      <v-btn
        :disabled="!form"
        :loading="loading"
        class="white--text"
        color="deep-purple accent-4"
        depressed
        type="submit"
        block
      >
        Submit
      </v-btn>
    </v-card-actions>
    </v-form>
  </v-card>
      </div>
  </template>
 

</v-app>
</template>
<script>
import Functions from "../../../server/api"
    export default {
    data() {
        return {
            email:null,
            msg:null,
            form: false,
            loading: false,
            loader: null,
            rules: {
              email: v => !!(v || '').match(/@/) || 'Please enter a valid email',
            },
              }
    },
    methods: {
           async forgetPw(){
             this.errors = null
             this.msg = null
               try {
                 this.loading=true
               const res = await Functions.forgetPassword({email:this.email})
               this.msg= res.data.msg
                 this.loading=false
                   
               } catch (error) {
                 this.loading=false
                  this.errors = error.response.data.error
                   
               }
            }
        
    },
        
    }
</script>

<style lang="scss" scoped>

</style>