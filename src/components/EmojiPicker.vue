<template>
  <div v-if="isVisible" class="emoji-picker-container">
    <EmojiPicker :native="true" @select="onEmojiSelect" />
  </div>
</template>

<script setup>
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const { isVisible } = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-emoji', 'close'])

const onEmojiSelect = (emoji) => {
  emit('select-emoji', emoji.i)
  emit('close')
}
</script>

<style scoped>
.emoji-picker-container {
  position: absolute;
  /* bottom: 100%; */
  /* left: 0; */
  margin-bottom: 8px;
  z-index: 1000;
  width: 400px; /* 增加宽度 */
  height: 350px; /* 增加高度 */
}

.emoji-picker-container :deep(.v3-emoji-picker) {
  width: 100%;
  height: 100%;
}
</style>
