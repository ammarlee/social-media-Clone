<template>
    <div v-if="user">
    <template>
      <div>
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
        reset password
      </v-card-title>
    </v-toolbar>
    <v-form
      ref="form"
      @submit.prevent="changePw"
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
     <v-alert v-if="errors"
      dense
      outlined
      type="error"
      class="text-capitalize mx-auto"
     style="max-width: 500px;"

    >
     {{errors}}
    </v-alert>

      <v-text-field
        v-model="user.email"
        disabled
        filled
        color="deep-purple"
        label="Email address"
        type="email"
      ></v-text-field>
    
      <v-text-field
        v-model="password"
        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show2 ? 'text' : 'password'"
        @click:append="show2 = !show2"
        :rules="[rules.password, rules.length(6)]"
        filled
        color="deep-purple"
        counter="6"
        label="Password"
        style="min-height: 96px"
      >
      </v-text-field>
      <v-text-field
        v-model="secPassword"
        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show2 ? 'text' : 'password'"
        @click:append="show2 = !show2"
        :rules="[rules.password, rules.length(6)]"
        filled
        color="deep-purple"
        counter="6"
        label="re-password"
        style="min-height: 96px"
      >
      </v-text-field>
    <v-divider class="mt-3"></v-divider>
    <v-card-actions class="mt-2">
      <v-btn
        :disabled="!compare &&!form"
        :loading="isLoading"
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
    </template>>
    </div>
    <div v-else  class="text-center mt-16 ">
      <h2 class="text-capitalize pink--text mb-3">404 page Not found go to home page </h2>
      <v-btn icon to="/login" >
      <v-icon large>mdi-home</v-icon>

      </v-btn>
    </div>
</template>

<script>
import Functions from "../../../server/api"

    export default {

      data() {
        return {
          token:this.$route.params.token,
          user:null,
          password:null,
          secPassword:null,
          isLoading:false,
          form:false,
          errors:null,
          show2: false,
          msg:null,
          rules: {
              email: v => !!(v || '').match(/@/) || 'Please enter a valid email',
              length: len => v => (v || '').length >= len || `Invalid character length, required ${len}`,
              password: v => !!(v || '').match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/) ||
                'Password must contain an upper case letter, a numeric character, and a special character',
              required: v => !!v || 'This field is required',
            },

        }
      },
      methods: {
      async  changePw(){
        try {
          this.loading=true
          const res = await Functions.resetPassword(
            {user:this.user,token:this.token,password:this.password,secPassword:this.secPassword})
           
          this.msg = res.data.msg
          this.loading=false
          setTimeout( () => this.$router.push({ path: '/login'}), 5000);
        } catch (error) {
          this.loading=false
          this.errors=error.response.data.err
          
        }
        },
        
      },
      computed:{
        compare(){
            if (this.password ==this.secPassword) {
              return true
            }
            return false
  
        },
      },
      async mounted() {
        try {
          const res = await Functions.getuserToken(this.$route.params.token)
          this.user = res.data.user
          
        } catch (error) {
          console.log(error.response.data);
          this.errors = error
          
        }
      },
        
    }
</script>

<style lang="scss" scoped>

</style>