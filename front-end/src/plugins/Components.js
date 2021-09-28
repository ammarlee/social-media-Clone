import Vue from "vue";

import links from '../views/user/includesComponent/Navbar-Links.vue'
import leftDrawer from '../views/user/includesComponent/leftDrawer.vue'
import rightDrawer from '../views/user/includesComponent/rightDrawer.vue'
import OverLay from '../views/user/includesComponent/OverLay'
import Alert from '../views/user/includesComponent/Alert'



Vue.component('app-links', links)
Vue.component('app-left-drawer', leftDrawer)
Vue.component('app-right-drawer', rightDrawer)
Vue.component('app-overlay', OverLay)
Vue.component('app-Alert', Alert)
