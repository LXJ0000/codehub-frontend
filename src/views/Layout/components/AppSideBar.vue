<script lang="jsx">
import { defineComponent, h, resolveComponent, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SideBarItem',
  setup() {
    const router = useRouter() // 获取路由实例

    const openKeys = ref([]) // 展开的一级菜单 key
    const selectedKeys = ref([]) // 高亮的二级菜单 key

    // 获取路由表
    const routes = computed(() => {
      // 隐藏 hidden: true 的路由
      return router.options.routes.filter((v) => !v.hidden)
    })

    // 监听路由变化，更新选中的菜单
    watch(
      () => router.currentRoute.value,
      (route) => {
        // 设置一级菜单高亮
        openKeys.value = [route?.meta.parent]
        // 设置二级菜单高亮
        selectedKeys.value = [route?.path]
      },
      // 立即执行
      { immediate: true },
    )

    // 渲染侧栏菜单的函数
    const renderSubMenu = () => {
      // 递归渲染侧栏菜单
      function travel(_route, nodes = []) {
        // _route 是一个数组，里面是路由对象
        if (_route) {
          // 遍历路由对象
          _route.forEach((element) => {
            const { icon, title } = element.meta

            const node =
              element.children && element.children.length > 0 ? (
                // 一级菜单：渲染 标题 和 图标
                <a-sub-menu title={title} key={element.name} icon={h(resolveComponent(icon))}>
                  {/* 如果有子路由，递归渲染 */}
                  {travel(element.children)}
                </a-sub-menu>
              ) : (
                // 二级菜单：渲染 路由链接 和 标题
                <a-menu-item key={element.path}>
                  <router-link to={element.path}>{title}</router-link>
                </a-menu-item>
              )
            nodes.push(node)
          })
        }
        return nodes
      }
      return travel(routes.value)
    }

    return () => (
      <a-layout-sider theme="light" width="200" class="sidebar">
        {/* logo */}
        <h1 class="logo">
          <RouterLink to="/"> Logo </RouterLink>
        </h1>
        {/* 菜单 */}
        <a-menu
          v-model:openKeys={openKeys.value}
          v-model:selectedKeys={selectedKeys.value}
          theme="light"
          mode="inline"
        >
          {renderSubMenu()}
        </a-menu>
      </a-layout-sider>
    )
  },
})
</script>

<style scoped lang="scss">
.sidebar {
  // 侧栏菜单固定定位
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  height: 100vh;
  overflow-y: auto;
}
.logo {
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;

  &-img {
    width: 152px;
    height: 113px;
  }
}
</style>
