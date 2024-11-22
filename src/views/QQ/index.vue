<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import { useConversationStore } from '@/store/modules/conversation'
import { useMessageStore } from '@/store/modules/message'
import { useUserStore } from '@/store/modules/user'
import AddFriendModal from './components/AddFriendModal.vue'
import CreateGroupModal from './components/CreateGroupModal.vue'
import UserProfileDrawer from './components/UserProfileDrawer.vue'
import MoreOptionsDrawer from './components/MoreOptionDrawer.vue'
import SettingsDrawer from './components/SettingsDrawer.vue'
import MediaUploadModal from './components/MediaUploadModal.vue'
import { CbEvents } from '@openim/wasm-client-sdk'
import { IMSDK } from '@/utils/imCommon'
import NavView from '@/components/navView.vue'
import * as api from '@/services/api'

const conversationStore = useConversationStore()
const messageStore = useMessageStore()
const userStore = useUserStore()
const searchQuery = ref('')
const selectedChat = ref(null)
const showUserProfile = ref(false)
const showMoreOptions = ref(false)
const showSettings = ref(false)
const messageInput = ref('')
const showMediaUpload = ref(false)
const chats = ref([])
const showAddMenu = ref(false)
const showAddFriendModal = ref(false)
const showCreateGroupModal = ref(false)

const messages = ref([])
const messageListRef = ref(null)

onMounted(() => {
  getConversationList()
  IMSDK.on(CbEvents.OnRecvNewMessages, ({ data }) => {
    const msg = data[0]
    if (msg.sendID === selectedChat.value.userID) {
      messages.value.push({
        id: messages.value.length + 1,
        sender: 'other',
        content: msg.textElem?.content || '',
        time: msg.sendTime || '',
        avatar: selectedChat.value.faceURL,
      })
    } else {
      const chat = chats.value.find((item) => item.userID === msg.sendID)
      chat.unread++
    }
    // 使用 nextTick 确保 DOM 更新后滚动到底部
    nextTick(() => {
      if (messageListRef.value) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight
      }
    })
  })
})

const getConversationList = async () => {
  await conversationStore.getConversationList()
  chats.value = [friendNotification, ...conversationStore.conversationList]
  chats.value.forEach((item) => {
    try {
      if (!item.isFriendNotification) {
        const latestMsg = JSON.parse(item.latestMsg)
        item.lastMessage = latestMsg?.textElem?.content || ''
        item.time = new Date(item.latestMsgSendTime).toLocaleDateString()
        item.unread = item.unreadCount
        item.myFaceURL = userStore.user.avatar
      }
    } catch (e) {
      console.log('log.getConversationList.error', e)
      item.lastMessage = '解析消息错误'
    }
  })
  // 从基础后端获取用户信息 并打印
  try {
    const userIds = chats.value.map((item) => item.userID).filter((userID) => userID)
    if (userIds.length > 0) {
      const resp = await api.batchGetUserInfo(userIds)
      // 获取用户信息之后，使用 users 更新会话列表中的用户信息
      const users = resp.data.profiles
      chats.value.forEach((item) => {
        const user = users.find((user) => user.user_id === item.userID)
        if (user) {
          item.showName = user.nick_name || user.user_name
          item.faceURL = user.avatar
        }
      })
    }
  } catch (e) {
    console.log('log.getConversationList.error', e)
  }
}

