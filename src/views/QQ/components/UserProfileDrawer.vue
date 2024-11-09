<script setup>
defineProps({
  open: Boolean,
  selectedChat: Object,
})

// const emit = defineEmits(['update:open'])
</script>

<template>
  <a-drawer
    :open="open"
    title="用户资料"
    placement="right"
    :width="300"
    @update:open="$emit('update:open', $event)"
  >
    <div v-if="selectedChat">
      <a-avatar :size="64" :src="selectedChat.avatar" />
      <h2>{{ selectedChat.name }}</h2>
      <p>QQ: 2925315190</p>
      <p>等级: 🌙</p>
      <p>个性签名: 黄昏中</p>
      <a-button type="primary">发消息</a-button>
      <a-button>音视频通话</a-button>
    </div>
  </a-drawer>
</template>
