// 路由配置文件
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/reg',
    component: () => import('@/views/register')
    // webpack提供import函数来路由懒加载导入组件
    // 路由懒加载，就是页面路由路径切换到/reg,才去加载对应组件代码
    // 好处:让首页加载文件体积更新，打开更快
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // 默认打开后就是这个主页
    component: () => import('@/views/layout'),
    redirect: '/home', // 默认显示首页的二级路由
    children: [
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'user-info',
        component: () => import('@/views/user/userInfo')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/user/userAvatar')
      },
      {
        path: 'user-pwd',
        component: () => import('@/views/user/userPwd')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 设置白名单 登录和注册没有token也直接放行
const whiteList = ['/login', '/reg']

// 前置路由守卫,路由跳转的时候获取新的用户信息
router.beforeEach((to, from, next) => {
  const token = store.state.token
  // 查看有token值才去获取用户信息
  // if (token && !store.state.userInfo.username) {
  //   store.dispatch('getUserInfo')
  // }
  // next()
  if (token) {
    // 有token 登陆过了 可以往下走
    if (!store.state.userInfo.username) {
      store.dispatch('getUserInfo')
    }
    next() // 路由放行
  } else {
    // 如果无token但去的是白名单路径 放行
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 其他页面拦截
      next('/login')
    }
  }
})

export default router
