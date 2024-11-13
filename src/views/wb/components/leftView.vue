<template>
  <aside class="left-sidebar">
    <a-menu mode="inline" :selectedKeys="[selectedKey]">
      <a-menu-item v-for="item in menuItems" :key="item.key">
        <img
          src="https://tvax1.sinaimg.cn/crop.0.0.1079.1079.180/006UebRdly8hket8gaah4j30tz0tzmz2.jpg?KID=imgbed,tva&Expires=1731430147&ssig=4qtJVzbHnZ"
          class="menu-icon"
          alt=""
        />
        <span>{{ item.label }}</span>
      </a-menu-item>
    </a-menu>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { Flame, Clock, Search, User, TrendingUp, Star, MoreHorizontal } from 'lucide-vue-next'

const selectedKey = ref('hot-recommend')

const menuItems = [
  { key: 'hot-recommend', label: '热门推荐', icon: Flame },
  { key: 'hot-list', label: '热门榜单', icon: Clock },
  { key: 'hot-search', label: '微博热搜', icon: Search },
  { key: 'my', label: '我的', icon: User },
  { key: 'hot-topics', label: '热搜', icon: TrendingUp },
  { key: 'entertainment', label: '文娱', icon: Star },
  { key: 'more', label: '更多', icon: MoreHorizontal },
]
</script>

<style scoped>
.left-sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  height: calc(100vh - 60px);
  position: fixed;
  overflow-y: auto;
}

.menu-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
}

:deep(.ant-menu-item) {
  height: 40px;
  line-height: 40px;
  margin: 4px 0;
}

:deep(.ant-menu-item-selected) {
  background-color: #f0f7ff !important;
  color: #a5d5ff !important;
}
</style>
