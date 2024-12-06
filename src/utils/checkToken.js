import { jwtDecode } from 'jwt-decode'

// 检查 token 是否过期
export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    console.log('log.', decoded.exp, currentTime, '过期时间')
    return decoded.exp < currentTime
  } catch (error) {
    console.error('Failed to decode token:', error)
    return true
  }
}