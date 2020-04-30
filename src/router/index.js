import Vue from 'vue'
import Router from 'vue-router'
import login from '../pages/login'
import Home from '../pages/Home'
import Addwatch from '../pages/Addwatch'
import abnormal from '../pages/abnormal'
import Regularlysend from '../pages/Regularlysend'
import Servicecontract from '../pages/Servicecontract'
import selectedcard from '../pages/selectedcard'
import phonenumber from '../pages/phonenumber'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      children:[
        {
          path:'/Addwatch',
          name:'Addwatch',
          component:Addwatch
        },
        {
         path:'/Servicecontract',
         name:'Servicecontract',
         component:Servicecontract
        },
        {
          path: '/abnormal',
          name: 'abnormal',
          component: abnormal
        },
        {
          path: '/Regularlysend',
          name: 'Regularlysend',
          component:Regularlysend
        },
        {
          path: '/selectedcard',
          name: 'selectedcard',
          component:selectedcard
        },
        {
          path: '/phonenumber',
          name: 'phonenumber',
          component:phonenumber
        }
      ]
    },
  ]
})
