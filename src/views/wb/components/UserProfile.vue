<template>
  <div class="user-profile">
    <div class="cover-photo"></div>
    <div class="profile-info">
      <a-upload
        :show-upload-list="false"
        :before-upload="beforeUpload"
        @change="handleChange"
        :customRequest="customRequest"
        method="post"
        action="http://localhost:8080/api/user/avatar"
        :headers="headers"
      >
        <img :src="userStore.user.avatar" alt="User Avatar" class="profile-avatar" />
      </a-upload>
      <h1>{{ userStore.user.username }}</h1>
      <p>{{ userStore.user.bio }}</p>
      <div class="user-stats">
        <span>关注 {{ userStore.user.following }}</span>
        <span>粉丝 {{ userStore.user.followers }}</span>
        <span>文章 {{ userStore.user.posts }}</span>
      </div>
    </div>
    <nav class="profile-nav">
      <a-menu mode="horizontal" :selectedKeys="[selectedTab]" @select="handleTabSelect">
        <a-menu-item key="weibo">文章</a-menu-item>
        <a-menu-item key="photos">相册</a-menu-item>
        <a-menu-item key="likes">赞</a-menu-item>
      </a-menu>
    </nav>
    <div class="profile-content">
      <div v-if="selectedTab === 'weibo'">
        <!-- 将 posts 数据传递给 Feed 组件 -->
        <Feed :posts="posts" />
      </div>
      <div v-else-if="selectedTab === 'photos'">
        <!-- 显示用户的相册 -->
      </div>
      <div v-else-if="selectedTab === 'likes'">
        <!-- 显示用户赞过的内容 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { message } from 'ant-design-vue'
import Feed from './FeedView.vue'
import * as api from '@/services/api'

// 选择的标签
const selectedTab = ref('weibo')

// 用户数据和请求头
const userStore = useUserStore()
const headers = {
  authorization: 'Bearer ' + userStore.user.access_token,
}
const currentUser = ref({
  id: '',
  avatar: '',
  name: '',
  followingCount: 0,
  followerCount: 0,
  postCount: 0,
})

const posts = ref([])

// 切换标签事件
const handleTabSelect = (item) => {
  selectedTab.value = item.key
}

// 上传文件校验
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的文件！')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小需小于 2MB！')
  }
  return isJpgOrPng && isLt2M
}

// 自定义上传请求
const customRequest = async ({ file, onSuccess, onError }) => {
  const formData = new FormData()
  formData.append('avatar', file)

  try {
    const response = await fetch('http://localhost:8080/api/user/avatar', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + userStore.accessToken,
      },
      body: formData,
    })

    const data = await response.json()

    if (data.code === 0) {
      userStore.user.avatar = data.data.path
      onSuccess(data)
    } else {
      onError(new Error(data.message))
    }
  } catch (error) {
    onError(error)
  }
}

// 上传状态变化
const handleChange = (info) => {
  if (info.file.status === 'uploading') {
    console.log('Uploading:', info.file.name)
  }
  if (info.file.status === 'done') {
    message.success('头像更新成功')
  } else if (info.file.status === 'error') {
    message.error('请稍后重试')
  }
}

const fetchUserInfo = async () => {
  try {
    const response = await api.fetchUserInfo()
    // const response = await request('/user/profile', 'GET')
    if (response.code === 0) {
      currentUser.value.followingCount = response.data.profile.relation_stat.followee
      currentUser.value.followerCount = response.data.profile.relation_stat.follower
      currentUser.value.postCount = response.data.profile.post_cnt
      currentUser.value.name = response.data.profile.nick_name
        ? response.data.profile.nick_name
        : response.data.profile.user_name
      currentUser.value.avatar = response.data.profile.avatar
      currentUser.value.birthday = response.data.profile.birthday
      currentUser.value.about_me = response.data.profile.about_me
      currentUser.value.email = response.data.profile.email
      currentUser.value.id = response.data.profile.relation_stat.user_id
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}

const pagination = {
  onChange: (page) => {
    fetchPosts(page)
  },
  pageSize: 10,
}
const loading = ref(false)

const fetchPosts = async (page = 1) => {
  loading.value = true
  try {
    const response = await api.fetchWriterPosts(page)
    // const response = await request('/post/reader', 'GET', { page, size: 10 })
    if (response.code === 0) {
      posts.value = response.data.post_list.map((item) => ({
        id: item.post.post_id,
        title: item.post.title,
        content: item.post.content,
        abstract: item.post.abstract,
        authorId: item.post.author_id,
        createdAt: new Date(item.post.created_at * 1000).toLocaleString(),
        status: item.post.status,
        liked: item.stat.liked,
        collected: item.stat.collected,
        likeCount: item.interaction.like_cnt,
        collectCount: item.interaction.collect_cnt,
        readCount: item.interaction.read_cnt,
        authorAvatar: item.post.author.avatar
          ? item.post.author.avatar
          : 'https://avatars.githubusercontent.com/u/98313822?u=b615bc340136ea9f06cec4e05f0aee6b00118f82&v=4', // 你可能需要从其他地方获取作者头像
        authorName: item.post.author.nick_name
          ? item.post.author.nick_name
          : item.post.author.user_name,
        comment_count: item.comment_count,
      }))
      // 更新分页信息
      pagination.total = response.data.count
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserInfo()
  fetchPosts()
})
</script>

<style scoped>
.user-profile {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.cover-photo {
  height: 200px;
  background-color: #a5d5ff;
  border-radius: 8px 8px 0 0;
}

.profile-info {
  background-color: #fff;
  padding: 20px;
  text-align: center;
  border-radius: 0 0 8px 8px;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: -50px;
  border: 4px solid #fff;
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.profile-nav {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* .profile-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
} */
</style>
