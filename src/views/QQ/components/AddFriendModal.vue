<script setup>
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { IMSDK } from '@/utils/imCommon'
import { userSearch } from '@/services/login'

defineProps({
  open: Boolean,
})

const emit = defineEmits(['update:open'])

const addFriendForm = reactive({
  searchQuery: '',
})

const searchResults = ref([])

const handleSearchFriend = async () => {
  if (!addFriendForm.searchQuery) {
    message.warning('请输入搜索内容')
    return
  }

  try {
    const data = {
      keyword: addFriendForm.searchQuery,
      page: 1,
      size: 10,
    }

    const resp = await userSearch(data)

    if (resp && resp.data && resp.data.users) {
      searchResults.value = resp.data.users.map((user) => ({
        id: user.user_id,
        name: user.user_name || user.nick_name,
        avatar: user.avatar || '/placeholder.svg?height=40&width=40',
      }))

      if (searchResults.value.length === 0) {
        message.info('未找到相关用户')
      }
    } else {
      searchResults.value = []
      message.info('未找到相关用户')
    }
  } catch (error) {
    console.error('Search failed:', error)
    message.error('搜索失败，请重试')
    searchResults.value = []
  }
}

const handleAddFriend = async (userId) => {
  try {
    await IMSDK.addFriend({
      toUserID: userId,
      reqMsg: '请求添加您为好友',
    })
    message.success('好友请求已发送')
    emit('update:open', false)
    addFriendForm.searchQuery = ''
  } catch (error) {
    message.error('发送好友请求失败，请重试')
  }
}
</script>

<template>
  <a-modal
    :open="open"
    title="添加好友"
    :footer="null"
    @update:open="$emit('update:open', $event)"
    @cancel="$emit('update:open', false)"
  >
    <div class="add-friend-content">
      <a-input-search
        v-model:value="addFriendForm.searchQuery"
        placeholder="请输入账号或昵称搜索"
        enter-button
        @search="handleSearchFriend"
      >
        <template #enterButton> <SearchOutlined />搜索 </template>
      </a-input-search>

      <div v-if="searchResults.length > 0" class="search-results">
        <div v-for="user in searchResults" :key="user.id" class="search-result-item">
          <a-avatar :src="user.avatar" />
          <div class="user-info">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-id">ID: {{ user.id }}</div>
          </div>
          <a-button type="primary" size="small" @click="() => handleAddFriend(user.id)">
            添加
          </a-button>
        </div>
      </div>

      <div v-else-if="addFriendForm.searchQuery" class="empty-results">
        <a-empty description="未找到相关用户" />
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
.add-friend-content {
  .empty-results {
    margin-top: 24px;
    text-align: center;
  }

  .search-results {
    margin-top: 16px;
    max-height: 300px;
    overflow-y: auto;
  }

  .search-result-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .user-info {
      margin-left: 12px;
      flex: 1;

      .user-name {
        font-weight: 500;
      }

      .user-id {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
