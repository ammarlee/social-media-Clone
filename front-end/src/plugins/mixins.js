
export  default{
  data() {
    return {
      errors: null,
      overlay: false,
      socket: "",
    };
  },
  computed: {
    drawer: {
      get() {
        return this.$store.getters.drawer;
      },
      set(value) {
        this.$store.dispatch("toggleDrawer", value);
      },
    },
    currentUser(){
      return this.$store.getters.getUser
    },
    appId(){
      return this.$store.getters.appId
    },
    apiKey(){
      return this.$store.getters.apiKey
    }
  },
  methods: {
    sweetAlert(icon, msg, time,position) {
      const Toast = this.$swal.mixin({
        toast: true,
        position:position ,
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", this.$swal.stopTimer);
          toast.addEventListener("mouseleave", this.$swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: icon,
        title: msg,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    },
    alertError(error){
      const er = error.response.data.errors;
        this.dialogNotifyError(er)
        this.loading = false;

    },
    sweetAlertwithImage( title, text,imageUrl,imageWidth,imageHeight,position,time) {
      const Toast = this.$swal.mixin({
        toast: true,
        position:position ,
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", this.$swal.stopTimer);
          toast.addEventListener("mouseleave", this.$swal.resumeTimer);
        },
      });

      Toast.fire({
        html:`
        <img src='${imageUrl}'
         style='border-radius: 50%;
        height: ${imageWidth}px;
        width: ${imageHeight}px;
        display: inline-block;'/>
        <p ><b>${title}</b>${text}</p>

        `,
        imageAlt: 'Custom image',
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    },
    playSound(sound) {
      if (sound) {
        var audio = new Audio(sound);
        audio.play();
      }
    },
    dialogNotifySuccess(msg){
      this.$dialog.notify.success(msg, {
        position: 'top-right',
        timeout: 5000
      })
    },
    dialogNotifyError(msg){
      this.$dialog.notify.error(msg, {
        position: 'top-right',
        timeout: 5000
      })
    }

   
  },
  
}