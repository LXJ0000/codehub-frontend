<template>
  <div class="mid-view">
    <SubNavView></SubNavView>
    <Feed></Feed>
  </div>
</template>

<script setup>
import Feed from './FeedView.vue'
import SubNavView from './SubNavView.vue'
</script>

<style scoped>
.mid-view {
  width: 600px;
  margin: 0 auto;
}
</style>
