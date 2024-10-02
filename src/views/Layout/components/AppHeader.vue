<script setup>
import { useRoute } from 'vue-router'
import { computed, inject, ref } from 'vue'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  BulbOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons-vue'

const route = useRoute()
const isDarkMode = inject('isDarkMode', ref(false))
const toggleDarkMode = inject('toggleDarkMode', () => {})
const isSiderCollapsed = inject('isSiderCollapsed', ref(false))
const toggleSider = inject('toggleSider', () => {})

const breadcrumb = computed(() => {
  return route.matched.map((item) => ({
    title: item.meta.title || item.name,
    path: item.path,
  }))
})

const isFullscreen = ref(false)

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

const handleLogout = () => {
  // 实现登出逻辑
  console.log('User logged out')
}
</script>

<template>
  <a-layout-header class="header">
    <div class="header-left">
      <a-button class="toggle-btn" @click="toggleSider">
        <MenuFoldOutlined v-if="isSiderCollapsed" />
        <MenuUnfoldOutlined v-else />
      </a-button>
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item v-for="item in breadcrumb" :key="item.path">
          <router-link :to="item.path">{{ item.title }}</router-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="header-right">
      <a-space>
        <a-button @click="toggleFullscreen" class="icon-btn">
          <template #icon>
            <FullscreenOutlined v-if="!isFullscreen" />
            <FullscreenExitOutlined v-else />
          </template>
        </a-button>
        <a-button @click="toggleDarkMode" class="icon-btn">
          <template #icon>
            <BulbOutlined />
          </template>
        </a-button>
        <a-dropdown>
          <a-avatar
            :style="{ backgroundColor: isDarkMode ? 'var(--primary-100)' : 'var(--accent-100)' }"
            icon="user"
          />
          <template #overlay>
            <a-menu>
              <a-menu-item key="0">
                <router-link to="/user/profile">
                  <UserOutlined />
                  个人主页
                </router-link>
              </a-menu-item>
              <a-menu-item key="1">
                <router-link to="/user/settings">
                  <SettingOutlined />
                  用户设置
                </router-link>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="3" @click="handleLogout">
                <LogoutOutlined />
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </div>
  </a-layout-header>
</template>

<style scoped>
.header {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background-color: var(--bg-100);
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-btn {
  margin-right: 12px;
  display: none;
}

.breadcrumb {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-right {
  display: flex;
  align-items: center;
}

.icon-btn {
  background: transparent;
  border: none;
}

.icon-btn:hover {
  background-color: var(--bg-200);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
  }

  .toggle-btn {
    display: inline-block;
  }

  .header-right {
    margin-top: 12px;
    align-self: flex-end;
  }

  .breadcrumb {
    max-width: calc(100vw - 100px);
  }
}
</style>
