import permission from './modules/permission'

export default {
  install(app) {
    // 注册全局指令
    app.directive('permission', permission)
  },
}
