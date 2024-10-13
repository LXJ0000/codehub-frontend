<template>
  <div class="user-following-page">
    <h1>我的关注列表</h1>
    <a-list
      :dataSource="following"
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
          <a-button @click="cancelFollow(item.user_id)"> 取消关注 </a-button>
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
const following = ref([])
const loading = ref(false)

const pagination = {
  onChange: (page) => {
    fetchFollowing(page)
  },
  pageSize: 20,
}

onMounted(async () => {
  const userId = route.params.id
  await fetchUserInfo(userId)
  await fetchFollowing()
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

const fetchFollowing = async () => {
  loading.value = true
  try {
    const response = await request('/relation/list/followee', 'GET')
    console.log(response)

    if (response.code === 0) {
      following.value = response.data.user_list
      pagination.total = response.data.count
    }
  } catch (error) {
    console.error('Error fetching following:', error)
    message.error('获取关注列表失败')
  } finally {
    loading.value = false
  }
}

const cancelFollow = async (followeeId) => {
  try {
    const response = await request('/relation/cancel_follow', 'POST', { followee: followeeId })
    if (response.code === 0) {
      message.success('取消关注成功')
      following.value = following.value.filter((user) => user.user_id !== followeeId)
      pagination.total -= 1
    }
  } catch (error) {
    console.error('Error cancelling follow:', error)
    message.error('取消关注失败')
  }
}
</script>

<style scoped>
.user-following-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
