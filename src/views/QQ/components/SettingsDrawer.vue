<script setup>
defineProps({
  open: Boolean,
})

// const emit = defineEmits(['update:open', 'handle-action'])
</script>

<template>
  <a-drawer
    :open="open"
    title="设置"
    placement="left"
    :width="300"
    @update:open="$emit('update:open', $event)"
  >
    <a-menu>
      <a-menu-item @click="$emit('handle-action', 'Account settings')">账号设置</a-menu-item>
      <a-menu-item @click="$emit('handle-action', 'Privacy settings')">隐私设置</a-menu-item>
      <a-menu-item @click="$emit('handle-action', 'Notification settings')">消息设置</a-menu-item>
      <a-menu-item @click="$emit('handle-action', 'General settings')">通用设置</a-menu-item>
      <a-menu-item @click="$emit('handle-action', 'About')">关于</a-menu-item>
      <a-menu-item @click="$emit('handle-action', 'Logout')">退出账号</a-menu-item>
    </a-menu>
  </a-drawer>
</template>
