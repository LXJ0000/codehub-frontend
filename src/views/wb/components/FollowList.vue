<template>
  <div class="min-h-screen bg-white">
    <!-- Back Button Section -->
    <div class="h-[52px] flex items-center px-4 border-b border-gray-100">
      <button class="flex items-center text-gray-900 cursor-pointer">
        <ChevronLeft class="w-7 h-7" />
        <span class="text-[17px]">返回</span>
      </button>
    </div>

    <!-- Tabs Section -->
    <div class="border-b border-gray-100">
      <div class="flex px-5 space-x-8">
        <button class="relative py-3.5 cursor-pointer group" @click="activeTab = 'following'">
          <span
            :class="[
              'text-[15px] font-medium',
              activeTab === 'following' ? 'text-gray-900' : 'text-gray-500',
            ]"
            >关注</span
          >
          <div
            class="absolute bottom-0 left-0 right-0 h-[2px] transition-colors"
            :class="
              activeTab === 'following' ? 'bg-gray-900' : 'bg-transparent group-hover:bg-gray-200'
            "
          ></div>
        </button>
        <button class="relative py-3.5 cursor-pointer group" @click="activeTab = 'followers'">
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-[15px] font-medium',
              activeTab === 'followers' ? 'bg-orange-50 text-[#FF8200]' : 'text-gray-500',
            ]"
            >粉丝</span
          >
          <div
            class="absolute bottom-0 left-0 right-0 h-[2px] transition-colors"
            :class="
              activeTab === 'followers' ? 'bg-gray-900' : 'bg-transparent group-hover:bg-gray-200'
            "
          ></div>
        </button>
      </div>
    </div>

    <!-- List Section -->
    <div class="mt-2">
      <div
        v-for="user in users"
        :key="user.id"
        class="px-4 py-3 flex items-center hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <!-- Avatar -->
        <div class="relative flex-shrink-0">
          <img
            :src="user.avatar"
            class="w-[46px] h-[46px] rounded-full object-cover"
            :alt="user.name"
          />
          <div
            v-if="user.verified"
            class="absolute -right-0.5 bottom-0 bg-[#FF8200] rounded-full p-1"
          >
            <div class="w-2.5 h-2.5 text-white">
              <CheckIcon class="w-full h-full" />
            </div>
          </div>
        </div>

        <!-- User Info -->
        <div class="flex-1 ml-3">
          <div class="flex items-center">
            <span class="text-[15px] font-medium text-gray-900">{{ user.name }}</span>
            <img v-if="user.crown" src="/crown.png" class="w-4 h-4 ml-1" alt="crown" />
            <span v-if="user.level" class="ml-1 text-[#FF8200]">{{ user.level }}</span>
          </div>
          <div class="mt-0.5 text-[13px] text-gray-500">{{ user.description }}</div>
          <div class="mt-0.5 text-[13px] text-gray-400">粉丝 {{ user.followers }}</div>
        </div>

        <!-- Follow Button -->
        <button
          class="px-4 py-1 text-[#FF8200] border border-[#FF8200] text-sm rounded-full hover:bg-orange-50"
        >
          +关注
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronLeft, Check as CheckIcon } from 'lucide-vue-next'

const activeTab = ref('followers')

const users = ref([
  {
    id: 1,
    name: '你是什么品种_',
    avatar: '/placeholder.svg?height=46&width=46',
    description: '心理学硕士在读',
    followers: '1',
  },
  {
    id: 2,
    name: '生活西化',
    avatar: '/placeholder.svg?height=46&width=46',
    verified: true,
    crown: true,
    level: 'II',
    description: '微博原创视频博主',
    followers: '21.4万',
  },
  {
    id: 3,
    name: '臭屁的蘑菇',
    avatar: '/placeholder.svg?height=46&width=46',
    description: '天天饿天天困天天睡',
    followers: '150',
  },
])
</script>

<style scoped>
.text-orange-50 {
  background-color: rgba(255, 130, 0, 0.1);
}
</style>
