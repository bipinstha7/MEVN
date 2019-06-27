import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.axios = axios
Vue.prototype.BASE_URL = 'http://localhost:3000/api/v1'

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
