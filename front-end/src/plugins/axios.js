import Vue from 'vue';

import axios from 'axios';
import VueAxios from 'vue-axios';

axios.defaults.baseURL = 'http://localhost:3000/';
// axios.defaults.baseURL = "https://facebook-clones.herokuapp.com/"


axios.withCredentials= false,
axios.defaults.withCredentials= false,

Vue.use(VueAxios, axios);
export default axios;