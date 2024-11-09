<script setup>
defineProps({
  open: Boolean,
})

const emit = defineEmits(['update:open', 'upload-file'])

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('upload-file', file)
  }
  emit('update:open', false)
}

const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    emit('upload-file', file)
  }
  emit('update:open', false)
}
</script>

<template>
  <a-modal
    :open="open"
    title="上传图片或视频"
    :footer="null"
    @update:open="$emit('update:open', $event)"
  >
    <div class="upload-area" @dragover.prevent @drop="handleDrop">
      <p>拖放文件到这里或者</p>
      <input type="file" @change="handleFileUpload" accept="image/*,video/*" />
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
}

.upload-area:hover {
  border-color: #40a9ff;
}
</style>
