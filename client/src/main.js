import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import swal from 'sweetalert'

Vue.config.productionTip = false

Vue.prototype.axios = axios
window.axios = require('axios')
Vue.prototype.BASE_URL = 'http://localhost:3000/api/v1'
Vue.prototype.swal = swal
require('./utils/interceptor')

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
