<template>
  <div>
    <v-row dense>
      <v-col justify="center" align="center">
        <h3>my id :{{ currentUser._id }}</h3>
        <div v-if="incommingCall">
          <p>from : {{ call.from }} name:{{ call.name }}</p>

          <app-Alert color="red" msg="incomming "></app-Alert>
          <div>
            <v-btn class="green white--text" @click="answerCall">
              <v-icon>mdi-facebook</v-icon>
              accept
            </v-btn>
          </div>
        </div>
        <v-row dense justify="center" align="center">
          <v-col cols="12" class="text-center pa-3 ma-4">
            <h2>vedio</h2>
            <v-row>
              <v-col cols="6" class="text-center" >
                <h2 class="text-red">my vedio</h2>
                <video id="video" height="400" width="400"></video>
              </v-col>
              <v-col cols="6" class="text-center" >
                <h2 class="text-red">user vedio</h2>
                <video id="userVideo" height="400" width="400"></video>
              </v-col>
            </v-row>
            <div class="d-flex justify-space-around">
              <div>
                <v-text-field
                  filled
                  v-model="friend.id"
                  color="deep-purple"
                  dense
                  label="friend.id"
                  type="text"
                ></v-text-field>
                <div>
                  <v-btn class="blue white--text" @click="callUser">
                    <v-icon>mdi-facebook</v-icon>
                    make call
                  </v-btn>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Peer from "simple-peer";

export default {
  data() {
    return {
      incommingCall: false,
      callAccepted: false,
      callEnded: false,
      stream: null,
      st: null,
      call: {},
      friend: {},
      me: "",
      name: "",
      connectionRef: {},
    
      user: {
        name: "ammarlee",
        id: "2312421kr",
      },
    };
  },
  async mounted() {
    this.allowMedia();
    this.$soketio.emit("joinVedioRoom", this.currentUser._id);
    this.$soketio.on("accept", (data) => {
      console.log("accept", data);
    });

    this.$soketio.on("calluser", ({ from, name: callerName, signal }) => {
      console.log("listen to call user socket in mount  ", {
        from,
        name: callerName,
        signal,
      });
      this.incommingCall = true;
      this.call = {
        isReceivingCall: true,
        from,
        name: callerName,
        signal,
      };
    });
  },
  methods: {
    callUser() {
      console.log("start call user");
      let userVideo = this.userVideoProp();

      var peer = new Peer({
        initiator: true,
        trickle: false,
        stream: this.stream,
      });

      peer.on("signal", (data) => {
        console.log("start call user ",data);

        this.$soketio.emit("calluser", {
          userToCall: this.friend.id,
          signalData: data,
          from: this.currentUser._id,
          name: this.currentUser.name,
        });
      });

      peer.on("stream", (currentStream) => {
        console.log('stream work in ',currentStream);
        userVideo.srcObject = currentStream;
      });

      this.$soketio.on("callaccepted", (signal) => {
        console.log(" listen to call accepted in function make call");
         userVideo.srcObject=this.stream
        this.callAccepted = true;
        console.log("signal", signal);
        peer.signal(signal);
      });
      this.connectionRef.current = peer;
    },
    answerCall() {
      this.callAccepted = false;
      let userVideo = this.userVideoProp();

      const peer = new Peer({
        initiator: false,
        trickle: false,
        steam: this.stream,
      });

      peer.on("signal", (data) => {
        this.$soketio.emit("answercall", { signal: data, to: this.call.from });
      });
      peer.on("stream", (currentStream) => {
        userVideo.srcObject = currentStream;
      });

      peer.signal(this.call.signal);
      this.connectionRef.current = peer;
    },

    endCall() {
      this.callEnded = true;
      window.location.reload();
    },
    rejectCall() {},

    videoProp() {
      var video = document.getElementById("video");
      video.setAttribute("playsinline", "");
      video.setAttribute("autoplay", "");
      video.setAttribute("muted", "");
      return video;
    },
    userVideoProp() {
      var video = document.getElementById("userVideo");
      video.setAttribute("playsinline", "");
      video.setAttribute("autoplay", "");
      video.setAttribute("muted", "");
      return video;
    },

    allowMedia() {
      var video = this.videoProp();
      var facingMode = "user";
      var constraints = {
        audio: false,
        video: {
          facingMode: facingMode,
        },
      };
      navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        this.stream = stream;
        video.srcObject = stream;
        console.log("video", video); // html element
        console.log("srcObject", video.srcObject); //data
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>