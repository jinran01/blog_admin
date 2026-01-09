import router from '../router'
import Layout from '../components/Layout.vue'

// 组件自动导入
const modules = import.meta.glob('../views/**/*.vue')


export function addMenusToRouter(menuTree) {
  menuTree.forEach(menu => {
    const route = transformMenuToRoute(menu)
    router.addRoute(route)
  })
}

function transformMenuToRoute(menu) {
  const route = {
    path: menu.path,
    name: menu.name,
    component: menu.component === 'Layout' ? Layout : loadView(menu.component),
    children: []
  }
  if (!menu.parentId && menu.component !== 'Layout') {
    return {
      path: menu.path,
      name: menu.name,
      component: Layout,
      children: [
        {
          path: '',
          name: menu.name+'index',
          component: loadView(menu.component)
        }
      ]
    }
  }
  if (menu.children && menu.children.length > 0) {
    route.children = menu.children.map(child => transformMenuToRoute(child))
  }

  return route
}

function loadView(component) {
  // 比如 "system/user/index" -> "@/views/system/user/index.vue"
  return modules[`../views${component}`]
}