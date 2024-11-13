export const constantRoutes = [
  {
    path: '/wb',
    name: 'wb',
    component: () => import('@/views/wb/index.vue'),
    meta: { title: 'wb', icon: 'wb', hidden: true },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/Chat/index.vue'),
    meta: { title: 'Chat', icon: 'Chat', hidden: true },
  },
  {
    path: '/user/:id',
    name: 'UserProfile',
    component: () => import('@/views/UserProfile/index.vue'),
    meta: { title: '用户信息', icon: 'HomeOutlined', hidden: true },
  },
  {
    path: '/user/:id/followers',
    name: 'UserFollowers',
    component: () => import('@/views/UserFollowers/index.vue'),
    meta: { title: '粉丝列表', icon: 'HomeOutlined', hidden: true },
  },
  {
    path: '/user/:id/following',
    name: 'UserFollowing',
    component: () => import('@/views/UserFollowing/index.vue'),
    meta: { title: '关注列表', icon: 'HomeOutlined', hidden: true },
  },
  {
    component: () => import('@/views/QQ/index.vue'),
    name: 'qq',
    path: '/qq',
    meta: { title: 'QQ', icon: 'HomeOutlined' },
    hidden: true, // 侧边栏隐藏该路由
  },
  {
    component: () => import('@/views/Login/index.vue'),
    name: 'login',
    path: '/login',
    meta: { title: '登录', icon: 'HomeOutlined' },
    hidden: true, // 侧边栏隐藏该路由
  },
  {
    component: () => import('@/views/Register/index.vue'),
    name: 'register',
    path: '/register',
    meta: { title: '注册', icon: 'HomeOutlined' },
    hidden: true, // 侧边栏隐藏该路由
  },
  {
    component: () => import('@/views/Test/index.vue'),
    name: 'test',
    path: '/test',
    meta: { title: '测试', icon: 'HomeOutlined' },
    hidden: true, // 侧边栏隐藏该路由
  },
  {
    component: () => import('@/views/Post/index.vue'),
    name: 'post',
    path: '/post',
    meta: { title: '动态首页', icon: 'HomeOutlined' },
    hidden: true, // 侧边栏隐藏该路由
  },
  {
    component: () => import('@/views/Layout/index.vue'),
    name: 'dashboard',
    path: '/',
    // redirect: '/login',
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
