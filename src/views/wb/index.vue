<template>
  <div class="app-container">
    <NavView />
    <div class="main-container">
      <div class="content-wrapper">
        <LeftView class="left-view" />

        <main class="main-content">
          <router-view></router-view>
        </main>

        <RightView class="right-view" />
      </div>
    </div>
  </div>
</template>

<script setup>
import NavView from '@/components/navView.vue'
import LeftView from './components/leftView.vue'
import RightView from './components/rightView.vue'
</script>

<style>
.app-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-container {
  padding-top: 70px; /* Space for fixed NavView */
}

.content-wrapper {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  gap: 10px;
  padding: 0 20px;
}

.left-view {
  width: 188px;
  position: fixed;
}

.main-content {
  width: 600px;
  margin-left: 208px; /* 188px + 20px gap */
  min-height: calc(100vh - 60px);
}

.right-view {
  width: 300px;
}

/* Hide right sidebar first */
@media (max-width: 1185px) {
  .right-view {
    display: none;
  }

  .content-wrapper {
    max-width: 880px;
  }
}

/* Then hide left sidebar and adjust main content */
@media (max-width: 800px) {
  .left-view {
    display: none;
  }

  .main-content {
    margin-left: 0;
  }

  .content-wrapper {
    max-width: 640px;
    padding: 0 10px;
  }
}

::-webkit-scrollbar {
  width: 0px;
  height: 5px;
}
</style>
