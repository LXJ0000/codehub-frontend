<template>
  <div class="max-w-2xl mx-auto bg-white">
    <div class="divide-y divide-gray-100">
      <div
        v-for="(item, index) in posts"
        :key="item.post_id"
        class="flex items-center py-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <!-- Rank Number -->
        <div class="flex items-center justify-center w-8 h-6 mr-3" :class="getRankClass(index + 1)">
          <span class="text-sm font-medium mt-1 ml-3" :class="getRankClassText(index + 1)">{{
            index + 1
          }}</span>
        </div>

        <!-- Content -->
        <div class="flex-grow">
          <div class="flex items-center gap-2">
            <span class="text-[15px] text-gray-900">{{ item.title }}</span>
            <!-- Hot Tag -->
            <img
              v-if="item.isHot"
              class="h-6 scale-125"
              src="https://simg.s.weibo.com/moter/flags/2_0.png"
              alt=""
            />
            <!-- New Tag -->
            <img
              v-if="item.isNew"
              class="h-6 scale-125"
              src="https://simg.s.weibo.com/moter/flags/1_0.png"
              alt=""
            />
          </div>
        </div>

        <!-- View Count -->
        <div class="text-[#999999] text-[14px] ml-4">
          {{ formatNumber(item.viewCount) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as api from '@/services/api'
import { message } from 'ant-design-vue'

const posts = ref([])

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const getRankClass = (rank) => {
  if (rank === 1) return 'rank-first'
  if (rank === 2) return 'rank-second'
  if (rank === 3) return 'rank-third'
  return 'rank-normal'
}

const getRankClassText = (rank) => {
  if (rank === 1) return 'rank-first-text'
  if (rank === 2) return 'rank-second-text'
  if (rank === 3) return 'rank-third-text'
  return 'rank-normal-text'
}

onMounted(async () => {
  try {
    const response = await api.rankList()
    if (response.code !== 0) {
      message.error('Failed to fetch rank list: ' + response.msg)
      return
    }
    posts.value = response.data.posts.map((post) => ({
      ...post,
      title: post.abstract,
      viewCount: Math.floor(Math.random() * 1000000) + 100000, // Simulated view count
      isHot: Math.random() > 0.5,
      isNew: Math.random() > 0.7,
    }))
  } catch (error) {
    message.warn('系统繁忙，请稍后再试')
    console.error('Failed to fetch rank list:', error)
  }
})
</script>

<style scoped>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
.rank-first {
  position: relative;
  width: 45.46px;
  height: 22.79px;
  margin-top: -5px;
  background: url('https://h5.sinaimg.cn/upload/1005/948/2021/08/31/hotRank1.png');
  color: white;
  background-size: cover;
}

.rank-second {
  width: 45.46px;
  height: 22.79px;
  margin-top: -5px;
  background: url('https://h5.sinaimg.cn/upload/1005/948/2021/08/31/hotRank2.png');
  background-size: cover;
  color: white;
}

.rank-third {
  width: 45.46px;
  height: 22.79px;
  margin-top: -5px;
  background: url('https://h5.sinaimg.cn/upload/1005/948/2021/08/31/hotRank3.png');
  background-size: cover;
  color: white;
}

.rank-normal {
  width: 32px;
  height: 18px;
  background: url('https://h5.sinaimg.cn/upload/1005/948/2021/08/31/hotRankDefault.png');
  background-size: cover;
  color: white;
}

.rank-normal-text {
  margin-right: 11px;
  margin-bottom: 5px;
}

/* Ensure exact font rendering */
div {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
