export const constantRoutes = [
  {
    component: () => import('@/views/Login/index.vue'),
    name: 'login',
    path: '/login',
    meta: { title: '登录', icon: 'HomeOutlined' },
    hidden: true, // 侧边栏隐藏该路由
  },
  {
    component: () => import('@/views/Layout/index.vue'),
    name: 'dashboard',
    path: '/',
    redirect: '/dashboard',
    meta: { title: '工作台', icon: 'HomeOutlined', order: 0 },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { title: '数据面板', parent: 'dashboard' },
      },
    ],
  },
  // 捕获所有路由或 404 Not found 路由
  // https://router.vuejs.org/guide/essentials/dynamic-matching.html#Catch-all-404-Not-found-Route
  {
    path: '/:pathMatch(.*)',
    component: () => import('@/views/NotFound/index.vue'),
    meta: { title: '页面不存在' },
    hidden: true, // 侧边栏隐藏该路由
  },
]
