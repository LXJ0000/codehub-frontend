<template>
  <header class="top-nav">
    <div class="nav-content">
      <div class="left-section">
        <img
          alt="悦联"
          class="logo"
          src="https://tvax1.sinaimg.cn/crop.0.0.1079.1079.180/006UebRdly8hket8gaah4j30tz0tzmz2.jpg?KID=imgbed,tva&Expires=1731430147&ssig=4qtJVzbHnZ"
        />
        <a-input-search v-model:value="searchText" placeholder="搜索" class="search-input" />
      </div>

      <div class="center-section">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: currentPath === item.path }"
        >
          <!-- <home-outlined /> -->
          <span>{{ item.name }}</span>
          <!-- <MessageSquare class="icon"/> -->
        </router-link>
      </div>

      <div class="right-section">
        <img :src="userStore.user.avatar" alt="User Avatar" class="nav-icon" />
        <div class="nav-item" @click="showModal">
          <!-- <home-outlined /> -->
          <span>退出登录</span>
          <!-- <MessageSquare class="icon"/> -->
        </div>
      </div>
    </div>
  </header>

  <a-modal
    v-model:open="open"
    centered
    title="确定要退出登录吗？"
    @ok="userStore.logout"
    v-model:width="modalWidth"
  >
    <p>该操作不可撤销！</p>
  </a-modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

const searchText = ref('')
const route = useRoute()
const currentPath = computed(() => route.path)
const userStore = useUserStore()
const navItems = [
  { path: '/wb', name: '首页' },
  { path: '/qq', name: '聊天' },
  // { path: '/video', icon: Video, name: '私信' },
  { path: '/chat', name: 'AI' },
  { path: '/profile', name: '设置' },
]
const open = ref(false)
const showModal = () => {
  open.value = true
}
</script>

<style scoped>
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  z-index: 1000;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  height: 30px;
}

.search-input {
  width: 150px;
  border-radius: 4px;
  background: #f5f7fa;
}

.center-section {
  display: flex;
  gap: 30px;
}

.nav-item {
  color: #666;
  font-size: 16px;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  text-decoration: none;
}

.nav-item:hover {
  background: #f5f5f5;
}

.nav-item.active {
  color: #a5d5ff;
}

.right-section {
  display: flex;
  gap: 8px;
}

.login-btn {
  background: #a5d5ff;
  border-color: #a5d5ff;
  color: #333;
}

.icon-btn {
  padding: 0 8px;
}

.icon {
  width: 18px;
  height: 18px;
}

.nav-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}
</style>
