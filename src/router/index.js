import {createRouter, createWebHistory, useRouter} from 'vue-router'
import { getMenuTree } from '../network/menu'
import { addMenusToRouter } from './routerUtils'
import { useMenuStore } from '../store/menu';
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
    name: 'Root',
    component: Layout,
  }

]
const router = createRouter({
  history: createWebHistory(),
  routes
})
let hasAddedRoutes = false
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('Token')
  if (!token && to.path !== '/login') {
    return next('/login')
  }
  if (token && !hasAddedRoutes) {
    const menuStore = useMenuStore()
    // console.log(menuStore.$state.menuTree);
    await menuStore.loadMenu()
    addMenusToRouter(menuStore.menuTree)
    // const menuTree = await getMenuTree()
    // addMenusToRouter(menuStore.menuTree)
    hasAddedRoutes = true
    return next(to.fullPath) // 确保当前路由生效
  }
  next()
})
export default router