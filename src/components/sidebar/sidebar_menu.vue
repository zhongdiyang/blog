<template>
  <Menu ref='sideMenu' :active-name="$route.name" :open-names="openNames" @on-select='changeMenu'>
    <Submenu :name="item.name" v-for='(item, index) in menuList' v-bind:key='index'>
      <template slot="title">
        <Icon :type="item.icon"></Icon>
        {{ item.title }}
      </template>
      <Menu-item v-for='(it, ind) in item.children' v-bind:key='ind' :name="it.name"><Icon :type="it.icon"></Icon>{{ it.title }}</Menu-item>
    </Submenu>
  </Menu>
</template>
<script>
export default {
  props: {
    menuList: Array
  },
  data () {
    return {
      openNames: this.$store.state.app.openedSubmenuArr
    }
  },
  created () {
    // 根据路由判断默认选项卡的值
    var _this = this
    _this.menuList.forEach(element => {
      element.children.forEach(item => {
        if (item.name === _this.$route.name) {
          _this.openNames = [element.name]
        }
      })
    })
  },
  methods: {
    changeMenu (active) {
      this.$router.push({
        name: active
      })
      var openNames = '' // 获取点击之后路由的父路由
      var toPath = {} // 目标路由
      this.menuList.forEach(element => {
        element.children.forEach(item => {
          if (item.name === active) {
            toPath = item
            openNames = element.name
          }
        })
      })
      this.$store.commit('changePage', {
        openNames,
        active,
        toPath
      })
    }
  },
  updated () {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened()
      }
    })
  }
}
</script>
