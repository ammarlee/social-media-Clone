<template >
  <div class>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card v-if="!overlay">
      <!-- dettails user in top of the conversation -->
      <div>
        <v-list one-line class="theListDiv grey lighten-5 pt-0 pb-0">
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="theAnotherUser2.img"></v-img>
            </v-list-item-avatar>
            <v-list-item-content class="pt-0">
              <v-list-item-subtitle class="text-h6 black--text font-weight-bold text-capitalize">
                {{theAnotherUser2.name}}
                <v-btn @click="hideMsg" style=" position: absolute;right: 4px;top: 8px;" small icon>
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
      <!--  end dettails user in top of the conversation -->

      <!-- the masswges -->
      <div
        style=" overflow-y: scroll; max-height:220px; min-height:219px"
        id="theCard"
        class="mx-auto"
      >
        <div class="demo-content">
          <div>
        <v-list three-line class=" d-flex justify-center ml-auto pt-0 pb-0">
          
            <div class="">
            <v-list-item-avatar size="150"  class="ml-10">
              <v-img :src="theAnotherUser2.img"></v-img>
            </v-list-item-avatar>
            <!-- <v-list-item-content class="pt-0 d-block"> -->
              <v-list-item-subtitle class="text-h4 black--text text-center font-weight-bold text-capitalize">
                {{theAnotherUser2.name}}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-caption cyan--text text-center font-weight-bold text-capitalize">
                {{theAnotherUser2.bio}}
              </v-list-item-subtitle>
            </div>
     
        </v-list>
      </div>
          <div
            v-for="item in items"
            :key="item._id"
            style=" max-height:520px; min-height:40px"
            class="theMainOne"
          >
            <v-list
              three-line
              class="theListDiv pt-0 pb-0"
              style=" max-height:520px; min-height:40px"
            >
              <v-list-item :key="item.sender.name">
                <v-list-item-avatar size="35" class="mr-2 mt-5">
                  <v-img :src="item.sender.img"></v-img>
                </v-list-item-avatar>

                <v-list-item-content
                  class="px-1 py-0 mb-1"
                  :title="new Date(+item.timeStamp).getHours() + ':'+ new Date(+item.timeStamp).getMinutes()"
                >
                  <v-textarea
                    auto-grow
                    readonly 
                    :background-color="item.sender._id !==user._id? 'light-blue ':'white'"
                    :color="item.sender._id !==user._id? 'white ':'black'"
                    hide-details
                    class="pink"
                    rows="1"
                    solo
                    row-height="15"
                    :value="item.content"
                  ></v-textarea>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </div>
      <!-- input to send messages -->
      <div class="theInput mt-3 pa-3  mb-0">
        <app-emoji v-model="messsage" :sendMessage="sendMessage"></app-emoji>
      </div>
    </v-card>
  </div>
</template>

<script>
import Functions from "../../../server/api";

import emojiPickerVue from '../post/emojiPicker.vue';

export default {
  name: "messageroom",
  props: ["chatIdfromanother"],
  components:{
    'app-emoji':emojiPickerVue
  },

  data() {
    return {
      // chatId: this.chatIdfromanother ||this.$route.params.id,
      items: [],
      messsage: "",
      allmsgs: [],
      theAnotherUser: "",
      theAnotherUser2: "",
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    anotherFriendId() {
      return this.$store.getters.getFriendId;
    },
    users() {
      return this.$store.getters.users;
    },
    chatId() {
      return this.chatIdfromanother
        ? this.chatIdfromanother
        : this.$route.params.id;
    },
  },
  methods: {
    hideMsg() {
      this.$store.commit("hideMsg", false);
    },
    async sendMessage() {
      try {
        const messageData = {
          content: this.messsage,
          chatId: this.chatId,
          sender: {
            _id: this.user._id,
            name: this.user.name,
            img: this.user.img,
            email: this.user.email,
          },
          friendId: this.theAnotherUser || this.anotherFriendId,
          timeStamp: Date.now(),
        };
        this.socket.emit("joinnotificationsRoom", this.$store.getters.getUser);
        this.socket.emit("sendMessage", messageData);
        let pushMsgtoMineStore = {
          content: this.messsage,
          chatId: this.chatId,
          senderId: this.user._id,
          senderImg: this.theAnotherUser2.img,
          senderName: this.theAnotherUser2.name,
          date: Date.now(),
        };
        this.$store.commit("pushNewMessage", pushMsgtoMineStore);
        this.items.push(messageData);
        this.messsage = "";
        this.showLastMsg();
      } catch (error) {
        this.errors=error
      }
    },
  
    playSound(sound) {
      if (sound) {
        var audio = new Audio(sound);
        audio.play();
      }
    },
    showLastMsg() {
      let box = document.getElementById("theCard");
      let sd = box.scrollHeight + 30;
      box.scrollTop = sd;
    },
  },
  watch: {
    chatIdfromanother() {
      Functions.getMessage(this.chatId).then((res) => {
        this.items = res.data.chat;
      });
    },
  },
  updated() {
    this.showLastMsg();
  },
  async mounted() {
    try {
      this.overlay = true;
      const res = await Functions.getMessage(this.chatId);
      const addTOArr = Object.values(res.data.ChatDetails.users);
      this.items = res.data.chat;
      this.theAnotherUser = addTOArr.find((i) => {
        return i !== this.user._id;
      });

      this.theAnotherUser2 = this.users.find((i) => {
        return i._id == this.theAnotherUser;
      });

      this.overlay = false;
     this.socket = this.$soketio;
      this.socket.emit("JoinChat", this.chatId);
      this.socket.on("newMessage", (data) => {
        this.playSound(
          "http://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3"
        );
        let edittheMsg = {
          chatId: data.chatId,
          timeStamp: Date.now(),
          sender: data.sender,
          content: data.content,
        };
        let pushMsg = {
          chatId: data.chatId,
          content: data.content,
          senderImg: data.sender.img,
          senderName: data.sender.name,
          senderId: data.sender._id,
          date: Date.now(),
        };
        this.$store.commit("pushNewMessage", pushMsg);
        this.items.push(edittheMsg);
        this.showLastMsg();
      });
      this.socket.on("newMsgFromUrFriend", (data) => {
        this.playSound(
          "http://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3"
        );
        let pushMsg = {
          chatId: data.chatId,
          content: data.content,
          senderImg: data.sender.img,
          senderName: data.sender.name,
          senderId: data.sender._id,
          date: Date.now(),
        };
        this.items.push(data);
        this.$store.commit("pushNewMessage", pushMsg);
      });
    } catch (error) {
      this.errors = error;
      this.overlay = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.theFirstClass {
  background: #e0e0e0;
  color: black !important;
}
.theSecondClass {
  background: #00bcd4;
  color: white !important;
}
</style>