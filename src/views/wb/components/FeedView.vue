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
      </div>
      <p class="post-content">{{ post.content }}</p>
      <div v-if="post.image" class="post-image">
        <img :src="post.image" alt="Post Image" />
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
        <button @click="deletePost(post)">
          <ShareAltOutlined style="font-size: 14px" />
          <span>删除</span>
        </button>
      </div>

      <!-- 评论区域 -->
      <CommentView
        v-if="post.showComments"
        :comments="post.comments"
        :total-comments="post.totalComments"
        :post-id="post.id"
        @load-more="loadMoreComments(post)"
        @add-total-comment="post.totalComments += 1"
      />
    </div>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue'
import CommentView from './CommentView.vue'
import * as api from '@/services/api'

const emit = defineEmits(['delete-post'])

const { posts } = defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
})

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
