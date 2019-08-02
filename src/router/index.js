import Vue from 'vue'
import Router from 'vue-router'
import login from '../pages/login'
import Home from '../pages/Home'
import addwatch from '../pages/addwatch'
import homepage from '../pages/homepage'
import collectionChannel from '../pages/collectionChannel'
import addtype from '../pages/addtype'
import Addfloor from '../pages/Addfloor'
import fillmap from '../pages/fillmap'
import addgrouping from '../pages/addgrouping'
import addequipment from '../pages/addequipment'
import lookmap from '../pages/lookmap'
import checkequipment from '../pages/checkequipment'
import addinformation from '../pages/addinformation'
import aMap from '../pages/a'


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
      children:[{
        path:'/Home/homepage',
        name:'homepage',
        component:homepage
      },
      {
        path:'/Home/Addwatch',
        name:'Addwatch',
        component:Addwatch,
      },
        {
          path:'/Home/collectionChannel',
          name:'collectionChannel',
          component:collectionChannel
        },
        {
          path: '/addtype',
          name: 'addtype',
          component: addtype
        },
        {
          path: '/Addfloor',
          name: 'Addfloor',
          component: Addfloor
        },
        {
          path: '/fillmap',
          name: 'fillmap',
          component: fillmap
        },
        {
          path: '/addgrouping',
          name: 'addgrouping',
          component: addgrouping
        },
        {
          path: '/addequipment',
          name: 'addequipment',
          component: addequipment
        },
        {
          path: '/lookmap',
          name: 'lookmap',
          component:lookmap
        },
        {
          path: '/checkequipment',
          name: 'checkequipment',
          component:checkequipment
        },
        {
          path: '/aMap',
          name: 'aMap',
          component:aMap
        },
        {
          path:'/addinformation',
          name:'addinformation',
          component:addinformation,
        }
      ]
    },
  ]
})
