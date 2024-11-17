<template>
  <nav class="sub-nav">
    <a-menu mode="horizontal" :selectedKeys="[selectedKey]">
      <a-menu-item v-for="item in navItems" :key="item.key" @click="handleNavClick(item.key)">
        {{ item.label }}
      </a-menu-item>
      <a-menu-item key="more">
        <MoreHorizontal class="more-icon" />
      </a-menu-item>
    </a-menu>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'

const selectedKey = ref('热门')

const navItems = [
  { key: '热门', label: '热门' },
  { key: '实时', label: '实时' },
  { key: '同城', label: '同城' },
  { key: '榜单', label: '榜单' },
  { key: '国际', label: '国际' },
  { key: '明星', label: '明星' },
  { key: '搞笑', label: '搞笑' },
]

const handleNavClick = (key) => {
  selectedKey.value = key
}
</script>

<style scoped>
.sub-nav {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
}

:deep(.ant-menu-horizontal) {
  border-bottom: none;
  justify-content: center;
  line-height: 46px;
}

.more-icon {
  width: 16px;
  height: 16px;
}

:deep(.ant-menu-item-selected) {
  background-color: white !important;
}

:deep(.ant-menu-item-active) {
  background-color: white !important;
}

.ant-menu-horizontal {
  border-radius: 8px;
}
</style>
