<template>
    <Table border :columns="columns" :data="renderData"></Table>
</template>
<script>
export default {
  props: {
    columns: Array,
    renderData: Array
  },
  data () {
    return {
    }
  },
  methods: {
    show (index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.data[index].name}<br>Age：${this.data[index].age}<br>Address：${this.data[index].address}`
      })
    },
    remove (index) {
      this.data.splice(index, 1)
    }
  }
}
</script>
