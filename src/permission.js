import router from '@/router'
import { usePermissionStore } from './store/modules/permission'
import { useAccountStore } from './store'

const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
  const { token } = useAccountStore
  const permissionStore = usePermissionStore
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (!permissionStore.permissionRoutes?.length) {
        const routes = await permissionStore.getPermissionRoute()
        routes.forEach((item) => router.addRoute(item))
        return next(to.path)
      }
      next()
    }
  } else {
    if (!whiteList.includes(to.path)) {
      next({ path: '/login' })
    } else {
      next()
    }
  }
})
