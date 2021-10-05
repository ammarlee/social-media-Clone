<template>
  <div>
  <main class="text-center">
         <h1>MediaCapture, MediaRecorder and Streams API</h1>
        
        <p><v-btn class=" white--text green mr-3" id="btnStart">START RECORDING</v-btn>
        <v-btn class=" white--text red" id="btnStop">STOP RECORDING</v-btn></p>
        <v-btn class=" white--text yellow" id="redirect">redirect </v-btn>
        
        <video controls></video>
        
        <video id="vid2" controls></video>
        
        <!-- could save to canvas and do image manipulation and saving too -->
    </main>    
  </div>
</template>

<script>
import Functions from '../../../server/api';
  export default {
    mounted () {
        let constraintObj = { 
            audio: false, 
            video: { 
                facingMode: "user", 
                width: { min: 640, ideal: 1280, max: 1920 },
                height: { min: 480, ideal: 720, max: 1080 } 
            } 
        }; 
        // width: 1280, height: 720  -- preference only
        // facingMode: {exact: "user"}
        // facingMode: "environment"
 
        navigator.mediaDevices.getUserMedia(constraintObj)
        .then(function(mediaStreamObj) {
            //connect the media stream to the first video element
            let video = document.querySelector('video');
                video.srcObject = mediaStreamObj;
           
            video.onloadedmetadata = function() {
                //show in the video element what is being captured by the webcam
                video.play();
            };
            
            //add listeners for saving video/audio
            let start = document.getElementById('btnStart');
            let stop = document.getElementById('btnStop');
            let redirect =document.getElementById('redirect');
            let vidSave = document.getElementById('vid2');
            let mediaRecorder = new MediaRecorder(mediaStreamObj);
            let chunks = [];
            
            start.addEventListener('click', ()=>{
                mediaRecorder.start();
                console.log(mediaRecorder.state);
            })
            stop.addEventListener('click', ()=>{
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
            });
            
            mediaRecorder.ondataavailable = function(ev) {
                chunks.push(ev.data);
            }
            redirect.addEventListener('click', async()=>{
              try {
                  console.log("click");
                  const res = await Functions.redirect()
                  console.log(res);
                  
                } catch (error) {
                  console.log(error);
                }
            });
            mediaRecorder.onstop = ()=>{
                let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
                chunks = [];
                let videoURL = window.URL.createObjectURL(blob);
                
                vidSave.src = videoURL;
            }
        })
        .catch(function(err) { 
            console.log(err.name, err.message); 
        });
    },
    
  }
</script>


<style lang="scss" scoped>

</style>