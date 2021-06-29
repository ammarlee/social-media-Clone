<template>
    <div>
 <v-list v-if="recent.length >0">
      <v-list-item v-for="chat in recent" :key="chat.title">
        <v-list-item-avatar>
          <v-img :alt="`${chat.friendImg} avatar`" :src="chat.friendImg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="chat.friendName"></v-list-item-title>
        </v-list-item-content>

        <v-btn :to="'massageTest/'+chat.chatId" icon>
          <v-icon color="deep-purple accent-4'">mdi-message-outline</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
    <div v-else>
      <h4>there is no online users</h4>
    </div>
    <!--  -->
    
    <!-- <v-container>
      <v-card class="mx-auto" max-width="500">
        <v-toolbar color="deep-purple accent-4" dark>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
          <v-toolbar-title>New Chat</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list subheader>
          <v-subheader>Recent online</v-subheader>

          <v-list-item v-for="chat in recent" :key="chat.title">
            <v-list-item-avatar>
              <v-img :alt="`${chat.friendImg} avatar`" :src="chat.friendImg"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="chat.friendName"></v-list-item-title>
            </v-list-item-content>

            <v-btn :to="'massageTest/'+chat.chatId" icon>
              <v-icon color="deep-purple accent-4'">mdi-message-outline</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>-->
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>

</style>