const selectChat = async (chat) => {
  selectedChat.value = chat

  if (chat.isFriendNotification) {
    // 如果是好友通知会话，不需要获取消息历史
    messages.value = []
    return
  }

  const data = await messageStore.getAdvancedHistoryMessageList(chat.conversationID)
  messages.value = data.map((item) => {
    return {
      id: item.clientMsgID || '',
      sender: item.sendID === userStore.userID ? 'user' : 'other',
      content: item.textElem?.content || '',
      time: item.sendTime || '',
      avatar: item.sendID === userStore.userID ? chat.myFaceURL : chat.faceURL,
    }
  })

  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

const toggleUserProfile = () => {
  showUserProfile.value = !showUserProfile.value
}

const toggleMoreOptions = () => {
  showMoreOptions.value = !showMoreOptions.value
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const sendMessage = async () => {
  if (messageInput.value.trim()) {
    messages.value.push({
      id: messages.value.length + 1,
      sender: 'user',
      content: messageInput.value,
      time: new Date().toLocaleString(),
      avatar: userStore.user.avatar,
    })
    const msgItem = await messageStore.createTextMessage(messageInput.value)
    messageStore.sendMessage(selectedChat.value.userID, msgItem)
    messageInput.value = ''

    nextTick(() => {
      if (messageListRef.value) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight
      }
    })
  }
}

const handleAction = (action) => {
  message.info(`${action} functionality not implemented`)
}

const handleEmojiClick = () => {
  message.info('Emoji functionality not implemented')
}

const toggleMediaUpload = () => {
  showMediaUpload.value = !showMediaUpload.value
}

const handleAddMenuClick = ({ key }) => {
  if (key === 'createGroup') {
    showCreateGroupModal.value = true
  } else if (key === 'addFriend') {
    showAddFriendModal.value = true
  }
}

const filteredChats = computed(() => {
  return chats.value.filter((chat) =>
    chat.showName.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// 新增好友请求相关数据
const friendRequests = ref([
  {
    id: 1,
    userID: 'user1',
    nickname: '向阳、',
    avatar: '/placeholder.svg?height=40&width=40',
    addTime: '2024/06/25',
    message: '请求添加对方为好友',
    status: '等待验证',
  },
  {
    id: 2,
    userID: 'user2',
    nickname: '好运连连',
    avatar: '/placeholder.svg?height=40&width=40',
    addTime: '2024/05/30',
    message: '请求添加为好友',
    status: '已同意',
  },
  // ... 更多好友请求数据
])

// 新增好友通知会话
const friendNotification = {
  id: 'friend-notification',
  showName: '好友通知',
  faceURL: '/placeholder.svg?height=40&width=40',
  lastMessage: `${friendRequests.value.length}个新好友请求`,
  time: new Date().toLocaleDateString(),
  unread: friendRequests.value.length,
  isFriendNotification: true, // 用于标识这是好友通知会话
}

// 处理好友请求的方法
const handleFriendRequest = (requestId, action) => {
  const request = friendRequests.value.find((req) => req.id === requestId)
  if (request) {
    if (action === 'accept') {
      request.status = '已同意'
      message.success('已同意好友请求')
    } else if (action === 'reject') {
      request.status = '已拒绝'
      message.success('已拒绝好友请求')
    }
  }
}
</script>

<template>
  <div class="app-container">
    <NavView />
    <div class="chat-interface">
      <div class="sidebar">
        <div class="search-bar">
          <div class="search-container">
            <a-input-search v-model:value="searchQuery" placeholder="搜索" />
            <a-dropdown
              v-model:open="showAddMenu"
              trigger="click"
              placement="bottomRight"
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            >
              <a-button class="add-button">
                <PlusOutlined />
              </a-button>
              <template #overlay>
                <a-menu @click="handleAddMenuClick">
                  <a-menu-item key="createGroup">
                    <span class="menu-item-content"> 创建群聊 </span>
                  </a-menu-item>
                  <a-menu-item key="addFriend">
                    <span class="menu-item-content">
                      <UserAddOutlined />
                      加好友/群
                    </span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
        <div class="chat-list">
          <div
            v-for="chat in filteredChats"
            :key="chat.id"
            class="chat-item"
            :class="{ selected: selectedChat === chat }"
            @click="selectChat(chat)"
          >
            <a-avatar :src="chat.faceURL" />
            <div class="chat-info">
              <div class="chat-name">{{ chat.showName }}</div>
              <div class="last-message">{{ chat.lastMessage }}</div>
            </div>
            <div class="chat-meta">
              <div class="time">{{ chat.time }}</div>
              <a-badge :count="chat.unread" :dot="chat.unread > 0" />
            </div>
          </div>
        </div>
        <div class="sidebar-footer">
          <a-button class="settings-button" @click="toggleSettings">
            <SettingOutlined />
          </a-button>
        </div>
      </div>

      <div class="main-content">
        <template v-if="selectedChat">
          <!-- 好友通知界面 -->
          <template v-if="selectedChat.isFriendNotification">
            <div class="chat-header">
              <div class="chat-title">
                <span>好友通知</span>
              </div>
              <div class="chat-actions">
                <a-button type="text">
                  <template #icon><FilterOutlined /></template>
                </a-button>
                <a-button type="text">
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </div>
            </div>

            <div class="friend-request-list">
              <div v-for="request in friendRequests" :key="request.id" class="friend-request-item">
                <div class="request-header">
                  <a-avatar :size="40" :src="request.avatar" />
                  <div class="request-info">
                    <div class="request-name">{{ request.nickname }}</div>
                    <div class="request-time">{{ request.addTime }}</div>
                  </div>
                  <div class="request-status" :class="request.status">
                    <template v-if="request.status === '等待验证'">
                      <a-button
                        type="primary"
                        size="small"
                        @click="handleFriendRequest(request.id, 'accept')"
                      >
                        同意
                      </a-button>
                      <a-button size="small" @click="handleFriendRequest(request.id, 'reject')">
                        拒绝
                      </a-button>
                    </template>
                    <span v-else>{{ request.status }}</span>
                  </div>
                </div>
                <div class="request-message">
                  {{ request.message }}
                </div>
              </div>
            </div>
          </template>

          <!-- 原有的聊天界面 -->
          <template v-else>
            <div class="chat-header">
              <div class="chat-title" @click="toggleUserProfile">
                <span>{{ selectedChat.showName }}</span>
              </div>
              <div class="chat-actions">
                <PhoneOutlined class="action-icon" @click="handleAction('Voice call')" />
                <VideoCameraOutlined class="action-icon" @click="handleAction('Video call')" />
                <DesktopOutlined class="action-icon" @click="handleAction('Screen share')" />
                <MoreOutlined class="action-icon" @click="toggleMoreOptions" />
              </div>
            </div>
            <div class="message-list" ref="messageListRef">
              <div v-for="msg in messages" :key="msg.id" :class="['message', msg.sender]">
                <a-avatar v-if="msg.sender === 'other'" :src="msg.avatar" class="message-avatar" />
                <div class="message-bubble">
                  <div class="message-content">{{ msg.content }}</div>
                  <div class="message-time">{{ new Date(msg.time).toLocaleString() }}</div>
                </div>
                <a-avatar v-if="msg.sender === 'user'" :src="msg.avatar" class="message-avatar" />
              </div>
            </div>

            <div class="message-input">
              <div class="input-actions">
                <SmileOutlined class="action-icon" @click="handleEmojiClick" />
                <PictureOutlined class="action-icon" @click="toggleMediaUpload" />
              </div>
              <a-input
                v-model:value="messageInput"
                placeholder="输入消息..."
                @pressEnter="sendMessage"
              />
              <a-button type="primary" @click="sendMessage">
                <SendOutlined />
              </a-button>
            </div>
          </template>
        </template>
      </div>

      <UserProfileDrawer v-model:open="showUserProfile" :selected-chat="selectedChat" />

      <MoreOptionsDrawer v-model:open="showMoreOptions" @handle-action="handleAction" />

      <SettingsDrawer v-model:open="showSettings" @handle-action="handleAction" />

      <MediaUploadModal
        v-model:open="showMediaUpload"
        @upload-file="(file) => handleAction(`Uploaded file: ${file.name}`)"
      />

      <AddFriendModal v-model:open="showAddFriendModal" />

      <CreateGroupModal v-model:open="showCreateGroupModal" />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-interface {
  display: flex;
  margin-top: 60px; /* 假设 NavView 的高度是 60px */
  height: calc(100vh - 60px); /* 假设 NavView 的高度是 60px */
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif;
}

.sidebar {
  width: 280px;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.search-bar {
  padding: 16px;
}

.chat-list {
  flex-grow: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
}

.chat-item:hover {
  background-color: #f0f0f0;
}

.chat-item.selected {
  background-color: #e6f7ff;
}

.chat-info {
  margin-left: 12px;
  flex-grow: 1;
}

.chat-name {
  font-weight: bold;
}

.last-message {
  font-size: 12px;
  color: #8c8c8c;
}

.chat-meta {
  text-align: right;
}

.time {
  font-size: 12px;
  color: #8c8c8c;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e8e8e8;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-title {
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.chat-actions {
  display: flex;
  gap: 16px;
}

.action-icon {
  font-size: 20px;
  color: #8c8c8c;
  cursor: pointer;
}

.action-icon:hover {
  color: #1890ff;
}

.message-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.message.user {
  justify-content: flex-end;
}

.message.other {
  justify-content: flex-start;
}

.message-avatar {
  flex-shrink: 0;
  margin-left: 12px;
  margin-right: 12px;
}

.message-bubble {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

.message-content {
  background-color: #f0f0f0;
  padding: 8px 12px;
  border-radius: 8px;
  display: inline-block;
}

.message.user .message-content {
  background-color: #1890ff;
  color: white;
}

.message-time {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.message-input {
  padding: 16px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
}

.input-actions {
  display: flex;
  gap: 16px;
  margin-right: 16px;
}

.settings-button {
  width: 100%;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-button {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-item-content {
  display: flex;
  align-items: center;
}

:deep(.ant-dropdown-menu-item) {
  padding: 8px 12px;
}

:deep(.ant-input-search) {
  flex-grow: 1;
}

.message-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.message-list::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

/* 新增好友请求列表样式 */
.friend-request-list {
  padding: 16px;
  overflow-y: auto;
  height: calc(100% - 64px);
}

.friend-request-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.request-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.request-info {
  margin-left: 12px;
  flex-grow: 1;
}

.request-name {
  font-weight: 500;
  font-size: 16px;
}

.request-time {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.request-status {
  display: flex;
  gap: 8px;
}

.request-status.已同意 {
  color: #52c41a;
}

.request-status.已拒绝 {
  color: #ff4d4f;
}

.request-message {
  color: #666;
  font-size: 14px;
  margin-top: 8px;
  padding-left: 52px;
}
</style>
