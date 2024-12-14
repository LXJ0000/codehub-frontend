<script setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'

defineProps({
  open: Boolean,
})

const emit = defineEmits(['update:open'])

const createGroupForm = reactive({
  name: '',
  avatar: '',
  selectedMembers: [],
})

const friendList = ref([
  {
    id: 1,
    name: '我的好友',
    avatar: '/placeholder.svg?height=40&width=40',
  },
])

const handleCreateGroup = async () => {
  if (!createGroupForm.name.trim()) {
    message.warning('请输入群名称')
    return
  }
  try {
    // Here you would typically make an API call to create the group
    message.success('群聊创建成功')
    emit('update:open', false)
    createGroupForm.name = ''
    createGroupForm.selectedMembers = []
  } catch (error) {
    message.error('创建群聊失败，请重试')
  }
}

const handleAvatarUpload = (info) => {
  if (info.file.status === 'done') {
    createGroupForm.avatar = info.file.response.url
    message.success('头像上传成功')
  } else if (info.file.status === 'error') {
    message.error('头像上传失败')
  }
}
</script>

<template>
  <a-modal
    :open="open"
    title="创建群聊"
    @update:open="$emit('update:open', $event)"
    @ok="handleCreateGroup"
    @cancel="$emit('update:open', false)"
  >
    <div class="create-group-content">
      <a-form :model="createGroupForm" layout="vertical">
        <a-form-item label="群名称" required>
          <a-input v-model:value="createGroupForm.name" placeholder="请输入群名称" />
        </a-form-item>

        <a-form-item label="群头像">
          <div class="group-avatar">
            <a-avatar
              :src="createGroupForm.avatar || '/placeholder.svg?height=80&width=80'"
              :size="80"
            />
            <a-upload
              name="avatar"
              :show-upload-list="false"
              action="/api/upload"
              @change="handleAvatarUpload"
            >
              <a class="avatar-upload-link">点击修改</a>
            </a-upload>
          </div>
        </a-form-item>

        <a-form-item label="群成员">
          <div class="member-selection">
            <a-input-search placeholder="搜索好友" style="margin-bottom: 16px" />
            <div class="member-list">
              <div v-for="friend in friendList" :key="friend.id" class="member-item">
                <a-checkbox :value="friend.id">
                  <a-avatar :src="friend.avatar" :size="24" />
                  <span class="member-name">{{ friend.name }}</span>
                </a-checkbox>
              </div>
            </div>
            <div class="selected-count">已选择: {{ createGroupForm.selectedMembers.length }}</div>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<style scoped>
.create-group-content {
  .group-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .avatar-upload-link {
    color: #1890ff;
    cursor: pointer;
  }

  .member-selection {
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    padding: 16px;
  }

  .member-list {
    max-height: 200px;
    overflow-y: auto;
  }

  .member-item {
    padding: 8px 0;

    .member-name {
      margin-left: 8px;
    }
  }

  .selected-count {
    margin-top: 16px;
    text-align: right;
    color: #999;
  }
}
</style>
