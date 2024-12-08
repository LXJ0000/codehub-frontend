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
      <img
        @click="goToUserProfile(userStore.user.user_id)"
        :src="userStore.user.avatar"
        alt="Current User Avatar"
        class="comment-avatar"
      />
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
        v-for="(comment, index) in sortedComments"
        :key="comment.comment_id"
        :class="{ 'comment-item': true, 'last-item': index === sortedComments.length - 1 }"
      >
        <img
          @click="goToUserProfile(comment.user_profile.user_id)"
          :src="comment.user_profile.avatar"
          alt="Commenter Avatar"
          class="comment-avatar"
        />
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-username">
              {{ comment.user_profile.nick_name || comment.user_profile.user_name }}
            </span>
          </div>
          <p :class="{ 'comment-text': true, 'double-line': !comment.isAppend }" ref="commentParagraphs">{{ comment.content }}</p>
          <a v-if="comment.content.length>60" style="text-decoration: none; color: #69b4ff; font-size: 12px; " href="javascript:void(0)" @click="handleOver(index)">{{comment.isAppend ? '点击收起' : '点击展开'}}</a>
          <div class="comment-footer">
            <span class="comment-time">{{ formatTime(comment.created_at) }}</span>
            <div class="comment-actions">
              <button
                v-if="comment.reply_count"
                class="action-btn"
                @click="toggleReplyList(comment)"
              >
                <span class="reply-count">{{ comment.reply_count }}条回复</span>
              </button>
              <button class="action-btn" @click="toggleReplyInput(comment)">回复</button>
              <button class="action-btn">
                <ShareAltOutlined />
              </button>
              <button class="action-btn" @click="likeComment(comment)">
                <component :is="comment.liked ? 'LikeFilled' : 'LikeOutlined'" />
                <span>{{ formatNumber(comment.like_cnt) }}</span>
              </button>
            </div>
          </div>

          <!-- 回复输入框 -->
          <div v-if="comment.showReplyInput" class="reply-input-section">
            <img
              @click="goToUserProfile(userStore.user.user_id)"
              :src="userStore.user.avatar"
              alt="Current User Avatar"
              class="reply-avatar"
            />
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
            <div v-for="reply in comment.replies" :key="reply.comment_id" class="reply-item">
              <img
                @click="goToUserProfile(reply.user_profile.user_id)"
                :src="reply.user_profile.avatar"
                alt="Replier Avatar"
                class="reply-avatar"
              />
              <div class="reply-content">
                <div class="reply-header">
                  <span class="reply-username">
                    {{ reply.user_profile.nick_name || reply.user_profile.user_name }}
                  </span>
                </div>
                <p class="reply-text double-line">{{ reply.content }}</p>
                <div class="reply-footer">
                  <span class="reply-time">{{ formatTime(reply.created_at) }}</span>
                  <div class="reply-actions">
                    <button class="action-btn">
                      <ShareAltOutlined />
                    </button>
                    <button class="action-btn" @click="likeComment(reply)">
                      <!-- <LikeOutlined /> -->
                      <component :is="reply.liked ? 'LikeFilled' : 'LikeOutlined'" />
                      <span>{{ formatNumber(reply.like_cnt) }}</span>
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
    <button
      v-if="totalComments - sortedComments.length"
      class="view-more-btn"
      @click="loadMoreComments"
    >
      <!-- 查看全部 {{ formatNumber(totalComments) }}条评论 -->
      查看剩余 {{ totalComments - sortedComments.length }} 条评论
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/modules/user'
import * as api from '@/services/api'

const userStore = useUserStore()
const { comments, totalComments, postId } = defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
  totalComments: {
    type: Number,
    default: 0,
  },
  postId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['load-more'])

const currentSort = ref('asc')
const sortOptions = [
  // { label: '按时间', value: 'desc' },
  { label: '按时间', value: 'asc' },
  { label: '按热度', value: 'hot' },
]
const newComment = ref('')

const formatNumber = (num) => {
  if (num == null) {
    return '0'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}
const handleOver = (index) => {
  console.log('回复列表', sortedComments.value[0])
  sortedComments.value[index].isAppend = !sortedComments.value[index].isAppend
}
const changeSort = (sortType) => {
  currentSort.value = sortType
}

const localComments = ref([])

watchEffect(() => {
  localComments.value = comments.map((comment) => ({
    ...comment,
    showReplies: false,
    showReplyInput: false,
    newReply: '',
    replies: [],
  }))
})

const sortedComments = computed(() => {
  const sorted = [...localComments.value]
  sorted.forEach((item) => {
    item.isAppend = false
  })
  switch (currentSort.value) {
    case 'desc':
      return sorted.reverse()
    case 'asc':
      return sorted
    case 'hot':
      return sorted.sort((a, b) => b.like_cnt - a.like_cnt)
    default:
      return sorted
  }
})

const toggleReplyList = async (comment) => {
  console.log('log.toggleReplyList:', comment)
  if (!comment.replies.length) {
    try {
      const response = await api.fetchSecondComments(postId, comment.comment_id)
      if (response.code === 0) {
        comment.replies = response.data.comment_list
      } else {
        message.error('获取回复失败')
      }
    } catch (error) {
      console.error('Error fetching replies:', error)
      message.error('获取回复失败')
    }
  }
  comment.showReplies = !comment.showReplies
}

const toggleReplyInput = (comment) => {
  comment.showReplyInput = !comment.showReplyInput
  if (comment.showReplyInput) {
    comment.newReply = ''
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) return

  try {
    const response = await api.submitComment(postId, newComment.value.trim())
    if (response.code === 0) {
      localComments.value.unshift({
        ...response.data.comment_detail,
        showReplies: false,
        showReplyInput: false,
        newReply: '',
        replies: [],
        user_profile: userStore.user,
      })
      message.success('评论成功')
      newComment.value = ''
      addTotalComment()
    } else {
      message.error('评论失败')
    }
  } catch (error) {
    message.error('评论失败')
  }
}

const submitReply = async (comment) => {
  if (!comment.newReply?.trim()) return
  try {
    const response = await api.submitSecondComment(
      postId,
      comment.newReply.trim(),
      comment.comment_id,
    )
    if (response.code === 0) {
      if (!comment.replies) {
        comment.replies = []
      }
      comment.replies.unshift({
        ...response.data.comment_detail,
        user_profile: userStore.user,
        to_user_profile: response.data.to_user_profile,
      })
      comment.reply_count += 1
      comment.showReplyInput = false
      comment.showReplies = true
      comment.newReply = ''
      message.success('回复成功')
    } else {
      message.error('回复失败')
    }
  } catch (error) {
    console.error('Error submitting reply:', error)
    message.error('回复失败')
  }
}

const likeComment = async (comment) => {
  try {
    const response = await api.likeComment(comment.comment_id, !comment.liked)
    if (response.code === 0) {
      comment.liked = !comment.liked
      comment.like_cnt += comment.liked ? 1 : -1
      message.success(comment.liked ? '点赞成功' : '取消点赞成功')
    }
  } catch (error) {
    console.error('Error liking comment', error)
    message.error('请稍后重试')
  }
}

const loadMoreComments = () => {
  emit('load-more')
}

const addTotalComment = () => {
  emit('add-total-comment')
}

import { useRouter } from 'vue-router'
const router = useRouter()

const goToUserProfile = (userId) => {
  router.push(`/wb/u/${userId}`)
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

.comment-item.last-item {
  /* TODO 要不要删除这个 */
  border-bottom: none;
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
  padding-top: 5px;
  padding-bottom: 0px;
  /* margin-top: 10px; */
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
  margin-left: 0px;
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
.double-line {
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
