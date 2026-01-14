import { defineStore } from 'pinia';
import { getMenuTree } from '../network/menu';
import { addMenusToRouter } from '../router/routerUtils';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuTree: [],
    hasLoaded: false
  }),
  actions: {
    async loadMenu() {
      if (this.hasLoaded) return
      const res = await getMenuTree()
      if (res.code === 40001) {
        localStorage.removeItem('Token')
        return;
        // router.push({path:'/login'})
      }
      this.menuTree = res.data 
      this.hasLoaded = true
      addMenusToRouter(this.menuTree)
    }
  }
})