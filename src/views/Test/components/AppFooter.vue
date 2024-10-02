<template>
  <a-layout-footer class="footer">
    © {{ new Date().getFullYear() }} Your Company Name. All rights reserved.
  </a-layout-footer>
</template>

<style scoped>
.footer {
  text-align: center;
  padding: 24px;
  background-color: var(--bg-200);
  color: var(--text-200);
}

@media (max-width: 768px) {
  .footer {
    padding: 12px;
    font-size: 12px;
  }
}
</style>
