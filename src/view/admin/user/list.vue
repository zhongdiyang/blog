<template>
  <my-table :columns='columns' :renderData='renderData'></my-table>
</template>
<script>
import axios from 'axios'
import myTable from '@/components/table/table'
export default {
  data () {
    return {
      columns: [
        {
          title: '用户名',
          key: 'user_name',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.user_name)
            ])
          }
        },
        {
          title: '用户性别',
          key: 'user_sex',
          render (h, params) {
            return h('p', params.row.user_sex ? params.row.user_sex : '未知')
          }
        },
        {
          title: '用户生日',
          key: 'user_birthday',
          render (h, params) {
            var str
            if (!params.row.user_birthday) {
              str = '未知'
            } else {
              var date = new Date(params.row.user_birthday)
              str = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDay() + '日'
            }
            return h('p', str)
          }
        },
        {
          title: '手机号码',
          key: 'user_phone',
          render (h, params) {
            return h('p', params.row.user_phone ? params.row.user_phone : '未知')
          }
        },
        {
          title: '等级名称',
          key: 'rank_name'
        },
        {
          title: '用户积分',
          key: 'user_mark'
        },
        {
          title: '是否锁定',
          key: 'user_lock'
        },
        {
          title: '是否冻结',
          key: 'user_freeze'
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, 'View'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, 'Delete')
            ])
          }
        }
      ],
      renderData: []
    }
  },
  components: {
    myTable
  },
  methods: {
    show (index) {
      this.$Modal.info({
        title: 'User Info',
        content: `用户名：${this.renderData[index].user_name}<br>
                  用户性别：${this.renderData[index].user_sex}<br>
                  是否冻结：${this.renderData[index].user_freeze}<br>
                  用户生日：${this.renderData[index].user_birthday}<br>
                  是否冻结：${this.renderData[index].user_freeze}<br>
                  是否冻结：${this.renderData[index].user_freeze}<br>
                  是否冻结：${this.renderData[index].user_freeze}<br>`
      })
    },
    remove (index) {
      this.renderData.splice(index, 1)
    }
  },
  mounted () {
    const _this = this
    axios.get('/api/user_list', {
      params: { dataType: 'detail' }
    }).then(function (res) {
      console.log(res)
      if (res.status === 200 && res.data.status === 'success')_this.renderData = res.data.data
    })
  }
}
</script>
