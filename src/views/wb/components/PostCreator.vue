<template>
  <div class="main">
    <div class="max-w-2xl mx-auto">
      <div class="bg-gray-50 rounded-lg p-4 mb-3 relative">
        <textarea
          v-model="postContent"
          placeholder="有什么新鲜事想分享给大家?"
          class="w-full bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-500 text-sm"
          :style="{ height: textareaHeight + 'px' }"
          @input="adjustTextareaHeight"
          ref="textarea"
        ></textarea>
        <div class="absolute bottom-2 right-2 text-xs text-gray-500">
          {{ characterCount }} / 2000
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <button class="flex items-center text-gray-600 hover:text-gray-800">
            <SmileIcon class="w-5 h-5" />
            <span class="ml-1 text-sm">表情</span>
          </button>

          <button class="flex items-center text-gray-600 hover:text-gray-800">
            <ImageIcon class="w-5 h-5" />
            <span class="ml-1 text-sm">图片</span>
          </button>

          <button class="flex items-center text-gray-600 hover:text-gray-800">
            <VideoIcon class="w-5 h-5" />
            <span class="ml-1 text-sm">视频</span>
          </button>

          <button class="flex items-center text-gray-600 hover:text-gray-800">
            <HashIcon class="w-5 h-5" />
            <span class="ml-1 text-sm">话题</span>
          </button>

          <button class="flex items-center text-gray-600 hover:text-gray-800">
            <ZapIcon class="w-5 h-5" />
            <span class="ml-1 text-sm">头条文章</span>
          </button>
        </div>

        <div class="flex items-center space-x-3">
          <div class="relative">
            <button
              @click="toggleDropdown"
              class="flex items-center text-gray-600 hover:text-gray-800"
            >
              <span class="text-sm">{{ selectedPrivacy }}</span>
              <ChevronDownIcon class="w-4 h-4 ml-1" />
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 z-10"
            >
              <button
                v-for="option in privacyOptions"
                :key="option"
                @click="selectPrivacy(option)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {{ option }}
              </button>
            </div>
          </div>

          <button
            :class="[
              'px-6 py-1.5 text-white rounded-full transition-colors',
              postContent
                ? 'bg-[var(--accent-100)] hover:bg-[var(--accent-200)]'
                : 'bg-[var(--primary-100)] cursor-not-allowed',
            ]"
            :disabled="!postContent"
            @click="sendPost"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Smile as SmileIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Hash as HashIcon,
  Zap as ZapIcon,
  ChevronDown as ChevronDownIcon,
} from 'lucide-vue-next'
import { message } from 'ant-design-vue'
import * as api from '@/services/api'
import { defineEmits } from 'vue'

const emit = defineEmits(['fetch-posts']) // 父子组件传递函数示例

const fetchPosts = () => {
  emit('fetch-posts')
}

const postContent = ref('')
const isDropdownOpen = ref(false)
const selectedPrivacy = ref('公开')
const textareaHeight = ref(24) // Initial height (1 line)
const textarea = ref(null)

const privacyOptions = ['公开', '粉丝', '好友圈', '仅自己可见', '群可见']

const characterCount = computed(() => postContent.value.length)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectPrivacy = (option) => {
  selectedPrivacy.value = option
  isDropdownOpen.value = false
}

const adjustTextareaHeight = () => {
  const element = textarea.value
  element.style.height = 'auto'
  element.style.height = element.scrollHeight + 'px'
  textareaHeight.value = element.scrollHeight
}

const sendPost = async () => {
  if (postContent.value) {
    try {
      const response = await api.submitPost(postContent.value)
      if (response.code === 0) {
        message.success('发布成功')
        postContent.value = ''
        fetchPosts()
      }
    } catch (error) {
      console.error('Error submitting post:', error)
      message.error('发布失败')
    }
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
.main {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 10px;
}
textarea::placeholder {
  font-size: 14px;
}
</style>
