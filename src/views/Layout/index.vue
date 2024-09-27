<script setup>
import AppSideBar from './components/AppSideBar.vue'
import { useAccountStore } from '@/store'
import { ref } from 'vue'
import { http } from '@/utils/request'
import { getCaptcha } from '@/apis/user'

const accountStore = useAccountStore()

const userInfo = ref()
const getUserInfo = async () => {
  // 通过 fetch 获取用户信息(mock)
  const response = await fetch('/api/user/info')
  const res = await response.json()
  userInfo.value = res.data
}

const getUserInfoAxios = async () => {
  // 通过 axios 获取用户信息(注意：请求 mock 需拼接成 http 开头的路径)
  const res = await http(`${location.origin}/api/user/info`)
  userInfo.value = res.data
}

// 获取图片验证码
const randomId = Math.random().toString(36).slice(-8)
const codeImageUrl = ref('')
const getCodeImage = async () => {
  // 发送请求获取，后端返回 Buffer 类型的图片
  const res = await getCaptcha(randomId)
  // 将 Buffer 类型的图片转换为 Blob 类型
  const blob = new Blob([res], { type: 'image/png' })
  // 将 Blob 类型的图片转换为 URL 地址
  codeImageUrl.value = URL.createObjectURL(blob)
}
</script>

<template>
  <a-layout has-sider class="layout">
    <!-- 侧边栏 -->
    <AppSideBar />
    <a-layout class="main">
      <!-- 页头 -->
      <div>页头</div>
      <!-- 主体 -->
      <a-layout-content class="content">
        <!-- 功能测试分区 -->
        <div style="display: flex; justify-content: space-evenly; flex-wrap: wrap">
          <!-- 测试例子1 -->
          <a-card title="Store & 权限指令">
            <h3>Store 角色: {{ accountStore.role }}</h3>
            <button @click="accountStore.changeRole('admin')">切换角色 admin</button>
            <button @click="accountStore.changeRole('user')">切换角色 user</button>
            <a-divider />
            <a-button v-permission="['admin']" type="primary">admin 权限按钮</a-button>
            <a-button v-permission="['user']" type="primary" ghost> user 权限按钮</a-button>
          </a-card>
          <a-card title="mock 请求">
            <button @click="getUserInfo()">获取 mock 用户信息 - fetch</button>
            <button @click="getUserInfoAxios()">获取 mock 用户信息 - axios</button>
            <button @click="getCodeImage()">获取图片验证码 - axios</button>
            <a-divider />
            <div>{{ userInfo }}</div>
            <img
              v-if="codeImageUrl"
              :src="codeImageUrl"
              @click="getCodeImage()"
              alt="图片验证码"
              title="点击重新获取"
              style="cursor: pointer"
            />
          </a-card>
        </div>
        <!-- 路由组件 -->
        <router-view />
      </a-layout-content>
      <!-- 页脚 -->
      <div>页脚</div>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
  background-color: #ccc;
}

.main {
  margin-left: 200px;
  background-color: #ddd;
}

.content {
  background-color: #f4f4f4;
  padding: 20px;
  overflow-y: auto;
  margin-top: 60px;
}
</style>
