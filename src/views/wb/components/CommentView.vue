<template>
  <div class="comments-section">
    <!-- 评论排序选项 -->
    <div class="comment-sort">
      <button
        v-for="sort in sortOptions"
        :key="sort.value"
        :class="['sort-btn', { active: currentSort === sort.value }]"
        @click="changeSort(sort.value)"
      >
        {{ sort.label }}
      </button>
    </div>

    <!-- 评论输入框 -->
    <div class="comment-input-section">
      <img :src="userStore.user.avatar" alt="Current User Avatar" class="comment-avatar" />
      <div class="comment-input-wrapper">
        <input
          v-model="newComment"
          type="text"
          class="comment-input"
          placeholder="发布你的评论"
          @keyup.enter="submitComment"
        />
        <div class="comment-tools">
          <button class="tool-button">
            <SmileOutlined />
          </button>
          <button class="tool-button">
            <PictureOutlined />
          </button>
          <button
            class="comment-submit"
            :disabled="!newComment"
            @click="submitComment"
            style="border-radius: 16px"
          >
            评论
          </button>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comments-list">
      <div
        v-for="(comment, commentIndex) in sortedComments"
        :key="commentIndex"
        class="comment-item"
      >
        <img :src="comment.avatar" alt="Commenter Avatar" class="comment-avatar" />
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-username">{{ comment.username }}</span>
            <span class="comment-location">来自{{ comment.location }}</span>
          </div>
          <p class="comment-text">{{ comment.content }}</p>
          <div class="comment-footer">
            <span class="comment-time">{{ comment.time }}</span>
            <div class="comment-actions">
              <button class="action-btn" @click="toggleReplyInput(comment)">回复</button>
              <button class="action-btn" @click="toggleReplyList(comment)">
                <span class="reply-count">{{ comment.replyCount }}条回复</span>
              </button>
              <button class="action-btn">
                <ShareAltOutlined />
              </button>
              <button class="action-btn" @click="likeComment(comment)">
                <LikeOutlined />
                <span>{{ formatNumber(comment.likes) }}</span>
              </button>
            </div>
          </div>

          <!-- 回复输入框 -->
          <div v-if="comment.showReplyInput" class="reply-input-section">
            <img :src="userStore.user.avatar" alt="Current User Avatar" class="reply-avatar" />
            <div class="reply-input-wrapper">
              <input
                v-model="comment.newReply"
                type="text"
                class="reply-input"
                placeholder="回复评论"
                @keyup.enter="submitReply(comment)"
              />
              <button
                class="reply-submit"
                :disabled="!comment.newReply"
                @click="submitReply(comment)"
                style="border-radius: 16px"
              >
                回复
              </button>
            </div>
          </div>

          <!-- 回复列表 -->
          <div v-if="comment.showReplies" class="reply-list">
            <div
              v-for="(reply, replyIndex) in comment.replies"
              :key="replyIndex"
              class="reply-item"
            >
              <img :src="reply.avatar" alt="Replier Avatar" class="reply-avatar" />
              <div class="reply-content">
                <div class="reply-header">
                  <span class="reply-username">{{ reply.username }}</span>
                  <span class="reply-location">来自{{ reply.location }}</span>
                </div>
                <p class="reply-text">{{ reply.content }}</p>
                <div class="reply-footer">
                  <span class="reply-time">{{ reply.time }}</span>
                  <div class="reply-actions">
                    <button class="action-btn">
                      <ShareAltOutlined />
                    </button>
                    <button class="action-btn" @click="likeReply(comment, reply)">
                      <LikeOutlined />
                      <span>{{ formatNumber(reply.likes) }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 查看更多评论 -->
    <button class="view-more-btn" @click="loadMoreComments">
      查看全部 {{ formatNumber(totalComments) }}条评论
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import {
  SmileOutlined,
  PictureOutlined,
  ShareAltOutlined,
  LikeOutlined,
} from '@ant-design/icons-vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const props = defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
  totalComments: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:comments', 'load-more'])

const currentSort = ref('hot')
const sortOptions = [
  { label: '按倒序', value: 'desc' },
  { label: '按正序', value: 'asc' },
  { label: '按热度', value: 'hot' },
]
const newComment = ref('')

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

const changeSort = (sortType) => {
  currentSort.value = sortType
}

const sortedComments = computed(() => {
  const sorted = [...props.comments]
  switch (currentSort.value) {
    case 'desc':
      return sorted.reverse()
    case 'asc':
      return sorted
    case 'hot':
      return sorted.sort((a, b) => b.likes - a.likes)
    default:
      return sorted
  }
})

const toggleReplyList = (comment) => {
  comment.showReplies = !comment.showReplies
}

const toggleReplyInput = (comment) => {
  comment.showReplyInput = !comment.showReplyInput
  if (comment.showReplyInput) {
    comment.newReply = ''
  }
}

const submitComment = () => {
  if (!newComment.value.trim()) return

  const comment = {
    id: Date.now(),
    username: '当前用户',
    avatar: userStore.user.value,
    content: newComment.value.trim(),
    time: new Date().toLocaleString(),
    location: '未知',
    likes: 0,
    replyCount: 0,
    replies: [],
    showReplies: false,
    showReplyInput: false,
  }

  emit('update:comments', [comment, ...props.comments])
  newComment.value = ''
  message.success('评论成功')
}

const submitReply = (comment) => {
  if (!comment.newReply?.trim()) return

  const reply = {
    id: Date.now(),
    username: '当前用户',
    avatar: userStore.user.avatar,
    content: comment.newReply.trim(),
    time: new Date().toLocaleString(),
    location: '未知',
    likes: 0,
  }

  comment.replies.unshift(reply)
  comment.replyCount += 1
  comment.showReplyInput = false
  comment.newReply = ''
  emit('update:comments', [...props.comments])
  message.success('回复成功')
}

const likeComment = (comment) => {
  comment.likes += 1
  emit('update:comments', [...props.comments])
}

const likeReply = (comment, reply) => {
  reply.likes += 1
  emit('update:comments', [...props.comments])
}

const loadMoreComments = () => {
  emit('load-more')
}
</script>

<style scoped>
.comments-section {
  margin-top: 16px;
}

.comment-sort {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 0 12px;
}

.sort-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
}

