import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAccountStore = defineStore(
  'account', // store id
  () => {
    // store state
    const role = ref('admin')
    const token = ref('token-string')

    // store actions
    const changeRole = (payload) => {
      role.value = payload
      location.reload()
    }

    // return store state and actions
    return {
      role,
      token,
      changeRole,
    }
  },
  {
    // 持久化存储 role 和 token
    // 官方文档：https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/config.html#paths
    persist: {
      paths: ['role', 'token'],
    },
  },
)
