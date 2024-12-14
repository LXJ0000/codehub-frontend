<script setup>
defineProps({
  open: Boolean,
  selectedChat: Object,
})

const emit = defineEmits(['update:open'])
</script>

<template>
  <a-drawer
    :open="open"
    title="用户资料"
    placement="right"
    :width="300"
    @update:open="(value) => emit('update:open', value)"
  >
    <div v-if="selectedChat" class="user-profile">
      <a-avatar :size="64" :src="selectedChat.faceURL" />
      <h2 class="mt-4 text-xl font-bold">{{ selectedChat.showName }}</h2>
      <p class="mt-2 text-gray-600">QQ: 2925315190</p>
      <p class="text-gray-600">等级: 🌙</p>
      <p class="text-gray-600">个性签名: 黄昏中</p>
      <div class="mt-6 space-y-2">
        <a-button type="primary" block>发消息</a-button>
        <a-button block>音视频通话</a-button>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>