.sort-btn.active {
  color: var(--accent-100);
  font-weight: 500;
}

.comment-input-section {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment-input-wrapper {
  flex: 1;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 8px 16px;
}

.comment-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  margin-bottom: 8px;
}

.comment-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #999;
}

.comment-submit {
  background: var(--accent-100);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 14px;
}

.comment-submit:disabled {
  background: var(--primary-100);
  cursor: not-allowed;
}

.comments-list {
  margin-top: 16px;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  margin-bottom: 4px;
}

.comment-username {
  font-weight: 500;
  font-size: 14px;
}

.comment-location {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
}

.comment-text {
  font-size: 14px;
  margin: 0;
  color: #333;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.reply-count {
  color: var(--accent-100);
}

.reply-input-section {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.reply-input-wrapper {
  flex: 1;
  display: flex;
  background: #f5f5f5;
  border-radius: 16px;
  padding: 4px 12px;
}

.reply-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
}

.reply-submit {
  background: var(--accent-100);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 14px;
}

.reply-submit:disabled {
  background: var(--primary-100);
  cursor: not-allowed;
}

.reply-list {
  margin-top: 12px;
  margin-left: 44px;
  border-left: 2px solid #f0f0f0;
  padding-left: 12px;
}

.reply-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
}

.reply-content {
  flex: 1;
}

.reply-header {
  margin-bottom: 4px;
}

.reply-username {
  font-weight: 500;
  font-size: 14px;
}

.reply-location {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
}

.reply-text {
  font-size: 14px;
  margin: 0;
  color: #333;
}

.reply-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.reply-time {
  font-size: 12px;
  color: #999;
}

.reply-actions {
  display: flex;
  gap: 16px;
}

.view-more-btn {
  width: 100%;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 12px;
  margin-top: 12px;
  font-size: 14px;
}

.view-more-btn:hover {
  background: #f5f5f5;
}
</style>
