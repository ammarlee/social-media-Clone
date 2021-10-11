import Vue from 'vue';

import axios from 'axios';
import VueAxios from 'vue-axios';

axios.defaults.baseURL = 'http://localhost:3000/';
// axios.defaults.baseURL = "https://facebook-clones.herokuapp.com/"

const findUserToken = function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };
  axios.interceptors.request.use((config) => {
    config.headers["authorization"] = `Bearer ${findUserToken("TokenUser")}`;
    return config;
  });
  
axios.withCredentials= false,
axios.defaults.withCredentials= false,

Vue.use(VueAxios, axios);
export default axios;