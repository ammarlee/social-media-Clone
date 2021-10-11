import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const state = {
    
}
const getters = {
    

}
const mutations = {
    initFirebase(){
        const firebaseConfig = {
          apiKey: "AIzaSyAcM4BaMHnI9tXykVvh2JskcqSOBqkwgo4",
          authDomain: "arched-envelope-295913.firebaseapp.com",
          databaseURL: "https://arched-envelope-295913-default-rtdb.firebaseio.com",
          projectId: "arched-envelope-295913",
          storageBucket: "arched-envelope-295913.appspot.com",
          messagingSenderId: "380257225863",
          appId: "1:380257225863:web:b1c934531b1d3d6b30fc22",
          measurementId: "G-PEJV9Z3P5Z",
        };
    
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        getAnalytics(app);
       
    }
    
}
const actions = {
    
}
export default {
    state,
    getters,
    mutations,
    actions
}