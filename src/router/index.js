import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由映射数组
const routes = [
  {
    path: '/login',
    name: 'login',
    // 路由懒加载: 提交首屏加载速度
    // - 如果使用原始导入方式，webpack打包的时候会把所有的组件打包成1个js文件，页面刚刷新的时候就把这个js加载完毕了
    // - 而使用懒加载，webpack会把懒加载的组件单独打包成一个一个的js文件，在用户跳转到对应的逐渐的时候，才会加载
    component: () => import('@/views/login')
  },
  {
    path: '/',
    redirect: '/home', // 重定向
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'home', // 默认子路由
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  }
]
// 实例化路由对象
const router = new VueRouter({
  routes
})

export default router
