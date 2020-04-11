import Vue from 'vue'
import Vuex from 'vuex'
import appRouter from '@/router/app'

Vue.use(Vuex)
// pageTagsList
// 配置路由信息
const app = {
  state: {
    isFullScreen: false,
    pageOpenedList: [{
      title: '文章列表',
      path: '/admin/article/list',
      name: 'article_list'
    }], // 当前面包屑数组 默认为文章列表页
    currentPath: [{
      title: '文章列表',
      path: '/admin/article/list',
      name: 'article_list'
    }],
    openedSubmenuArr: [], // 要展开的菜单数组
    menuList: appRouter // 侧边栏
  },
  mutations: {
    changePage ({openedSubmenuArr, currentPath, pageOpenedList}, res) {
      openedSubmenuArr = [res.openNames]
      if (pageOpenedList.length) {
        var mark = false
        for (let i = 0, len = pageOpenedList.length; i < len; i++) {
          if (pageOpenedList[i].name === res.toPath.name) {
            mark = true
          }
        }
        if (!mark) {
          pageOpenedList.push({
            title: res.toPath.title,
            path: res.toPath.fullPath,
            name: res.toPath.name
          })
        }
      } else {
        pageOpenedList.push({
          title: res.toPath.title,
          path: res.toPath.fullPath,
          name: res.toPath.name
        })
      }
      if (currentPath.length)currentPath.splice(0, currentPath.length)
      currentPath.push({
        title: res.toPath.title,
        path: res.toPath.fullPath,
        name: res.toPath.name
      })
      var StorageData = {
        pageOpenedList,
        openedSubmenuArr,
        currentPath
      }
      sessionStorage.setItem('appRouterStorage', JSON.stringify(StorageData))
    },
    RouterStorage ({ openedSubmenuArr, currentPath, pageOpenedList }, res) {
      if (res && res.constructor === Object) {
        // 删除原来的数组，将缓存的数组赋值给pageOpenedList
        pageOpenedList.splice(0, pageOpenedList.length, ...res.pageOpenedList)
        openedSubmenuArr.splice(0, openedSubmenuArr.length, ...res.openedSubmenuArr)
        currentPath.splice(0, currentPath.length, ...res.currentPath)
      }
    },
    changeCurrentPath ({ openedSubmenuArr, currentPath, pageOpenedList }, res) {
      if (res && res.constructor === Object) {
        currentPath[0] = {
          name: res.name,
          path: res.fullPath,
          title: res.title
        }
        openedSubmenuArr[0] = [res.fullPath.split('/')[2]]
        var StorageData = {
          pageOpenedList,
          openedSubmenuArr,
          currentPath
        }
        sessionStorage.setItem('appRouterStorage', JSON.stringify(StorageData))
      }
    },
    clearAllPage ({ openedSubmenuArr, currentPath, pageOpenedList }, res) {
      pageOpenedList = [{
        title: '文章列表',
        path: '/admin/article/list',
        name: 'article_list'
      }]
      currentPath = [{
        title: '文章列表',
        path: '/admin/article/list',
        name: 'article_list'
      }]
    }
  },
  actions: {

  }
}
// 配置用户信息
const user = {
  state: {
    id: '',
    name: ''
  },
  mutations: {
    loginSuccess ({ id, name }, res) {
      id = res.id
      name = res.name
    }
  },
  actions: {

  }
}

const store = new Vuex.Store({
  state: {

  },
  mutations: {

  },
  modules: {
    app,
    user
  }
})

export default store
