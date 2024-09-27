export default {
  name: 'base',
  path: '/base',
  component: () => import('@/views/Layout/index.vue'),
  redirect: '/base/department',
  meta: { title: '基础数据管理', icon: 'BarChartOutlined', order: 1 },
  children: [
    {
      name: 'base-department',
      path: '/base/department',
      meta: { title: '机构管理', parent: 'base' },
      // component: () => import('@/views/Base/Department/index.vue'),
    },
    {
      name: 'base-departwork',
      path: '/base/departwork',
      meta: { title: '机构作业范围', parent: 'base' },
      // component: () => import('@/views/Base/DepartWork/index.vue'),
    },
    {
      name: 'base-freight',
      path: '/base/freight',
      meta: { title: '运费管理', parent: 'base' },
      // component: () => import('@/views/Base/Freight/index.vue'),
    },
  ],
}
