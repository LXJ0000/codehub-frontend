<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
const theme = {
  token: {
    // colorPrimary: '#3b3c3d',
  },
}
</script>

<template>
  <a-config-provider :theme="theme" :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<style scoped></style>
