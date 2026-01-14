<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside :width="isCollapse ? '60px' : '200px'" class="layout-aside">
      <div class="logo">
        <span>{{ !isCollapse ? '后台管理系统' : 'Fiee' }}</span>
      </div>
      <!-- <SimpleScrollbar style="height: calc(100vh - 60px);"> -->
      <el-scrollbar height="calc(100vh - 60px)">
        <el-menu unique-opened="true" default-active="2" class="el-menu-vertical" :collapse="isCollapse"
          :collapse-transition="false" router>
          <template v-for="(item) in menuStore.menuTree">
            <template v-if="item.children.length > 0 && item.isHidden === 0">
              <el-sub-menu :index="item.path">
                <template #title>
                  <el-icon>
                    <i class="iconfont" :class="item.icon"></i>
                  </el-icon>
                  <span>{{ item.name }}</span>
                </template>
                <el-menu-item v-for="(i, index) in item.children.filter(child => child.isHidden === 0)" :index="i.path">
                  <template #title>
                    <el-icon>
                      <i class="iconfont" :class="i.icon"></i>
                    </el-icon>
                    <span>{{ i.name }}</span>
                  </template>
                </el-menu-item>
              </el-sub-menu>
            </template>
            <template v-if="item.children.length == 0 && item.isHidden === 0">
              <el-menu-item :index="item.path">
                <el-icon>
                  <i class="iconfont" :class="item.icon"></i>
                </el-icon>
                <span>{{ item.name }}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
        </el-scrollbar>
    </el-aside>
    <!-- 右侧 -->
    <el-container style="width: 100%;">
      <!-- 顶部 -->
      <el-header class="layout-header">
        <div class="left">
          <el-icon class="collapse-btn" @click="toggle">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
        </div>

        <div class="right">
          <el-tooltip :content="stat.isDark ? '日常模式' : '暗夜模式'" effect="dark" placement="bottom">
            <div class="icon-container">
              <el-icon size="20px" v-if="stat.isDark" @click="changeDark">
                <Sunny />
              </el-icon>
              <el-icon size="20px" v-else @click="changeDark">
                <Moon />
              </el-icon>
            </div>
          </el-tooltip>
          <el-dropdown>
            <span class="user">
              管理员
              <el-icon>
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="logout">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主体 -->
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { ref, computed, reactive } from 'vue';
import { useMenuStore } from '../store/menu';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
// import { SimpleScrollbar } from 'vue-simple-scrollbar'
// import { useRoute, useRouter } from 'vue-router';
export default {
  name: 'Layout',
  setup() {
    const stat = reactive({
      isDark: ''
    })
    const isCollapse = ref(false)
    const menuStore = useMenuStore()
    const toggle = () => {
      isCollapse.value = !isCollapse.value
    }
    // const route = useRoute()
    // const router = useRouter()

    const activeMenu = computed(() => route.path)
    const changeDark = () => {
      stat.isDark = !stat.isDark
      let html = document.documentElement
      html.className = stat.isDark ? 'dark' : ''
    }
    const logout = () => {
      localStorage.removeItem('token')
      router.push('/login')
    }
    return {
      stat,
      isCollapse,
      menuStore,
      toggle,
      logout,
      changeDark,
      activeMenu,
      PerfectScrollbar,
    }
  }
}

</script>

<style scoped>
.layout-container {
  height: 100vh;
}

/* 侧边栏 */
.layout-aside {
  overflow: hidden;
}


.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  /* color: #fff; */
}

/* 顶部 */
.layout-header {
  /* background: #fff; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .right {
    display: flex;
  }
}


.collapse-btn {
  cursor: pointer;
  font-size: 20px;
}

.user {
  cursor: pointer;
}

/* 主体 */
.layout-main {
  background: #f5f7fa;
  padding: 16px;
}

.el-tooltip__trigger {
  padding-right: 6px;
}

.iconfont {
  font-size: 20px;
}
</style>
