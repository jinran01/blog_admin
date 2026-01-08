<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside :width="isCollapse ? '60px' : '200px'" class="layout-aside">
      <div class="logo">
        <span>{{ !isCollapse ? '后台管理系统' : 'Fiee' }}</span>
      </div>
      <el-menu default-active="2" class="el-menu-vertical" :collapse="isCollapse" :collapse-transition="false" router>
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <location />
            </el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item index="/test">item one</el-menu-item>
          <el-menu-item index="/test/edit">item two</el-menu-item>
        </el-sub-menu>

      </el-menu>
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
          <el-tooltip :content="stat.isDark ? '日常模式' : '暗夜模式'" effect="dark" placement="bottom" >
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
// import { useRoute, useRouter } from 'vue-router';
export default {
  name: 'Layout',
  setup() {
    const stat = reactive({
      isDark: ''
    })
    const isCollapse = ref(false)

    const toggle = () => {
      isCollapse.value = !isCollapse.value
    }

    // const route = useRoute()
    // const router = useRouter()

    const activeMenu = computed(() => route.path)
    const changeDark = () =>{
      stat.isDark = !stat.isDark
      let html = document.documentElement
      html.className = stat.isDark ? 'dark' : ''
    }
    const logout = () => {
      localStorage.removeItem('token')
      router.push('/login')
    }
    return{
      stat,
      isCollapse,
      toggle,
      logout,
      changeDark,
      activeMenu,
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
  .right{
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
.el-tooltip__trigger{
  padding-right: 6px;
}
</style>
