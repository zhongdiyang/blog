<template>
  <div>
    <my-table :columns='columns' :renderData='renderData'></my-table>
    <Modal title="View Image" v-model="visible">
      <img :src="imgSrc" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
/**
 *
 *  未完成功能： 1、分页
 *
*/
import myTable from '@/components/table/table'
export default {
  components: {
    myTable
  },
  data () {
    return {
      visible: false,
      imgSrc: '',
      columns: [
        {
          title: '文章标题',
          key: 'article_name'
        },
        {
          title: '用户名',
          key: 'user_name'
        },
        {
          title: '创建时间',
          key: 'article_time',
          render (h, params) {
            var date = new Date(params.row.article_time)
            var str = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDay() + '日'
            return h('p', str)
          }
        },
        {
          title: '文章分类',
          key: 'classify',
          render: (h, params) => {
            var arr = params.row.classify.split(',')
            let str = ''
            arr.forEach(el => {
              str += ',' + el.substring(0, el.indexOf('&'))
            })
            return h('p', {
              style: {
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.tagClassify(params.index)
                }
              }
            }, str.substring(1, str.length))
          }
        },
        {
          title: '图片地址',
          key: 'article_img',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'primary'
              },
              on: {
                click: () => {
                  this.showImg(params.row.article_img)
                }
              }
            }, '查看图片')
          }
        },
        {
          title: '点击数',
          key: 'article_click'
        },
        {
          title: '是否置顶',
          key: 'article_up',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'primary'
              },
              on: {
                click: () => {
                  this.tagTop(params.index)
                }
              }
            }, params.row.article_up === 0 ? '否' : '是')
          }
        },
        {
          title: '是否推荐',
          key: 'article_support',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'primary'
              },
              on: {
                click: () => {
                  this.tagSupport(params.index)
                }
              }
            }, params.row.article_support === 0 ? '否' : '是')
          }
        },
        {
          title: '是否展示',
          key: 'article_show',
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'primary'
              },
              on: {
                click: () => {
                  this.tagShow(params.index)
                }
              }
            }, params.row.article_show === 0 ? '否' : '是')
          }
        }
      ],
      renderData: []
    }
  },
  mounted () {
    const _this = this
    this.$http.get('/api/article_list/' + JSON.parse(localStorage.getItem('userInfo')).id).then(function (res) {
      if (res.status === 200 && res.data.status === 'success') {
        _this.renderData = res.data.data.article
      }
    })
  },
  methods: {
    show (index) {
      this.$Modal.info({
        title: 'User Info',
        content: `文章标题：${this.renderData[index].article_name}<br>
                  用户名：${this.renderData[index].user_name}<br>
                  创建时间：${this.renderData[index].article_time}<br>
                  图片地址：${this.renderData[index].article_img}<br>
                  点击数：${this.renderData[index].article_click}<br>
                  是否置顶：${this.renderData[index].article_up}<br>
                  是否推荐：${this.renderData[index].article_support}<br>`
      })
    },
    remove (index) {
      this.renderData.splice(index, 1)
    },
    // 修改文章分类
    tagClassify (index) {
      let _this = this
      let articlesort = localStorage.getItem('article_sort')
      console.log(articlesort.split('&&expireTime:')[1] > new Date())
      if (articlesort && articlesort.split('&&expireTime:')[1] > new Date()) {
        showModel(JSON.parse(articlesort.split('&&expireTime:')[0]))
      } else {
        this.$http.get('/api/article_sort').then((res) => {
          if (res.status === 200 && res.data.data) {
            console.log(res, res.data.data)
            localStorage.setItem('article_sort', JSON.stringify(res.data.data) + '&&expireTime:' + Math.floor(Date.now() + 3600 * 24 * 1000))
            showModel(res.data.data)
          }
        })
      }
      function showModel (data) {
        _this.$Modal.confirm({
          title: '文章分类修改',
          okText: '确认修改',
          render: (h) => {
            let arr = []
            console.log(arr)
            data.forEach(el => {
              arr.push(h('Option', {
                props: {
                  value: el.sort_article_name + '&' + el.id,
                  key: el.id
                }
              }, el.sort_article_name))
            })
            return h('Select', {
              style: {
                width: '260px'
              },
              props: {
                'v-model': 'model',
                multiple: true
              }
            }, arr)
          }
        })
      }
    },
    // 显示图片
    showImg (src) {
      this.imgSrc = src
      this.visible = true
    },
    // 展示
    tagShow (index) {
      this.tagChange(index, 'article_show')
    },
    // 置頂
    tagTop (index) {
      console.log('tagTop', index)
      this.tagChange(index, 'article_up')
    },
    // 推荐
    tagSupport (index) {
      console.log('tagSupport', index)
      this.tagChange(index, 'article_support')
    },
    tagChange (index, field) {
      const tagData = {}
      tagData[field] = this.renderData[index][field] === 0 ? 1 : 0
      this.$http.post('/api/' + this.renderData[index].id + '/article_update', tagData).then((res) => {
        if (res.status === 200 && res.data.data === 1) {
          this.$Notice.success({
            title: '修改成功！'
          })
          this.renderData[index][field] = tagData[field]
        }
      })
    }
  }
}
</script>
