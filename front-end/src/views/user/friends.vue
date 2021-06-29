<template>
    <v-app>
        <h3>friends</h3>
        <v-container>
            <div class="text-capitalize">
                <div class="nav-bar ">
                    <p class="text-h3">friends</p>
                    <!-- <v-text-field textarea="search for friends">

                    </v-text-field> -->
                </div>
                <div class="friends">
                    <v-row>
                        <v-col cols='12' sm="6" md="6"  v-for="friend in friendsList" :key="friend.id">
                            <div class="d-flex align-self-end" @click="navegatetoprofile(friend.id)" 
                            style="ursor: pointer">
                                <div class="friend-img">
                                    <v-avatar>
                                        <v-img :src="friend.img"></v-img>
                                    </v-avatar>
                                </div>
                                <div class="img-details ml-2">
                                    <h4>{{friend.name}}</h4>

                                </div>
                            </div>

                        </v-col>

                    </v-row>
                </div>
            </div>
        </v-container>


    </v-app>
</template>

<script>
import Functions from '../../../server/api';
    export default {
       async mounted() {
           try {
               const res=await  Functions.getFriends(this.$store.getters.getUser._id)
               this.friendsList = res.data.friends
           } catch (error) {
               console.log(error);
           }
            
        },
        methods: {
            navegatetoprofile(friendId){
                this.$router.push('/FriendProfile/'+friendId)

            }
        },
        data() {
            return {
                friendsList:''
            }
        },
        
    }
</script>

<style lang="scss" scoped>

</style>