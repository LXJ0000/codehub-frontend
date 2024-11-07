<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useMessageStore } from '@/store/modules/Message'

const messageStore = useMessageStore()
const searchQuery = ref('')
const selectedChat = ref(null)
const showUserProfile = ref(false)
const showMoreOptions = ref(false)
const showSettings = ref(false)
const messageInput = ref('')
const showMediaUpload = ref(false)
let chats = ref([])
// const chats = messageStore.userList

const messages = ref([
  {
    id: 1,
    sender: 'user',
    content: '【王者荣耀】王者密语高级芯片X3cKIMez，快来参加新年宝藏得周卡全新史诗皮肤',
    time: '2023/12/23 19:23',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: 2,
    sender: 'other',
    content: '【王者荣耀】王者密语地狱铭文ZszmwDoX，快来参加新年宝藏得周卡全新史诗皮肤',
    time: '2023/12/23 19:28',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: 3,
    sender: 'user',
    content: '【王者荣耀】王者密语高级芯片X3cKIMez，快来参加新年宝藏得周卡全新史诗皮肤',
    time: '2023/12/23 20:23',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: 4,
    sender: 'other',
    content: '【王者荣耀】王者密语地狱铭文ZszmwDoX，快来参加新年宝藏得周卡全新史诗皮肤',
    time: '2023/12/23 21:30',
    avatar: '/placeholder.svg?height=40&width=40',
  },
])

onMounted(() => {
  console.log('sj001')
  getConversationList()
})
// const filteredChats = computed(() => {
//   return chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
// })

const getConversationList = async () => {
  console.log('sj002')
  await messageStore.getConversationList()
  chats.value = messageStore.conversationList
  console.log(chats.value, '用户列表')
}

const selectChat = (chat) => {
  selectedChat.value = chat
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

const sendMessage = () => {
  if (messageInput.value.trim()) {
    messages.value.push({
      id: messages.value.length + 1,
      sender: 'user',
      content: messageInput.value,
      time: new Date().toLocaleString(),
      avatar: '/placeholder.svg?height=40&width=40',
    })
    messageInput.value = ''
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

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Here you would typically upload the file to your server
    // For this example, we'll just add a placeholder message
    messages.value.push({
      id: messages.value.length + 1,
      sender: 'user',
      content: `Uploaded file: ${file.name}`,
      time: new Date().toLocaleString(),
      avatar: '/placeholder.svg?height=40&width=40',
    })
  }
  showMediaUpload.value = false
}

const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    // Here you would typically upload the file to your server
    // For this example, we'll just add a placeholder message
    messages.value.push({
      id: messages.value.length + 1,
      sender: 'user',
      content: `Uploaded file: ${file.name}`,
      time: new Date().toLocaleString(),
      avatar: '/placeholder.svg?height=40&width=40',
    })
  }
  showMediaUpload.value = false
}
</script>

<template>
  <div class="chat-interface">
    <div class="sidebar">
      <div class="search-bar">
        <a-input-search v-model:value="searchQuery" placeholder="搜索" />
      </div>
      <div class="chat-list">
        <div
          v-for="chat in chats"
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
      <div v-if="selectedChat" class="chat-header">
        <div class="chat-title" @click="toggleUserProfile">
          <span>{{ selectedChat.name }}</span>
        </div>
        <div class="chat-actions">
          <PhoneOutlined class="action-icon" @click="handleAction('Voice call')" />
          <VideoCameraOutlined class="action-icon" @click="handleAction('Video call')" />
          <DesktopOutlined class="action-icon" @click="handleAction('Screen share')" />
          <MoreOutlined class="action-icon" @click="toggleMoreOptions" />
        </div>
      </div>
      <div v-if="selectedChat" class="message-list">
        <div v-for="msg in messages" :key="msg.id" :class="['message', msg.sender]">
          <a-avatar v-if="msg.sender === 'other'" :src="msg.avatar" class="message-avatar" />
          <div class="message-bubble">
            <div class="message-content">{{ msg.content }}</div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
          <a-avatar v-if="msg.sender === 'user'" :src="msg.avatar" class="message-avatar" />
        </div>
      </div>

      <div v-if="selectedChat" class="message-input">
        <div class="input-actions">
          <SmileOutlined class="action-icon" @click="handleEmojiClick" />
          <PictureOutlined class="action-icon" @click="toggleMediaUpload" />
        </div>
        <a-input v-model:value="messageInput" placeholder="输入消息..." @pressEnter="sendMessage" />
        <a-button type="primary" @click="sendMessage">
          <SendOutlined />
        </a-button>
      </div>
    </div>

    <a-drawer v-model:open="showUserProfile" title="用户资料" placement="right" :width="300">
      <div v-if="selectedChat">
        <a-avatar :size="64" :src="selectedChat.avatar" />
        <h2>{{ selectedChat.name }}</h2>
        <p>QQ: 2925315190</p>
        <p>等级: 🌙</p>
        <p>个性签名: 黄昏中</p>
        <a-button type="primary">发消息</a-button>
        <a-button>音视频通话</a-button>
      </div>
    </a-drawer>

    <a-drawer v-model:open="showMoreOptions" title="更多选项" placement="right" :width="300">
      <a-menu>
        <a-menu-item @click="handleAction('Pin chat')">置顶聊天</a-menu-item>
        <a-menu-item @click="handleAction('Mute notifications')">消息免打扰</a-menu-item>
        <a-menu-item @click="handleAction('Clear chat history')">清空聊天记录</a-menu-item>
        <a-menu-item @click="handleAction('Block user')">屏蔽此人</a-menu-item>
        <a-menu-item @click="handleAction('Delete chat')">删除好友</a-menu-item>
      </a-menu>
    </a-drawer>

    <a-drawer v-model:open="showSettings" title="设置" placement="left" :width="300">
      <a-menu>
        <a-menu-item @click="handleAction('Account settings')">账号设置</a-menu-item>
        <a-menu-item @click="handleAction('Privacy settings')">隐私设置</a-menu-item>
        <a-menu-item @click="handleAction('Notification settings')">消息设置</a-menu-item>
        <a-menu-item @click="handleAction('General settings')">通用设置</a-menu-item>
        <a-menu-item @click="handleAction('About')">关于</a-menu-item>
        <a-menu-item @click="handleAction('Logout')">退出账号</a-menu-item>
      </a-menu>
    </a-drawer>

    <a-modal v-model:open="showMediaUpload" title="上传图片或视频" :footer="null">
      <div class="upload-area" @dragover.prevent @drop="handleDrop">
        <p>拖放文件到这里或者</p>
        <input type="file" @change="handleFileUpload" accept="image/*,video/*" />
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.chat-interface {
  display: flex;
  height: 100vh;
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
  justify-content: flex-end; /* 用户消息靠右 */
}

.message.other {
  justify-content: flex-start; /* 好友消息靠左 */
}

.message-avatar {
  flex-shrink: 0; /* 防止头像缩小 */
  margin-left: 12px; /* 用户消息时头像与消息的间距 */
  margin-right: 12px; /* 好友消息时头像与消息的间距 */
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

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #40a9ff;
}
</style>
