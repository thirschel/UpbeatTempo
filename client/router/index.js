import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import Callback from '../components/Callback'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/callback',
      name: 'Callback',
      component: Callback
    }
  ]
})
