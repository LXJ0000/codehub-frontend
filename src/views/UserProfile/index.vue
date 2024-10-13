<template>
  <div class="user-profile-page">
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="home" tab="主页">
        <div class="user-info">
          <a-avatar :size="128" :src="user.avatar" />
          <h1>{{ user.nick_name || user.user_name }}</h1>
          <p>{{ user.about_me }}</p>
          <a-button v-if="isCurrentUser" @click="showEditModal">编辑个人信息</a-button>
        </div>
        <div class="user-details">
          <p><strong>生日：</strong>{{ formatDate(user.birthday) }}</p>
          <p><strong>手机：</strong>{{ user.phone || '未设置' }}</p>
          <p><strong>地区：</strong>{{ user.region || '未设置' }}</p>
        </div>
        <div class="user-stats">
          <router-link :to="`/user/${user.user_id}/following`" class="stat-item">
            <div class="stat-value">{{ followingCount }}</div>
            <div class="stat-label">关注</div>
          </router-link>
          <router-link :to="`/user/${user.user_id}/followers`" class="stat-item">
            <div class="stat-value">{{ followerCount }}</div>
            <div class="stat-label">粉丝</div>
          </router-link>
          <div class="stat-item">
            <div class="stat-value">{{ postCount }}</div>
            <div class="stat-label">动态</div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="posts" tab="动态">
        <post-list :posts="posts" />
      </a-tab-pane>
      <a-tab-pane key="favorites" tab="收藏">
        <post-list :posts="favorites" />
      </a-tab-pane>
    </a-tabs>

    <a-modal v-model:visible="editModalVisible" title="编辑个人信息" @ok="handleEditSubmit">
      <a-form :model="editForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="昵称">
          <a-input v-model:value="editForm.nick_name" />
        </a-form-item>
        <a-form-item label="个性签名">
          <a-textarea v-model:value="editForm.about_me" :rows="3" />
        </a-form-item>
        <a-form-item label="头像">
          <a-upload
            v-model:fileList="editForm.avatarFileList"
            :beforeUpload="beforeAvatarUpload"
            accept="image/*"
          >
            <!-- <a-button icon={<UploadOutlined />}>选择图片</a-button> -->
          </a-upload>
        </a-form-item>
        <a-form-item label="生日">
          <a-date-picker v-model:value="editForm.birthday" />
        </a-form-item>
        <a-form-item label="手机">
          <a-input v-model:value="editForm.phone" />
        </a-form-item>
        <a-form-item label="地区">
          <a-input v-model:value="editForm.region" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
// import { UploadOutlined } from '@ant-design/icons-vue'
import { request } from '@/utils/request'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const route = useRoute()

const activeTab = ref('home')
const editModalVisible = ref(false)
const user = ref({})
const posts = ref([])
const favorites = ref([])
const followingCount = ref(0)
const followerCount = ref(0)
const postCount = ref(0)
// const isCurrentUser = computed(() => user.value.user_id === userStore.user.user_id)
const isCurrentUser = computed(() => user.value.relation_stat?.user_id === userStore.user.user_id)

const editForm = ref({
  nick_name: '',
  about_me: '',
  avatarFileList: [],
  birthday: null,
  phone: '',
  region: '',
})

onMounted(async () => {
  const userId = route.params.id
  await fetchUserInfo(userId)
  await fetchUserStats(userId)
  await fetchPosts(userId)
  await fetchFavorites(userId)
})

const fetchUserInfo = async (userId) => {
  try {
    const response = await request('/user', 'GET', { user_id: userId })
    if (response.code === 0) {
      user.value = response.data.profile
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
    message.error('获取用户信息失败')
  }
}

const fetchUserStats = async (userId) => {
  try {
    const followingResponse = await request('/relation/list/followee', 'GET')
    const followerResponse = await request('/relation/list/follower', 'GET')
    const postResponse = await request(`/user/${userId}/posts`, 'GET')

    if (followingResponse.code === 0) {
      followingCount.value = followingResponse.count
    }
    if (followerResponse.code === 0) {
      followerCount.value = followerResponse.count
    }
    if (postResponse.code === 0) {
      postCount.value = postResponse.data.length
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    message.error('获取用户统计信息失败')
  }
}

const fetchPosts = async (userId) => {
  try {
    const response = await request(`/user/${userId}/posts`, 'GET')
    if (response.code === 0) {
      posts.value = response.data
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    message.error('获取动态列表失败')
  }
}

const fetchFavorites = async (userId) => {
  try {
    const response = await request(`/user/${userId}/favorites`, 'GET')
    if (response.code === 0) {
      favorites.value = response.data
    }
  } catch (error) {
    console.error('Error fetching favorites:', error)
    message.error('获取收藏列表失败')
  }
}

const showEditModal = () => {
  editForm.value = {
    nick_name: user.value.nick_name,
    about_me: user.value.about_me,
    avatarFileList: [],
    birthday: user.value.birthday ? new Date(user.value.birthday) : null,
    phone: user.value.phone,
    region: user.value.region,
  }
  editModalVisible.value = true
}

const beforeAvatarUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG 或 PNG 格式的图片！')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB！')
  }
  return isJpgOrPng && isLt2M
}

const handleEditSubmit = async () => {
  try {
    const formData = new FormData()
    formData.append('nick_name', editForm.value.nick_name)
    formData.append('about_me', editForm.value.about_me)
    if (editForm.value.avatarFileList.length > 0) {
      formData.append('avatar', editForm.value.avatarFileList[0].originFileObj)
    }
    formData.append(
      'birthday',
      editForm.value.birthday ? editForm.value.birthday.toISOString() : '',
    )
    formData.append('phone', editForm.value.phone)
    formData.append('region', editForm.value.region)

    const response = await request('/user/update', 'POST', formData)
    if (response.code === 0) {
      message.success('个人信息更新成功')
      editModalVisible.value = false
      await fetchUserInfo(user.value.user_id)
    }
  } catch (error) {
    console.error('Error updating user info:', error)
    message.error('更新个人信息失败')
  }
}

const formatDate = (dateString) => {
  if (!dateString || dateString === '0001-01-01T00:00:00Z') {
    return '未设置'
  }
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.user-profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.user-info {
  text-align: center;
  margin-bottom: 20px;
}

.user-details {
  margin-top: 20px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
  text-decoration: none;
  color: #333;
}

.stat-item:hover {
  color: #00a1d6;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
}

.stat-label {
  font-size: 14px;
}
</style>
