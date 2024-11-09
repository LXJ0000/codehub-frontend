<script setup>
defineProps({
  open: Boolean,
})

// const emit = defineEmits(['update:open', 'handle-action'])
</script>

<template>
  <a-drawer
    :open="open"
    title="更多选项"
    placement="right"
    :width="300"
    @update:open="$emit('update:open', $event)"
  >
    <a-menu>
      <a-menu-item @click="$emit('handle-action', 'Pin chat')">置顶聊天</a-menu-item>
      <a-menu-item @click="$emit('handle-action', 'Mute notifications')">消息免打扰</a-menu-item>
      <a-menu-item @click="$emit('handle-action', 'Clear chat history')">清空聊天记录</a-menu-item>
      <a-menu-item @click="$emit('handle-action', 'Block user')">屏蔽此人</a-menu-item>
      <a-menu-item @click="$emit('handle-action', 'Delete chat')">删除好友</a-menu-item>
    </a-menu>
  </a-drawer>
</template>
