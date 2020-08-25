import Vue from 'vue'
// import helper from './helper'
import routerName from '../constants/routers'
import { storeKeyNameSpace } from '../constants/stores'
import prefixClass from '../constants/prefix-cls'

// Vue.prototype.$helper = helper

Vue.prototype.$clone = function(source){
	return JSON.parse(JSON.stringify(source));
}

const EventBus = new Vue()
Vue.prototype.$eventBus = EventBus
Vue.prototype.$prefixClass = prefixClass

Vue.prototype.$routerName = routerName
Vue.prototype.$storeKeyNameSpace = storeKeyNameSpace