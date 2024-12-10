<template>
  <div class="feed">
    <div v-for="(post, index) in posts" :key="index" class="post-card">
      <div class="post-header">
        <img
          @click="goToUserProfile(post.authorId)"
          :src="post.authorAvatar"
          alt="User Avatar"
          class="avatar"
        />
        <div class="user-info">
          <h3>{{ post.authorName }}</h3>
          <span class="post-time">{{ post.createdAt }}</span>
        </div>
        <!-- Add dropdown menu -->
        <div class="dropdown-menu">
          <button @click="toggleDropdown(index)" class="dropdown-trigger">
            <ChevronDown class="dropdown-icon" />
          </button>
          <div v-if="activeDropdown === index" class="dropdown-content">
            <button v-if="isOwnPost(post)" class="dropdown-item">置顶</button>
            <button @click="sharePost(post)" class="dropdown-item">分享</button>
            <button @click="collectPost(post)" class="dropdown-item">收藏</button>
            <button @click="promotePost(post)" class="dropdown-item">帮上头条</button>
            <button v-if="isOwnPost(post)" class="dropdown-item">转为仅粉丝可见</button>
            <button v-if="isOwnPost(post)" class="dropdown-item">转为仅自己可见</button>
            <button v-if="isOwnPost(post)" @click="deletePost(post)" class="dropdown-item">
              删除
            </button>
          </div>
        </div>
      </div>
      <p class="post-content">{{ post.content }}</p>
      <div v-if="post.images && post.images.length" class="post-images">
        <div v-if="post.images.length === 1" class="single-image">
          <img :src="post.images[0]" alt="Post Image" />
        </div>
        <div v-else class="image-grid">
          <div v-for="(image, index) in post.images.slice(0, 9)" :key="index" class="grid-item">
            <img :src="image" alt="Post Image" />
          </div>
        </div>
      </div>
      <div class="post-actions">
        <button @click="likePost(post)">
          <component :is="post.liked ? 'HeartFilled' : 'HeartOutlined'" style="font-size: 14px" />
          <span>{{ post.likeCount }}</span>
        </button>
        <button @click="toggleComments(post)">
          <CommentOutlined style="font-size: 14px" />
          <span>{{ post.comment_count || 0 }}</span>
        </button>
        <button @click="collectPost(post)">
          <component :is="post.collected ? 'StarFilled' : 'StarOutlined'" style="font-size: 14px" />
          <span>{{ post.collectCount }}</span>
        </button>
        <button @click="sharePost(post)">
          <ShareAltOutlined style="font-size: 14px" />
          <span>分享</span>
        </button>
        <!-- <button @click="deletePost(post)">
          <ShareAltOutlined style="font-size: 14px" />
          <span>删除</span>
        </button> -->
      </div>

      <!-- 评论区域 -->
      <CommentView
        v-if="post.showComments"
        :comments="post.comments"
        :total-comments="post.totalComments"
        :post-id="post.id"
        @load-more="loadMoreComments(post)"
        @add-total-comment="(post.totalComments += 1), (post.comment_count += 1)"
      />
    </div>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue'
import CommentView from './CommentView.vue'
import * as api from '@/services/api'
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { useUserStore } from '@/store/modules/user'

const emit = defineEmits(['delete-post'])
const activeDropdown = ref(null)
const { posts } = defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
})
const userStore = useUserStore()

const toggleComments = async (post) => {
  post.showComments = !post.showComments
  if (!post.comments) {
    try {
      const response = await api.fetchFirstComments(post.id)
      if (response.code === 0) {
        post.comments = response.data.comment_list
        console.log('log.post.comments:', post.comments)
        post.totalComments = response.data.count
      } else {
        message.error('获取评论失败')
      }
    } catch (error) {
      message.error('获取评论失败')
    }
  }
}

const likePost = async (post) => {
  try {
    const response = await api.likePost(post.id, !post.liked)
    if (response.code === 0) {
      post.liked = !post.liked
      post.likeCount += post.liked ? 1 : -1
      message.success(post.liked ? '点赞成功' : '取消点赞成功')
    }
  } catch (error) {
    message.error('操作失败')
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
    message.error('操作失败')
  }
}

const sharePost = (post) => {
  console.log('Sharing post:', post)
  message.info('分享功能暂未实现')
}

const deletePost = async (post) => {
  try {
    const response = await api.deletePost(post.id)
    if (response.code === 0) {
      message.success('删除成功')
      emit('delete-post', post.id)
    } else {
      message.error('删除失败')
    }
  } catch (error) {
    message.error('删除失败')
  } finally {
    activeDropdown.value = null
  }
}

const loadMoreComments = async (post) => {
  try {
    const lastComment = post.comments[post.comments.length - 1]
    console.log('Loading more comments:', lastComment)
    const response = await api.fetchFirstComments(post.id, lastComment.comment_id)
    if (response.code === 0) {
      post.comments = [...post.comments, ...response.data.comment_list]
      post.totalComments = response.data.count
    } else {
      message.error('加载更多评论失败')
    }
  } catch (error) {
    console.log('log.loadMoreComments.error', error)
    message.error('加载更多评论失败')
  }
}

import { useRouter } from 'vue-router'
const router = useRouter()

const goToUserProfile = (userId) => {
  router.push(`/wb/u/${userId}`)
}

const toggleDropdown = (index) => {
  if (activeDropdown.value === index) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = index
  }
}

const isOwnPost = (post) => {
  return post.authorId === userStore.user.user_id
}

const promotePost = () => {
  message.info('帮上头条功能暂未实现')
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.dropdown-menu')) {
    activeDropdown.value = null
  }
}

import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
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
  font-size: 15px;
  margin-bottom: 12px;
  white-space: pre-line;
  line-height: 1.6;
}

.post-images {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
  width: 80%;
}

.single-image img {
  width: 50%;
  border-radius: 8px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.grid-item img {
  width: 100%;
  border-radius: 8px;
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

.post-header {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 0;
}

.dropdown-trigger {
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.dropdown-trigger:hover {
  opacity: 1;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 140px;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 8px 16px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #f5f5f5;
}
</style>
