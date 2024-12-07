<template>
  <div class="mid-view">
    <SubNavView />
    <PostCreator />
    <Feed :posts="posts" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as api from '@/services/api'

import Feed from './FeedView.vue'
import SubNavView from './SubNavView.vue'
import PostCreator from './PostCreator.vue'

const currentUser = ref({
  id: '',
  avatar: '',
  name: '',
  followingCount: 0,
  followerCount: 0,
  postCount: 0,
})

const posts = ref([])

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
    const response = await api.fetchPosts(0, page)
    if (response.code === 0) {
      posts.value = response.data.post_list.map((item) => ({
        id: item.post.post_id,
        title: item.post.title,
        content: item.post.content,
        abstract: item.post.abstract,
        authorId: item.post.author.user_id,
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
.mid-view {
  width: 600px;
  margin: 0 auto;
}
</style>
