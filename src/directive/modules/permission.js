import { useAccountStore } from '@/store'

// 权限校验方法
function checkPermission(el, { value }) {
  // 获取用户 Store
  const accountStore = useAccountStore()
  // 获取用户 Store 的角色
  const currentRole = accountStore.role

  // 传入的权限值要求是一个数组
  if (Array.isArray(value) && value.length > 0) {
    // 判断用户角色是否有权限
    const hasPermission = value.includes(currentRole)
    // 没有权限则删除当前dom
    if (!hasPermission) el.remove()
  } else {
    throw new Error(`格式错误，正确用法 v-permission="['admin','employee']"`)
  }
}

export default {
  mounted(el, binding) {
    checkPermission(el, binding)
  },
  updated(el, binding) {
    checkPermission(el, binding)
  },
}
