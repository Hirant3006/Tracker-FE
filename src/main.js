import Vue from 'vue'
import '@fortawesome/fontawesome-pro/css/all.css'
import App from './layouts/App.vue'
import router from './router'
import store from './store'
import './plugins'
import './modules'
import './styles/scss/style.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
