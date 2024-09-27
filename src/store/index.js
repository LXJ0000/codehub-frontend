// Vue3 推荐状态管理是 pinia (Vuex5)
import { createPinia } from 'pinia'
// 持久化存储插件
// 官方文档：https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/
import persist from 'pinia-plugin-persistedstate'

// 创建 store 实例
const store = createPinia()
// 使用持久化插件
store.use(persist)

// 导出 store 实例
export default store

// 导出所有模块
export * from './modules/account'
