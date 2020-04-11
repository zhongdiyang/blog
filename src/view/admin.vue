<style lang="less">
  @import "./admin.less";
  .ivu-dropdown-rel a{
    color: #00a854;
  }
</style>
<template>
    <div class="main">
        <div class="sidebar-menu-con" style="width: 200px;">
          <div slot="top" class="logo-con">
            <img :src="logoSrc" key="max-logo" />
          </div>
          <sidebar-menu
            style="width: 200px;"
            :menuList="menuList">
          </sidebar-menu>
        </div>
        <div class="main-header-con">
            <div class="main-header">
                <div class="navicon-con">
                    <Button type="text">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                    <message-tip v-model="mesCount"></message-tip>

                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar style="background: #00a854;margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList" @closeAll='closeAll'></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con">
            <div class="single-page">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>
<script>
import sidebarMenu from '@/components/sidebar/sidebar_menu'
import breadcrumbNav from '@/components/breadcrumb-nav'
import tagsPageOpened from '@/components/tags-page-opened.vue'
import fullScreen from '@/components/fullscreen.vue'
import messageTip from '@/components/message_tip.vue'

export default {
  components: {
    sidebarMenu,
    breadcrumbNav,
    fullScreen,
    messageTip,
    tagsPageOpened
  },
  data () {
    return {
      userName: '用户名',
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
      logoSrc: 'https://file.iviewui.com/dist/03635a3c88122ad605117128f3fda0ca.png'
    }
  },
  beforeCreate () {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    if (user && user.id && !sessionStorage.getItem('loginToken_' + user.id)) {
      const arr = localStorage.getItem('loginToken').split('&&expireTime:')
      if (arr.length === 2) {
        this.$http.post('/api/check_token', user, {
          headers: {
            token: arr[0]
          }
        })
          .then((res) => {
            if (res.status === 200 && res.data.status === 'success') {
              sessionStorage.setItem('loginToken_' + user.id, true)
            } else {
              window.location.href = '/login'
            }
          })
      }
    }
  },
  computed: {
    menuList () {
      return this.$store.state.app.menuList
    },
    pageTagsList () {
      return this.$store.state.app.pageOpenedList // 打开的页面的页面对象
    },
    currentPath () {
      const currentPath = [{
        name: 'admin',
        path: '/admin',
        title: '首页'
      }]
      currentPath.push(this.$store.state.app.currentPath[0])
      return currentPath // 当前面包屑数组
    },
    mesCount () {
      return 0
    }
  },
  methods: {
    handleClickUserDropdown (name) {
      console.log(name)
      if (name === 'loginout') {
        // 登出
        const user = JSON.parse(localStorage.getItem('userInfo'))
        this.$http.post('/api/loginout', {
          id: user.id
        })
          .then((res) => {
            console.log(res)
            if (res.status === 200 && res.data.status === 'success' && res.data.message === 'loginout success') {
              // 登出成功
              this.$Notice.open({
                title: '登出成功！'
              })
              localStorage.removeItem('loginToken')
              localStorage.removeItem('userInfo')
              sessionStorage.removeItem('loginToken_' + user.id)
              setTimeout(() => {
                window.location.href = '/'
              }, 1000)
            }
          })
      } else if (name === 'ownSpace') {
        // 个人中心
      }
    },
    checkTag (name) {

    },
    handleSubmenuChange (val) {
      // console.log(val)
    },
    fullscreenChange (isFullScreen) {

    },
    scrollBarResize () {
      this.$refs.scrollBar.resize()
    },
    closeAll (mark) {
      // 恢复成默认的路由
      const defaultRouter = {
        'pageOpenedList': [
          {'title': '文章列表', 'path': '/admin/article/list', 'name': 'article_list'}
        ],
        'openedSubmenuArr': ['article'],
        'currentPath': [{'name': 'article_list', 'path': '/admin/article/list', 'title': '文章列表'}]
      }
      const {currentPath} = JSON.parse(sessionStorage.getItem('appRouterStorage'))
      if (mark === 2 && currentPath[0].title !== '文章列表') {
        defaultRouter.pageOpenedList.push(...currentPath)
        defaultRouter.openedSubmenuArr.splice(0, defaultRouter.openedSubmenuArr.length, currentPath[0].path.split('/')[2])
        defaultRouter.currentPath.splice(0, defaultRouter.currentPath.length, ...currentPath)
      } else if (mark === 1) {
        this.$router.push({
          path: '/admin/article/list'
        })
      }

      this.$store.commit('RouterStorage', defaultRouter)
      sessionStorage.setItem('appRouterStorage', JSON.stringify(defaultRouter))
    }
  },
  created () {
    const appRouterStorage = JSON.parse(sessionStorage.getItem('appRouterStorage'))
    const user = JSON.parse(localStorage.getItem('userInfo'))
    if (user && user.name) {
      this.userName = user.name
    } else {
      this.$Notice.success({
        title: '温馨提示',
        desc: '用户登录信息已经失效！请重新登录。'
      })
      localStorage.removeItem('loginToken')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
    }

    if (appRouterStorage) {
      this.$store.commit('RouterStorage', appRouterStorage)
    }
    const route = this.$route
    const _this = this
    // 如果链接地址和当前保存的地址不一致，则调用changeCurrentPath
    if (route.name !== this.$store.state.app.currentPath[0].name) {
      var title
      _this.menuList.forEach(element => {
        element.children.forEach(item => {
          if (item.name === route.name) {
            title = item.title
          }
        })
      })
      this.$store.commit('changeCurrentPath', {
        name: route.name,
        fullPath: route.fullPath,
        title: title
      })
    }
  }
}
</script>
