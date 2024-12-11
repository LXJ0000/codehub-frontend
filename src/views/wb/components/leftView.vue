<template>
  <div class="main">
    <nav class="bg-white p-2 pl-1">
      <h2 class="text-xl mb-4">推荐</h2>

      <div class="space-y-1">
        <a href="#" class="flex items-center text-md hover:bg-gray-50 rounded-lg p-2">
          <FlameIcon class="w-5 h-5 text-orange-500 mr-3" />
          <span>热门推荐</span>
        </a>

        <a href="#" class="flex items-center text-md hover:bg-gray-50 rounded-lg p-2">
          <ClockIcon class="w-5 h-5 text-gray-400 mr-3" />
          <span>热门榜单</span>
        </a>

        <div class="space-y-0">
          <div class="flex items-center text-md p-2">
            <SearchIcon class="w-5 h-5 text-gray-400 mr-3" />
            <span>微博热搜</span>
          </div>

          <a href="#" class="block text-sm hover:bg-gray-50 rounded-lg p-2 pl-10 ml-0">我的</a>
          <a href="#" class="block text-sm hover:bg-gray-50 rounded-lg p-2 pl-10 ml-0">热搜</a>
          <a href="#" class="block text-sm hover:bg-gray-50 rounded-lg p-2 pl-10 ml-0">文娱</a>
          <a href="#" class="block text-sm hover:bg-gray-50 rounded-lg p-2 pl-10 ml-0">要闻</a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { FlameIcon, ClockIcon, SearchIcon } from 'lucide-vue-next'
</script>

<style scoped>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

.main {
  background: #fff;
  border-radius: 8px;
  height: calc(100vh - 70px);
  /* position: fixed; */
  overflow-y: auto;
  padding: 20px 10px;
  margin-left: 5px;
  margin-right: 5px;
}
a {
  text-decoration: none;
}
</style>
