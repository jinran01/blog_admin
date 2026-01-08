import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebarCollapse: false
  }),
  actions: {
    toggleSidebar() {
      this.sidebarCollapse = !this.sidebarCollapse
    }
  }
})