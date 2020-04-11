<template>
  <div>
    <my-header></my-header>
    <router-view></router-view>
  </div>
</template>
<script>
import myHeader from '@/components/page/header'
export default {
  components: {
    myHeader
  }
}
</script>
<style>
  @import url(http://at.alicdn.com/t/font_johilqafsmwsif6r.css);
  @import '../assets/css/style.css';
</style>
