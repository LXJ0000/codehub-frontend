<template>
  <div class="mid-view">
    <nav class="sub-nav">
      <a-menu mode="horizontal" :selectedKeys="[selectedKey]">
        <a-menu-item v-for="item in navItems" :key="item.key" @click="handleNavClick(item.key)">
          {{ item.label }}
        </a-menu-item>
        <a-menu-item key="more">
          <MoreHorizontal class="more-icon" />
        </a-menu-item>
      </a-menu>
    </nav>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MoreHorizontal, MessageSquare, Repeat2, Heart } from 'lucide-vue-next'

const selectedKey = ref('热门')

const navItems = [
  { key: '热门', label: '热门' },
  { key: '实时', label: '实时' },
  { key: '同城', label: '同城' },
  { key: '榜单', label: '榜单' },
  { key: '国际', label: '国际' },
  { key: '明星', label: '明星' },
  { key: '搞笑', label: '搞笑' },
]

const handleNavClick = (key) => {
  selectedKey.value = key
}

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
  {
    username: '用户2',
    avatar: '/placeholder.svg?height=40&width=40',
    time: '30分钟前',
    content: '这是另一条示例悦联，没有图片。',
    comments: 3,
    reposts: 1,
    likes: 15,
  },
  // 可以添加更多的帖子数据
])
</script>

<style scoped>
.mid-view {
  width: 600px;
  margin: 0 auto;
}

.sub-nav {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
}

:deep(.ant-menu-horizontal) {
  border-bottom: none;
  justify-content: center;
  line-height: 46px;
}

.more-icon {
  width: 16px;
  height: 16px;
}

:deep(.ant-menu-item-selected) {
  background-color: white !important;
}

:deep(.ant-menu-item-active) {
  background-color: white !important;
}

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

.ant-menu-horizontal {
  border-radius: 8px;
}
</style>
