import router from '@/router'
import { useUserStore } from './store/modules/user'
import { isTokenExpired } from '@/utils/checkToken'

const whiteList = ['/login', '/404', '/register']
router.beforeEach(async (to, from, next) => {
  const accessToken = useUserStore().accessToken
  const refreshToken = useUserStore().refreshToken
  const refreshTokenFunc = useUserStore().refreshTokenFunc

  if (accessToken && isTokenExpired(accessToken)) {
    await refreshTokenFunc({ refresh_token: refreshToken })
  }
  if (accessToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
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
