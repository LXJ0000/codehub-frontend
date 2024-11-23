<template>
  <div class="feed">
    <div v-for="(post, index) in posts" :key="index" class="post-card">
      <div class="post-header">
        <img :src="post.authorAvatar" alt="User Avatar" class="avatar" />
        <div class="user-info">
          <h3>{{ post.authorName }}</h3>
          <span class="post-time">{{ post.createdAt }}</span>
        </div>
      </div>
      <p class="post-content">{{ post.content }}</p>
      <div v-if="post.image" class="post-image">
        <img :src="post.image" alt="Post Image" />
      </div>
      <div class="post-actions">
        <button @click="likePost(post)">
          <component :is="post.liked ? 'HeartFilled' : 'HeartOutlined'" />
          <span>{{ post.likeCount }}</span>
        </button>
        <button @click="collectPost(post)">
          <component :is="post.collected ? 'StarFilled' : 'StarOutlined'" />
          <span>{{ post.collectCount }}</span>
        </button>
        <button @click="sharePost(post)">
          <ShareAltOutlined />
          <span>分享</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { defineProps } from 'vue'
import * as api from '@/services/api'

const { posts } = defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
})

const likePost = async (post) => {
  try {
    const response = await api.likePost(post.id, !post.liked)
    if (response.code === 0) {
      post.liked = !post.liked
      post.likeCount += post.liked ? 1 : -1
      message.success(post.liked ? '点赞成功' : '取消点赞成功')
    }
  } catch (error) {
    console.error('Error liking post:', error)
  }
}

const collectPost = async (post) => {
  try {
    const response = await api.collectPost(post.id, !post.collected)
    if (response.code === 0) {
      post.collected = !post.collected
      post.collectCount += post.collected ? 1 : -1
      message.success(post.collected ? '收藏成功' : '取消收藏成功')
    }
  } catch (error) {
    console.error('Error collecting post:', error)
  }
}

const sharePost = (post) => {
  console.log('Sharing post:', post)
  message.info('分享功能暂未实现')
}
</script>

<style scoped>
.feed {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.post-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.user-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.post-time {
  font-size: 12px;
}

.post-content {
  margin-bottom: 12px;
}

.post-image img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.post-actions button {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
