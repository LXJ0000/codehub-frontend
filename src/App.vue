<script setup>
// 导入中文包
import zhCN from 'ant-design-vue/es/locale/zh_CN'
const theme = {
  token: {
    colorPrimary: '#e15536',
  },
}
</script>

<template>
  <!-- 组件库全局配置 -->
  <a-config-provider :theme="theme" :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<style scoped></style>
