import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { logoutApi } from '@/services/login'
import router from '@/router'
import { loginSms } from '@/services/login'

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref()
    const accessToken = ref()
    const refreshToken = ref()
    const login = async (data) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          email: data.email,
          password: data.password,
        })
        if (response.data.code === 0) {
          user.value = response.data.data.user_detail
          accessToken.value = response.data.data.access_token
          refreshToken.value = response.data.data.refresh_token
          return true
        } else {
          throw new Error(response.data.error || '登录失败')
        }
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    }
    const phoneLogin = async (data) => {
      try {
        const response = await loginSms(data)
        console.log(response)
        if (response.code === 0) {
          user.value = response.data.user_detail
          accessToken.value = response.data.access_token
          refreshToken.value = response.data.refresh_token
          return true
        } else {
          throw new Error(response.error || '登录失败')
        }
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    }
    const register = async (data) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/signup`, {
          user_name: data.username,
          email: data.email,
          password: data.password,
        })
        if (response.data.code === 0) {
          return true
        } else {
          throw new Error(response.data.error || '注册失败')
        }
      } catch (error) {
        console.error('注册失败:', error)
        throw error
      }
    }

    const logout = async () => {
      console.log(accessToken.value)
      try {
        console.log(1)
        const response = await logoutApi()
        console.log(response)
        // const response = await axios.post(
        //   `${API_BASE_URL}/logout`,
        //   {},
        //   {
        //     headers: {
        //       Authorization: `Bearer ${accessToken.value}`,
        //     },
        //   },
        // )
        if (response.code === 0) {
          user.value = null
          accessToken.value = null
          refreshToken.value = null
          router.push('/login')
          return true
        } else {
          throw new Error(response.data.error || '退出登录失败')
        }
      } catch (error) {
        console.error('退出登录失败:', error)
        throw error
      }
    }
    const refreshTokenFunc = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/refresh`,
          {
            refresh_token: refreshToken.value,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`,
            },
          },
        )
        if (response.data.code === 0) {
          accessToken.value = response.data.data.access_token
          refreshToken.value = response.data.data.refresh_token
          return true
        } else {
          throw new Error(response.data.error || '刷新token失败')
        }
      } catch (error) {
        console.error('刷新token失败:', error)
        throw error
      }
    }

    return {
      user,
      accessToken,
      refreshToken,
      login,
      register,
      logout,
      refreshTokenFunc,
      phoneLogin,
    }
  },
  {
    // 持久化存储 role 和 token
    // 官方文档：https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/config.html#paths
    persist: {
      paths: ['user', 'accessToken', 'refreshToken'],
    },
  },
)
