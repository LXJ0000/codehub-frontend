<template>
  <div class="user-profile">
    <div class="cover-photo"></div>
    <div class="profile-info">
      <img :src="user.avatar" alt="User Avatar" class="profile-avatar" />
      <h1>{{ user.username }}</h1>
      <p>{{ user.bio }}</p>
      <div class="user-stats">
        <span>关注 {{ user.following }}</span>
        <span>粉丝 {{ user.followers }}</span>
        <span>文章 {{ user.posts }}</span>
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
      <!-- 这里可以根据选中的标签显示不同的内容 -->
      <div v-if="selectedTab === 'weibo'">
        <!-- 使用修改后的 MidView 组件来显示用户的文章 -->
        <!-- <MidView :userId="userId" /> -->
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
import { ref, onMounted } from 'vue'
// import { useRoute } from 'vue-router'
// import MidView from './midView.vue'

// const route = useRoute()
// const userId = route.params.userId
const selectedTab = ref('weibo')

const user = ref({
  username: '加载中...',
  avatar: '/placeholder.svg?height=100&width=100',
  bio: '',
  following: 0,
  followers: 0,
  posts: 0,
})

const handleTabSelect = (item) => {
  selectedTab.value = item.key
}

onMounted(async () => {
  // 这里应该从API获取用户数据
  // 暂时使用模拟数据
  user.value = {
    username: '梦奴Q Q',
    avatar: '/placeholder.svg?height=100&width=100',
    bio: '这是用户简介',
    following: 50,
    followers: 47,
    posts: 16,
  }
})
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
