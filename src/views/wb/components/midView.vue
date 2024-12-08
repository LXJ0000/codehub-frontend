<template>
  <div class="mid-view">
    <div class="sub-nav-wrapper" :class="{ 'sub-nav-hidden': !showSubNav }">
      <SubNavView />
    </div>
    <div class="mid-content">
      <PostCreator @fetch-posts="fetchPosts" />
      <Feed :posts="posts" @delete-post="handleDeletePost" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as api from '@/services/api'

import Feed from './FeedView.vue'
import SubNavView from './SubNavView.vue'
import PostCreator from './PostCreator.vue'

const posts = ref([])
const showSubNav = ref(true)
let lastScrollTop = 0

const handleScroll = () => {
  const st = window.pageYOffset || document.documentElement.scrollTop
  if (st > lastScrollTop) {
    // Scrolling down
    showSubNav.value = false
  } else {
    // Scrolling up
    showSubNav.value = true
  }
  lastScrollTop = st <= 0 ? 0 : st
}

const fetchPosts = async (page = 1) => {
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
        authorAvatar:
          item.post.author.avatar ||
          'https://avatars.githubusercontent.com/u/98313822?u=b615bc340136ea9f06cec4e05f0aee6b00118f82&v=4',
        authorName: item.post.author.nick_name || item.post.author.user_name,
        comment_count: item.comment_count,
      }))
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
}

const handleDeletePost = (postId) => {
  const index = posts.value.findIndex((p) => p.id === postId)
  if (index !== -1) {
    posts.value.splice(index, 1)
  }
}

onMounted(() => {
  fetchPosts()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.mid-view {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.sub-nav-wrapper {
  position: sticky;
  top: 60px; /* Adjust this value based on your main NavView height */
  z-index: 10;
  background-color: #fff;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.1);
}

.sub-nav-hidden {
  transform: translateY(-100%);
}
</style>
