import Vue from 'vue'
import Router from 'vue-router'
import app from './app'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/view/login/login')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/view/login/login')
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/article/list',
      component: () => import('@/view/admin'),
      children: [
        ...app
      ]
    },
    {
      path: '/',
      name: 'index',
      component: () => import('@/view/page'),
      redirect: '/',
      children: [
        { path: '/', title: '首页', name: 'index_index', component: () => import('@/view/page/index') },
        { path: 'classify', title: '分类', name: 'classify_index', component: () => import('@/view/page/classify') },
        { path: 'about', title: '关于', name: 'about_index', component: () => import('@/view/page/about') },
        { path: 'detail', title: '详情', name: 'detail_index', component: () => import('@/view/page/detail') },
        { path: 'rest', title: '小憩一下', name: 'rest_index', component: () => import('@/view/page/rest') }
      ]
    },
    {
      path: '*',
      title: 'error-404',
      name: 'error-404',
      meta: {
        title: '404-页面不存在'
      },
      component: () => import('@/view/error/error-404.vue')
    }
  ]
})
// 注册全局钩子用来'拦截导航'
router.beforeEach((to, form, next) => {
  // 如果路由中存在'/admin/'（进入后台），则需要判断是否登录
  if (to.fullPath.indexOf('/admin/') !== -1) {
    // 检查loginToken 是否存在
    if (localStorage.getItem('loginToken')) {
      const arr = localStorage.getItem('loginToken').split('&&expireTime:')
      // token 为过期 则继续执行
      if (arr[1] > Date.now()) {
        next()
      } else {
        localStorage.removeItem('loginToken')
        next({
          path: '/login',
          name: 'login'
        })
      }
    } else {
      next({
        path: '/login',
        name: 'login'
      })
    }
  } else {
    next()
  }
})
export default router
