import { defineStore } from 'pinia';
import { getMenuTree } from '../network/menu';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuTree: [],
    hasLoaded: false
  }),
  actions: {
    async loadMenu() {
      if (this.hasLoaded) return
      const res = await getMenuTree()
      this.menuTree = res.data      
      this.hasLoaded = true
    }
  }
})