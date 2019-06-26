import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login'
import Register from './views/Register'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
  ],
})

const jwtAuthToken = localStorage.getItem('jwtToken')

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    // if (!auth.loggedIn()) {
    if (!jwtAuthToken) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
