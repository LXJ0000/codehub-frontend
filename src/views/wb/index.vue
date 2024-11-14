<template>
  <div class="app-container">
    <NavView />

    <div class="main-container">
      <LeftView />

      <main class="main-content">
        <router-view></router-view>
        <!-- <UserProfile /> -->
        <!-- <MidView /> -->
      </main>

      <RightView />
    </div>
  </div>
</template>

<script setup>
import NavView from '@/components/navView.vue'
import LeftView from './components/leftView.vue'
import RightView from './components/rightView.vue'
// import UserProfile from './components/UserProfile.vue'
// import MidView from './components/midView.vue'
</script>

<style>
.app-container {
  min-height: 100vh;
  background: #f2f2f2;
}

.main-container {
  display: flex;
  margin: 70px 150px 0;
  min-height: calc(100vh - 70px);
}

.main-content {
  flex: 1;
  margin-left: 210px;
  margin-right: 10px;
  min-width: 0;
}
</style>
