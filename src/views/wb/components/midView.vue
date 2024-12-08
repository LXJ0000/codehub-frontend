<template>
  <div class="mid-view">
    <div class="sub-nav-wrapper" :class="{ 'sub-nav-hidden': !showSubNav }">
      <SubNavView />
    </div>
    <div class="mid-content">
      <PostCreator @fetch-posts="fetchPosts" @remove-last="removeLast" />
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
import { message } from 'ant-design-vue'

const posts = ref([])
const showSubNav = ref(true)
let lastScrollTop = 0
let currentPage = 1
let last = -1
let hasMorePosts = true

const handleScroll = () => {
  const st = document.documentElement.scrollTop
  console.log(st)
  if (st > lastScrollTop) {
    // Scrolling down
    showSubNav.value = false
  } else {
    // Scrolling up
    showSubNav.value = true
  }
  lastScrollTop = st <= 0 ? 0 : st

  const triggerHeight = window.innerHeight * 0.9 // 1.5 times the viewport height
  if (st > currentPage * triggerHeight) {
    if (hasMorePosts) {
      currentPage++
      fetchPosts()
    } else {
      // 如果鼠标滚动到底部，提示没有更多数据了
      if (document.documentElement.scrollHeight - document.documentElement.clientHeight === st) {
        message.info('没有更多了')
      }
    }
  }
}

const removeLast = () => {
  last = -1
}

const fetchPosts = async () => {
  try {
    const response = await api.fetchPosts(0, last)
    if (response.code === 0) {
      const current = response.data.post_list.map((item) => ({
        id: item.post.post_id,
        title: item.post.title,
        content: item.post.content,
        abstract: item.post.abstract,
        authorId: item.post.author.user_id,
        createdAt: new Date(item.post.created_at * 1000).toLocaleString(),
        created_at: item.post.created_at,
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
      if (current.length < 10) {
        // default size is 10
        hasMorePosts = false
      }
      if (posts.value && last != -1) {
        posts.value = [...posts.value, ...current]
      } else {
        posts.value = [...current]
      }
      last = current[current.length - 1].created_at
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
  removeLast()
  fetchPosts()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  removeLast()
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
  top: 60px;
  /* Adjust this value based on your main NavView height */
  z-index: 10;
  background-color: #fff;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.1);
}

.sub-nav-hidden {
  transform: translateY(-100%);
}
</style>
