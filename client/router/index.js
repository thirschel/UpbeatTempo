import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import Login from '../views/Login'
import Callback from 'components/Callback'
import SetTeamName from 'views/SetTeamName'
import ConfirmRepositories from 'views/ConfirmRepositories'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/callback',
      name: 'Callback',
      component: Callback
    },
    {
      path: '/setTeamName',
      name: 'SetTeamName',
      component: SetTeamName
    },
    {
      path: '/confirmRepositories',
      name: 'ConfirmRepositories',
      component: ConfirmRepositories
    }
  ]
})
