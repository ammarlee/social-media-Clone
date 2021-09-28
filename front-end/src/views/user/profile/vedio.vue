 
    <template>
  <div>
    <div id="auth" class="grey pa-14"> 
      <form v-on:submit.prevent="authLoginUser">
        <div class="form-group">
          <v-col>
            <v-text-field
              dense
              outlined
              label="Enter your username"
              v-model="username"
            ></v-text-field>
          </v-col>
        </div>
        <div class="form-group">
            {{this.currentUser._id}}
          <v-btn type="submit" class="blue">
            Login <span v-if="showSpinner" class="fa fa-spin fa-spinner"></span
          ></v-btn>
        </div>
      </form>
    </div>
  </div>
</template>
    
    <script>
import { CometChat } from "@cometchat-pro/chat";
export default {
  data() {
    return {
      username: "superhero1",
      showSpinner: false,
    };
  }, 
  methods: {
    authLoginUser() {
        CometChat.login('superhero4',this.apiKey).then(
          (user) => {
            console.log(user);
            this.showSpinner = false;
          },
          (error) => {
            this.showSpinner = false;
            console.log("Login failed with error:", error.code);
          }
        );
    },
  },
};
</script>