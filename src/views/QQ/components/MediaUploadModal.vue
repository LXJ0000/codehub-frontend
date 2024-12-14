<script setup>
import { ref } from 'vue'

defineProps({
  open: Boolean,
})

const emit = defineEmits(['update:open', 'upload-file'])

const dragOver = ref(false)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('upload-file', file)
  }
  emit('update:open', false)
}

const handleDrop = (event) => {
  event.preventDefault()
  dragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    emit('upload-file', file)
  }
  emit('update:open', false)
}

const handleDragOver = (event) => {
  event.preventDefault()
  dragOver.value = true
}

const handleDragLeave = () => {
  dragOver.value = false
}
</script>

<template>
  <a-modal
    :open="open"
    title="上传图片或视频"
    :footer="null"
    @update:open="$emit('update:open', $event)"
  >
    <div
      class="upload-area"
      :class="{ 'drag-over': dragOver }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <p>拖放文件到这里或者</p>
      <a-upload :show-upload-list="false" :before-upload="() => false" @change="handleFileUpload">
        <a-button type="primary">选择文件</a-button>
      </a-upload>
    </div>
  </a-modal>
</template>

<style scoped>
.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #40a9ff;
}

.upload-area p {
  margin-bottom: 16px;
}
</style>
