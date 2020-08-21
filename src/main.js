import Vue from 'vue'
import App from './layouts/App.vue'
import router from './router'
import store from './store'
import './plugins'
import './modules'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
