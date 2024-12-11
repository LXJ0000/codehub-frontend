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

      <!-- Image Preview Grid -->
      <div v-if="uploadedImages.length > 0" class="grid grid-cols-6 gap-2 mb-4 w-1/2">
        <div
          v-for="(image, index) in uploadedImages"
          :key="index"
          class="relative aspect-square col-span-2"
        >
          <img
            :src="image.url"
            class="w-full h-full object-cover rounded-lg"
            alt="Uploaded image"
          />
          <button
            @click="removeImage(index)"
            class="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
          >
            <XIcon class="w-3 h-3 text-white" />
          </button>
        </div>
        <div
          class="relative aspect-square col-span-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400"
          @click="triggerImageUpload"
        >
          <PlusIcon class="w-6 h-6 text-gray-400" />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <div class="relative">
            <button
              class="flex items-center text-gray-600 hover:text-gray-800"
              @click="toggleEmojiPicker"
            >
              <SmileIcon class="w-5 h-5" />
              <span class="ml-1 text-sm">表情</span>
            </button>
            <EmojiPicker
              :is-visible="isEmojiPickerVisible"
              @select-emoji="handleEmojiSelect"
              @close="closeEmojiPicker"
            />
          </div>

          <button
            class="flex items-center text-gray-600 hover:text-gray-800"
            @click="triggerImageUpload"
          >
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
              postContent || uploadedImages.length > 0
                ? 'bg-[var(--accent-100)] hover:bg-[var(--accent-200)]'
                : 'bg-[var(--primary-100)] cursor-not-allowed',
            ]"
            :disabled="!postContent && uploadedImages.length === 0"
            @click="sendPost"
          >
            发送
          </button>
        </div>
      </div>
    </div>
    <input
      type="file"
      ref="fileInput"
      class="hidden"
      accept="image/*"
      multiple
      @change="handleImageUpload"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import {
  Smile as SmileIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Hash as HashIcon,
  Zap as ZapIcon,
  ChevronDown as ChevronDownIcon,
  X as XIcon,
  Plus as PlusIcon,
} from 'lucide-vue-next'
import { message } from 'ant-design-vue'
import * as api from '@/services/api'
import EmojiPicker from '@/components/EmojiPicker.vue'

const emit = defineEmits(['fetch-posts', 'remove-last'])

const postContent = ref('')
const isDropdownOpen = ref(false)
const selectedPrivacy = ref('公开')
const textareaHeight = ref(24)
const textarea = ref()
const fileInput = ref()
const uploadedImages = ref([])
const isEmojiPickerVisible = ref(false)

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

const triggerImageUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)

  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImages.value.push({
        url: e.target.result,
        file: file,
      })
    }
    reader.readAsDataURL(file)
  })

  event.target.value = ''
}

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1)
}

const sendPost = async () => {
  if (postContent.value || uploadedImages.value.length > 0) {
    try {
      const formData = new FormData()
      formData.append('title', 'title')
      formData.append('content', postContent.value)
      formData.append('status', 'publish')
      formData.append('abstract', 'abstract')
      uploadedImages.value.forEach((img) => {
        formData.append('files', img.file)
      })

      const response = await api.submitPost(formData)
      if (response.code === 0) {
        message.success('发布成功')
        postContent.value = ''
        uploadedImages.value = []
        emit('remove-last')
        emit('fetch-posts')
      }
    } catch (error) {
      console.error('Error submitting post:', error)
      message.error('发布失败')
    } finally {
      // Reset textarea height
      textareaHeight.value = 24
    }
  }
}

const toggleEmojiPicker = () => {
  isEmojiPickerVisible.value = !isEmojiPickerVisible.value
}

const closeEmojiPicker = () => {
  isEmojiPickerVisible.value = false
}

const handleEmojiSelect = (emoji) => {
  const textareaEl = textarea.value
  const start = textareaEl.selectionStart
  const end = textareaEl.selectionEnd
  const text = postContent.value
  postContent.value = text.substring(0, start) + emoji + text.substring(end)
  closeEmojiPicker()

  nextTick(() => {
    textareaEl.selectionStart = textareaEl.selectionEnd = start + emoji.length
    textareaEl.focus()
  })
}

// Close dropdown and emoji picker when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isDropdownOpen.value = false
    closeEmojiPicker()
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
