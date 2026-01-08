import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import { pa } from 'element-plus/es/locales.mjs'
import {createRouter, createWebHistory, useRouter} from 'vue-router'

const Login = () => import("../views/Login.vue")
const Layout = () => import("../components/Layout.vue")
const Test = () => import("../views/Test.vue")
const Test2 = () => import("../views/Test2.vue")
const routes = [
  {
    path: '/login',
    name: "Login",
    component: Login,
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children:[{
      path: '/test',
      name: 'Test',
      component: Test,
      children: [{
        path: '/test/:id',
        name: 'Test2',
        component: Test2
      }]
    }
  ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router