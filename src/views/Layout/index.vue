<script setup>
import { ref, provide } from 'vue'
import AppSideBar from './components/AppSideBar.vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

const isDarkMode = ref(false)
const isSiderCollapsed = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode', isDarkMode.value)
}

const toggleSider = () => {
  isSiderCollapsed.value = !isSiderCollapsed.value
}

provide('isDarkMode', isDarkMode)
provide('toggleDarkMode', toggleDarkMode)
provide('isSiderCollapsed', isSiderCollapsed)
provide('toggleSider', toggleSider)
</script>

<template>
  <a-layout class="layout">
    <AppSideBar />
    <a-layout :style="{ marginLeft: isSiderCollapsed ? '0' : '200px' }">
      <AppHeader />
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <AppFooter />
    </a-layout>
  </a-layout>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}

.content {
  padding: 24px;
  min-height: 280px;
  /* margin-top: 64px; */
}

@media (max-width: 768px) {
  .content {
    margin-top: 112px;
  }
}
</style>
