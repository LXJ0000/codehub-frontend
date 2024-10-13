<template>
  <div class="user-followers-page">
    <h1>我的的粉丝</h1>
    <a-list
      :dataSource="followers"
      :loading="loading"
      itemLayout="horizontal"
      :pagination="pagination"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #avatar>
              <router-link :to="`/user/${item.user_id}`">
                <a-avatar :src="item.avatar" />
              </router-link>
            </template>
            <template #title>
              <router-link :to="`/user/${item.user_id}`">{{
                item.nick_name || item.user_name
              }}</router-link>
            </template>
            <template #description>
              {{ item.about_me }}
            </template>
          </a-list-item-meta>
          <a-button @click="toggleFollow(item)">
            {{ item.isFollowing ? '取消关注' : '关注' }}
          </a-button>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { request } from '@/utils/request'

const route = useRoute()
const user = ref({})
const followers = ref([])
const loading = ref(false)

const pagination = {
  onChange: (page) => {
    fetchFollowers(page)
  },
  pageSize: 20,
}

onMounted(async () => {
  const userId = route.params.id
  await fetchUserInfo(userId)
  await fetchFollowers()
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

const fetchFollowers = async () => {
  loading.value = true
  try {
    const response = await request('/relation/list/follower', 'GET')
    if (response.code === 0) {
      followers.value = response.data.user_list.map((follower) => ({
        ...follower,
        isFollowing: false, // You might want to fetch this information from the backend
      }))
      pagination.total = response.data.count
    }
  } catch (error) {
    console.error('Error fetching followers:', error)
    message.error('获取粉丝列表失败')
  } finally {
    loading.value = false
  }
}

const toggleFollow = async (follower) => {
  try {
    const endpoint = follower.isFollowing ? '/relation/cancel_follow' : '/api/relation/follow'
    const response = await request(endpoint, 'POST', { followee: follower.user_id })
    if (response.code === 0) {
      follower.isFollowing = !follower.isFollowing
      message.success(follower.isFollowing ? '关注成功' : '取消关注成功')
    }
  } catch (error) {
    console.error('Error toggling follow:', error)
    message.error('操作失败')
  }
}
</script>

<style scoped>
.user-followers-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
