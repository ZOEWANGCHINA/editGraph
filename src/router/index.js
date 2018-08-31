import Vue from 'vue'
import Router from 'vue-router'
import antv from '@/components/antv'
import edit from '@/components/edit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'antv',
      component: edit
    },
    // {
    //   path: '/editer',
    //   name: 'editer',
    //   component: edit
    // }
  ]
})
