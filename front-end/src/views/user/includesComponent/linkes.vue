<template>
    <div>
         <!-- second link for users -->
                <router-link to="/all-users" tag="div" style="cursor: pointer">
                  <v-list  class="text-capitalize font-weight-bold pt-0 pb-0">
                    <template>
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon large>mdi-account-multiple-outline</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>users</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list>
                </router-link>
                <!-- thired link to friends requests -->
                <router-link to="/friends-request" tag="div" style="cursor: pointer">
                  <v-list class="text-capitalize font-weight-bold">
                    <template>
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon large>mdi-account-clock-outline</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>requests</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list>
                </router-link>


          <router-link :to="'/profile/'+currentUser._id +'/profileFriends'" tag="div" style="cursor: pointer">
                  <v-list class="text-capitalize font-weight-bold">
                    <template>
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon large>mdi-account-group-outline</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>friends</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list>
                </router-link>
                   <!-- forth  link to friends saved posts -->
                <router-link :to="'/saved-posts/'+ user._id " tag="div" style="cursor: pointer">
                  <v-list class="text-capitalize font-weight-bold">
                    <template>
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon large>mdi-heart</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>saved posts</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list>
                </router-link>
    </div>
</template>

<script>
    export default {
        computed:{
            user(){
                return this.$store.getters.getUser
            }
        },
        
    }
</script>

<style lang="scss" scoped>

</style>