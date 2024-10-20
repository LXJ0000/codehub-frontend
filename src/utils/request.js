import axios from 'axios'
import { message } from 'ant-design-vue'
// import { useAccountStore } from '@/store'

// 导入路由
import router from '@/router'
import { useUserStore } from '@/store/modules/user'

// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 10000, // timeout
})

// axios 请求拦截器
// https://axios-http.com/zh/docs/interceptors
http.interceptors.request.use(
  (config) => {
    const { accessToken } = useUserStore()
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    // const { token } = useAccountStore()
    // if (token) {
    //   config.headers['Authorization'] = token
    // }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// axios 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 提取响应数据
    const data = response.data
    // console.log(data)
    // 如果是下载文件(图片等)，直接返回数据
    if (data instanceof ArrayBuffer) {
      return data
    }
    // code 为非 200 是抛错，可结合自己业务进行修改
    const { code, msg } = data
    if (code !== 0) {
      message.error(msg)
      return Promise.reject(msg)
    }
    // 响应数据
    return data
  },
  (error) => {
    const response = error.response
    const status = response && response.status
    // 和后端约定的3种状态码会跳转登录，可结合自己业务进行修改
    // if ([400, 401, 403].includes(status)) {
    //   if (status === 400) {
    //     message.warning('权限不足')
    //   } else if (status === 401) {
    //     message.warning('登录状态过期')
    //   }
    //   // 清理用户信息 token，重置权限路由等，可结合自己业务进行修改
    //   // TODO:...
    //   // 跳转登录页
    //   router.push('/login')
    //   return Promise.reject(error)
    // } else {
    //   return Promise.reject(error)
    // }
    console.log(1)
    if ([401].includes(status)) {
      if (status === 401) {
        message.warning('登录状态过期')
      }
      // 清理用户信息 token，重置权限路由等，可结合自己业务进行修改
      // TODO:...
      // 跳转登录页
      router.push('/login')
      return Promise.reject(error)
    } else {
      return Promise.reject(error)
    }
  },
)

// 封装请求
const request = (data) => {
  return http({
    url: data.url,
    method: data.method,
    [data.method.toUpperCase() === 'GET' ? 'params' : 'data']: data,
    responseType: data.type,
  })
}

// 导出 http 和 request
export { http, request }
