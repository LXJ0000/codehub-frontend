<template>
  <div class="dashboard-container">
    <a-card title="用户仪表板" class="dashboard-card">
      <template #extra>
        <a-button @click="handleLogout">退出登录</a-button>
      </template>
      <p><strong>用户名:</strong> {{ userStore.user?.user_name }}</p>
      <p><strong>邮箱:</strong> {{ userStore.user?.email }}</p>
      <p><strong>用户ID:</strong> {{ userStore.user?.user_id }}</p>
    </a-card>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await userStore.logout()
    message.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    message.error(error.message || '退出登录失败，请重试')
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;

  .dashboard-card {
    width: 100%;
    max-width: 600px;
  }
}
</style>
