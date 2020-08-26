import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { store , app } from '@/main.js'
import routerName from '@/constants/routers'
import { types as typesAuth } from '@/modules/auth/constant'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to) {
    if (to.hash) {
      return window.scrollTo({ top: document.querySelector(to.hash).offsetTop, behavior: 'smooth' });
    }
    return window.scrollTo({ top: 0, behavior: 'smooth' });
  }
})

router.beforeEach(async (to, from, next) => {
  
  if (to.meta.middleware) {
    const middleware = to.meta.middleware
    const context = { next, from, to, router, store, app };
    var preventNext = false
    for (let i = 0; i < middleware.length; i++) {
      const result = await middleware[i](context);
      if (!result) {
        preventNext = true
        break
      }
    }
    if (preventNext) {
      return;
    }
  }

  return next(store.commit('setRouterLoading', false))
});

export default router
