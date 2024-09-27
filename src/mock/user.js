export default [
  // 模拟接口1
  {
    url: '/api/user/info', // 请求地址
    method: 'get', // 请求方法
    response: () => {
      // 返回数据
      return {
        code: 200,
        msg: 'ok',
        data: {
          // MockJS 数据占位符定义：http://mockjs.com/examples.html#DPD
          id: '@id', // 随机 id
          name: '黑马程序员', // 普通信息
        },
      }
    },
  },
  // 模拟接口2
  {
    url: '/api/user/menus',
    method: 'get',
    // 支持查询参数
    response: ({ query }) => {
      const data = []
      // 模拟管理员权限菜单
      if (query.role === 'admin') {
        data.push(
          {
            name: 'base',
            children: ['base-department', 'base-departwork', 'base-freight'],
          },
          {
            name: 'business',
            children: ['business-orderlist', 'business-businesslist'],
          },
          {
            name: 'car',
            children: ['car-carType', 'car-carList', 'car-carCheck'],
          },
          {
            name: 'dispatch',
            children: ['dispatch-task', 'dispatch-line', 'dispatch-pickWork', 'dispatch-dispatch'],
          },
          {
            name: 'employee',
            children: ['employee-courier', 'employee-driver', 'employee-workArrange'],
          },
        )
      }
      // 模拟普通用户菜单
      else {
        data.push({
          name: 'base',
          children: ['base-department'],
        })
      }
      // 返回数据
      return {
        code: 200,
        msg: `${query.role} - ok`,
        data,
      }
    },
  },
]
