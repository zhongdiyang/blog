<template>
  <div class="header">
    <div class="logo">
      <a href="javascript:;">博客</a>
    </div>
    <ul>
      <li>
        <a href="javascript:;">首页</a>
      </li>
      <li>
        <a href="javascript:;">文章</a>
      </li>
      <li>
        <a href="javascript:;">代码</a>
      </li>
      <li>
        <a href="javascript:;">关于</a>
      </li>
      <li>
        <a href="javascript:;">小憩一下</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.header {
  display: table;
  .logo{
    display: table-cell;
  }
  nav {
    display: table-cell;
  }
}
</style>
