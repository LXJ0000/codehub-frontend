import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false,
})

import { asyncRoutes } from './asyncRoutes'
import { constantRoutes } from './constantRoutes'

const router = createRouter({
  // 哈希路由
  history: createWebHashHistory(),
  routes: [
    ...constantRoutes, // 静态路由
    ...asyncRoutes, // 动态路由
  ],
})

router.beforeEach(() => {
  // 进度条开始
  NProgress.start()
})

// 全局的后置导航
router.afterEach((to) => {
  // 进度条结束
  NProgress.done()
  // 动态设置标题
  document.title = `${to.meta.title || import.meta.env.VITE_APP_TITLE}`
})

export default router
