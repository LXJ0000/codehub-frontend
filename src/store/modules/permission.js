import { defineStore } from 'pinia'
import { ref } from 'vue'
import { asyncRoutes } from '@/router/asyncRoutes'
import { getRouter } from '@/services/login'

export const usePermissionStore = defineStore(
  'permission', // store id
  () => {
    const currentRole = ref('admin')
    const permissionRoutes = ref([])
    const setCurrentRole = () => {
      currentRole.value = currentRole.value === 'admin' ? 'employee' : 'admin'
    }
    const getPermissionRoutes = () => {
      const { data: menus } = getRouter({
        role: currentRole.value,
      })
      const routes = []
      menus.forEach((item) => {
        const filterRoute = asyncRoutes.find((route) => route.name === item.name)
        if (filterRoute) {
          let children = []
          if (item.children?.length) {
            item.children.forEach((childItem) => {
              const secondRoute = filterRoute.children.find(
                (childRoute) => childRoute.name === childItem,
              )
              children.push(secondRoute)
            })
          }
          filterRoute.children = children
          routes.push(filterRoute)
        }
        permissionRoutes.value = routes
      })
      return permissionRoutes.value
    }
    return {
      permissionRoutes,
      currentRole,
      setCurrentRole,
      getPermissionRoutes,
    }
  },
  {
    // 持久化存储 role 和 token
    // 官方文档：https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/config.html#paths
    persist: {
      paths: ['currentRole'],
    },
  },
)
