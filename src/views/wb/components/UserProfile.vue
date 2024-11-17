<template>
  <div class="user-profile">
    <div class="cover-photo"></div>
    <div class="profile-info">
      <a-upload
        :show-upload-list="false"
        :before-upload="beforeUpload"
        @change="handleChange"
        :customRequest="customRequest"
        method="post"
        action="http://localhost:8080/api/user/avatar"
        :headers="headers"
      >
        <img :src="userStore.user.avatar" alt="User Avatar" class="profile-avatar" />
      </a-upload>
      <h1>{{ userStore.user.username }}</h1>
      <p>{{ userStore.user.bio }}</p>
      <div class="user-stats">
        <span>关注 {{ userStore.user.following }}</span>
        <span>粉丝 {{ userStore.user.followers }}</span>
        <span>文章 {{ userStore.user.posts }}</span>
      </div>
    </div>
    <nav class="profile-nav">
      <a-menu mode="horizontal" :selectedKeys="[selectedTab]" @select="handleTabSelect">
        <a-menu-item key="weibo">文章</a-menu-item>
        <a-menu-item key="photos">相册</a-menu-item>
        <a-menu-item key="likes">赞</a-menu-item>
      </a-menu>
    </nav>
    <div class="profile-content">
      <div v-if="selectedTab === 'weibo'">
        <!-- 使用修改后的 MidView 组件来显示用户的文章 -->
      </div>
      <div v-else-if="selectedTab === 'photos'">
        <!-- 显示用户的相册 -->
      </div>
      <div v-else-if="selectedTab === 'likes'">
        <!-- 显示用户赞过的内容 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { message } from 'ant-design-vue'

const selectedTab = ref('weibo')
const userStore = useUserStore()
const headers = {
  authorization: 'Bearer ' + userStore.user.access_token,
}

// 选择标签事件
const handleTabSelect = (item) => {
  selectedTab.value = item.key
}

// 上传文件前的校验
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

// 自定义上传请求
const customRequest = async ({ file, onSuccess, onError }) => {
  const formData = new FormData()
  formData.append('avatar', file)

  try {
    console.log('log.customRequest', userStore.accessToken)
    const response = await fetch('http://localhost:8080/api/user/avatar', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + userStore.accessToken, // 手动设置请求头
      },
      body: formData,
    })

    const data = await response.json()

    if (data.code === 0) {
      userStore.user.avatar = data.data.path // 更新用户头像
      onSuccess(data) // 上传成功
    } else {
      onError(new Error(data.message)) // 上传失败
    }
  } catch (error) {
    onError(error) // 上传错误
  }
}

// 文件上传状态变化的处理
const handleChange = (info) => {
  if (info.file.status === 'uploading') {
    console.log('Uploading:', info.file.name)
  }
  if (info.file.status === 'done') {
    message.success(`头像更新功能`)
  } else if (info.file.status === 'error') {
    message.error(`请稍后尝试`)
  }
}
</script>

<style scoped>
.user-profile {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.cover-photo {
  height: 200px;
  background-color: #a5d5ff;
  border-radius: 8px 8px 0 0;
}

.profile-info {
  background-color: #fff;
  padding: 20px;
  text-align: center;
  border-radius: 0 0 8px 8px;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: -50px;
  border: 4px solid #fff;
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.profile-nav {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}

.profile-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
}
</style>
