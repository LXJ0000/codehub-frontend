<template>
  <div class="app-container">
    <NavView />

    <div class="main-container">
      <LeftView />

      <main class="main-content">
        <MidView />
        <router-view></router-view>
      </main>

      <RightView />
    </div>
  </div>
</template>

<script setup>
import NavView from './components/navView.vue'
import LeftView from './components/leftView.vue'
import MidView from './components/midView.vue'
import RightView from './components/rightView.vue'
</script>

<style>
.app-container {
  min-height: 100vh;
  background: #f2f2f2;
}

.main-container {
  display: flex;
  /* margin-top: 100px; */
  margin: 75px 150px 0 150px;
  margin-top: 70px !important;
  min-height: calc(100vh - 60px);
  /* position: relative; */
}

.main-content {
  flex: 1;
  /* margin: 0 100px; */
  margin-left: 200px;
  min-width: 0;
}
</style>
