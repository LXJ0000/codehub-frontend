<template>
  <div class="feed">
    <div v-for="(post, index) in posts" :key="index" class="post-card">
      <div class="post-header">
        <img :src="post.avatar" alt="User Avatar" class="avatar" />
        <div class="user-info">
          <h3>{{ post.username }}</h3>
          <span class="post-time">{{ post.time }}</span>
        </div>
      </div>
      <p class="post-content">{{ post.content }}</p>
      <div v-if="post.image" class="post-image">
        <img :src="post.image" alt="Post Image" />
      </div>
      <div class="post-actions">
        <button><MessageSquare style="height: 16px" /> {{ post.comments }}</button>
        <button><Repeat2 style="height: 16px" /> {{ post.reposts }}</button>
        <button><Heart style="height: 16px" /> {{ post.likes }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MessageSquare, Repeat2, Heart } from 'lucide-vue-next'

const posts = ref([
  {
    username: '用户1',
    avatar: '/placeholder.svg?height=40&width=40',
    time: '10分钟前',
    content: '这是一条示例悦联内容，展示了基本的文本布局和样式。',
    image: '/placeholder.svg?height=300&width=400',
    comments: 10,
    reposts: 5,
    likes: 20,
  },
])
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
