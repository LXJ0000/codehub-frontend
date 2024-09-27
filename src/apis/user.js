import { request } from '@/utils/request'

/**
 * 获取登录页面验证码图片
 * @param {String} key 唯一标识
 */
export const getCaptcha = (key) => {
  return request(`/captcha`, 'get', { key }, 'arraybuffer')
}

// 等价于
// import { http } from '@/utils/request'
// export const getCaptcha = (key) => {
//   return http({
//     method: 'get',
//     url: '/captcha',
//     params: { key },
//     responseType: 'arraybuffer',
//   })
// }
