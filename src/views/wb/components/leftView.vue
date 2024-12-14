<template>
  <div class="main">
    <nav class="bg-white p-2 pl-1">
      <h2 class="text-xl mb-4">推荐</h2>

      <div class="space-y-1">
        <div
          class="flex items-center text-md hover:bg-gray-50 rounded-lg p-2"
          :class="{ 'text-orange-500': selectedItem === '热门推荐' }"
          @click="selectItem('热门推荐')"
        >
          <FlameIcon
            class="w-5 h-5 text-gray-400 mr-3"
            :class="{ 'text-orange-500': selectedItem === '热门推荐' }"
          />
          <span>热门推荐</span>
        </div>

        <div
          class="flex items-center text-md hover:bg-gray-50 rounded-lg p-2"
          :class="{ 'text-orange-500': selectedItem === '热门榜单' }"
          @click="selectItem('热门榜单')"
        >
          <ClockIcon
            class="w-5 h-5 text-gray-400 mr-3"
            :class="{ 'text-orange-500': selectedItem === '热门榜单' }"
          />
          <span>热门榜单</span>
        </div>

        <div class="space-y-0">
          <div class="flex items-center text-md p-2">
            <SearchIcon class="w-5 h-5 text-gray-400 mr-3" />
            <span>微博热搜</span>
          </div>

          <div
            class="block text-sm hover:bg-gray-50 rounded-lg p-2 pl-10 ml-0"
            :class="{ 'text-orange-500': selectedItem === '我的' }"
            @click="selectItem('我的')"
          >
            我的
          </div>
          <div
            class="block text-sm hover:bg-gray-50 rounded-lg p-2 pl-10 ml-0"
            :class="{ 'text-orange-500': selectedItem === '热搜' }"
            @click="selectItem('热搜')"
          >
            热搜
          </div>
          <div
            class="block text-sm hover:bg-gray-50 rounded-lg p-2 pl-10 ml-0"
            :class="{ 'text-orange-500': selectedItem === '文娱' }"
            @click="selectItem('文娱')"
          >
            文娱
          </div>
          <div
            class="block text-sm hover:bg-gray-50 rounded-lg p-2 pl-10 ml-0"
            :class="{ 'text-orange-500': selectedItem === '要闻' }"
            @click="selectItem('要闻')"
          >
            要闻
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FlameIcon, ClockIcon, SearchIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
const router = useRouter()

const selectedItem = ref('热门推荐')

const selectItem = (item) => {
  selectedItem.value = item
  // TODO - route to the corresponding page
  if (item === '热门推荐') {
    router.push('/wb')
  } else if (item === '热门榜单') {
    router.push('/wb/rank')
  } else if (item === '我的') {
    router.push('/wb/me')
  } else if (item === '热搜') {
    router.push('/wb/hot-search')
  } else if (item === '文娱') {
    router.push('/wb/entertainment')
  } else if (item === '要闻') {
    router.push('/wb/news')
  }
}
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
