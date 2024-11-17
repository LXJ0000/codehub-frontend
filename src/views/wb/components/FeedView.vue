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
        <!-- <button><MessageSquare style="height: 16px" /> {{ post.comments }}</button> -->
        <!-- <button><Repeat2 style="height: 16px" /> {{ post.reposts }}</button> -->
        <button><MessageSquare style="height: 16px" /> 0</button>
        <button><Repeat2 style="height: 16px" /> 0</button>
        <button><Heart style="height: 16px" /> {{ post.likeCount }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MessageSquare, Repeat2, Heart } from 'lucide-vue-next'

const { posts } = defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
})

console.log('log.posts', posts)
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
