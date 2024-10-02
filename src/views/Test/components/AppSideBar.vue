<script setup>
import { ref, watch, inject, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isDarkMode = inject('isDarkMode', ref(false))
const isSiderCollapsed = inject('isSiderCollapsed', ref(false))

const openKeys = ref([])
const selectedKeys = ref([])

const routes = computed(() => {
  return router.options.routes.filter((v) => !v.meta?.hidden)
})

watch(
  () => router.currentRoute.value,
  (route) => {
    if (route.meta && route.meta.parent) {
      openKeys.value = [route.meta.parent]
    }
    selectedKeys.value = [route.path]
  },
  { immediate: true },
)
</script>

<template>
  <a-layout-sider
    v-model:collapsed="isSiderCollapsed"
    :trigger="null"
    collapsible
    class="sidebar"
    :theme="isDarkMode ? 'dark' : 'light'"
  >
    <div class="logo">Logo</div>
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      :theme="isDarkMode ? 'dark' : 'light'"
      mode="inline"
    >
      <template v-for="route in routes" :key="route.path">
        <template v-if="route.children && route.children.length > 0">
          <a-sub-menu :key="route.name">
            <template #title>
              <span v-if="route.meta && route.meta.icon" :class="route.meta.icon" />
              <span>{{ route.meta && route.meta.title }}</span>
            </template>
            <a-menu-item v-for="child in route.children" :key="child.path">
              <router-link :to="child.path">{{ child.meta && child.meta.title }}</router-link>
            </a-menu-item>
          </a-sub-menu>
        </template>
        <template v-else>
          <a-menu-item :key="route.path">
            <router-link :to="route.path">
              <span v-if="route.meta && route.meta.icon" :class="route.meta.icon" />
              <span>{{ route.meta && route.meta.title }}</span>
            </router-link>
          </a-menu-item>
        </template>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<style scoped>
.sidebar {
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
}

.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-100);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 999;
  }
}
</style>
