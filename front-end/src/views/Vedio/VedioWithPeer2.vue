<template>
  <div class="text-capitalize">
    <v-row>
      <v-col>
        <h2 class="red--text text-center">vedio chat</h2>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="6" class="text-center">
        <h2>my vedio</h2>
                <video id="video" height="400" width="400"></video>

      </v-col>
       <v-col cols="6" class="text-center">
        <h2>friend vedio</h2>
                <video id="userVideo" height="400" width="400"></video>

      </v-col>
    </v-row>

  </div>
</template>

<script>
import Peer from 'peerjs'
  export default {
    data() {
      return {
        myPeer:null,
      }
    },
    mounted () {
        this.$soketio.on("calluser", data=>{
          console.log('call user',data);
        });


      const myPeer = new Peer(undefined,{
        host:'/',
        port:"8081"
      })
      this.myPeer = myPeer
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
       this.addVideoStream(video,stream)
       let userId ='asfsf'
       this.connectToNewUser(userId,stream)
      //  const video =document.createElement("video")
       myPeer.on('call',call=>{
         call.answer("stream",userVideoStream=>{
       this.addVideoStream(video,userVideoStream)

         })
       })
      });
    


      myPeer.on('open',()=>{
        this.$soketio.emit("joinVedioRoom", this.currentUser._id);

      })
      
    },
    methods: {
      connectToNewUser(userId,stream){
        const call =this.myPeer.call(userId,stream)
        const video = this.userVideoProp()
        call.on('stream',userVideoStream=>{
          this.addVideoStream(video,userVideoStream)
          
        })
        call.on('close',()=>{
          video.remove()
        })

      },
      addVideoStream(video,stream){
        video.srcObject = stream;

      },
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

    },
   
  }
</script>

<style lang="scss" scoped>

</style>