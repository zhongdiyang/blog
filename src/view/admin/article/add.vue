<style lang="less">
@import '../../../assets/css/common.less';
@import './add.less';
</style>

<template>
  <div>
    <Row>
      <Col span="18">
        <Card>
          <Form :label-width="80">
            <FormItem label="文章标题" :error="articleError">
              <Input v-model="articleTitle" @on-blur="handleArticletitleBlur" icon="android-list"/>
            </FormItem>
          </Form>
          <div>
            <Row>
              <div></div>
              <upload :uploadData='uploadData' :srcArr='[{name:1,url:articleSrc}]' @imgSrc='getImgSrc'></upload>
            </Row>
          </div>
          <div class="margin-top-20">
            <textarea id="articleEditor"></textarea>
          </div>
        </Card>
      </Col>
      <Col span="6" class="padding-left-10">
        <Card>
          <p slot="title">
              <Icon type="paper-airplane"></Icon>
              发布
          </p>
          <p class="margin-top-10">
              <Icon type="android-time"></Icon>&nbsp;&nbsp;状&nbsp;&nbsp;&nbsp; 态：
              <Select size="small" style="width:90px" value="草稿">
                  <Option v-for="item in articleStateList" :value="item.value" :key="item.value">{{ item.value }}</Option>
              </Select>
          </p>
          <p class="margin-top-10">
            <Icon type="eye"></Icon>&nbsp;&nbsp;公开度：&nbsp;<b>{{ Openness }}</b>
            <Button v-show="!editOpenness" size="small" @click="handleEditOpenness" type="text">修改</Button>
            <transition name="openness-con">
              <div v-show="editOpenness" class="openness-radio-con">
                <RadioGroup v-model="currentOpenness" vertical>
                  <Radio label="公开">
                    公开
                    <Checkbox v-show="currentOpenness === '公开'" v-model="topArticle">在首页置顶这篇文章</Checkbox>
                  </Radio>
                  <Radio label="密码">
                    密码
                    <Input v-show="currentOpenness === '密码'" style="width:120px" size="small" placeholder="请输入密码"/>
                  </Radio>
                  <Radio label="私密"></Radio>
                </RadioGroup>
                <div>
                  <Button type="primary" @click="handleSaveOpenness">确认</Button>
                  <Button type="ghost" @click="cancelEditOpenness">取消</Button>
                </div>
              </div>
            </transition>
          </p>
          <div class="margin-top-10">
            <p slot="title">
              <Icon type="ios-pricetags-outline"></Icon>
              标签
            </p>
            <Row>
              <Col span="18">
                <Select v-model="articleTagSelected" multiple @on-change="handleSelectTag" placeholder="请选择文章标签">
                  <Option v-for="item in articleTagList" :value="item.id" :key="item.id">{{ item.sort_article_name }}</Option>
                </Select>
              </Col>
              <Col span="6" class="padding-left-10">
                <Button v-show="!addingNewTag" @click="handleAddNewTag" style="min-width:36px;" long type="ghost">新建</Button>
              </Col>
            </Row>
            <transition name="add-new-tag">
              <div v-show="addingNewTag" class="add-new-tag-con">
                <Col span="14">
                  <Input v-model="newTagName" placeholder="请输入标签名" />
                </Col>
                <Col span="5" class="padding-left-10">
                  <Button @click="createNewTag" long type="primary">确定</Button>
                </Col>
                <Col span="5" class="padding-left-10">
                  <Button @click="cancelCreateNewTag" long type="ghost">取消</Button>
                </Col>
              </div>
            </transition>
        </div>
          <p class="margin-top-10">
            <Icon type="ios-calendar-outline"></Icon>&nbsp;&nbsp;
            <span v-if="publishTimeType === 'immediately'">立即发布</span><span v-else>定时：{{ publishTime }}</span>
            <Button v-show="!editPublishTime" size="small" @click="handleEditPublishTime" type="text">修改</Button>
            <transition name="publish-time">
              <div v-show="editPublishTime" class="publish-time-picker-con">
                <div class="margin-top-10">
                  <DatePicker @on-change="setPublishTime" type="datetime" style="width:200px;" placeholder="选择日期和时间" ></DatePicker>
                </div>
                <div class="margin-top-10">
                  <Button type="primary" @click="handleSavePublishTime">确认</Button>
                  <Button type="ghost" @click="cancelEditPublishTime">取消</Button>
                </div>
              </div>
            </transition>
          </p>
          <Row class="margin-top-20 publish-button-con">
            <span class="publish-button"><Button @click="handlePreview">预览</Button></span>
            <span class="publish-button"><Button @click="handleSaveDraft">保存草稿</Button></span>
            <span class="publish-button"><Button @click="handlePublish" :loading="publishLoading" icon="ios-checkmark" style="width:90px;" type="primary">发布</Button></span>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
/**
 *
 *  未完成功能： 1、在用户输入后，保存输入的信息（内容）
 *
*/
import upload from '@/components/upload'
import tinymce from 'tinymce'
// 导入zh_CN.js tinymce解决报错问题
import '@/libs/zh_CN.js'
export default {
  name: 'artical-publish',
  components: {
    upload
  },
  data () {
    return {
      articleTitle: '',
      articleError: '',
      editLink: false,
      editPathButtonType: 'ghost',
      editPathButtonText: '编辑',
      articleStateList: [{value: '草稿'}, {value: '等待复审'}],
      editOpenness: false,
      Openness: '公开',
      currentOpenness: '公开',
      topArticle: false,
      publishTime: '',
      publishTimeType: 'immediately',
      editPublishTime: false, // 是否正在编辑发布时间
      articleTagSelected: [], // 文章选中的标签
      articleTagList: [], // 所有标签列表
      classificationSelected: [], // 在所有分类目录中选中的目录数组
      classificationFinalSelected: [], // 最后实际选择的目录
      publishLoading: false,
      addingNewTag: false, // 添加新标签
      newTagName: '', // 新建标签名
      articleSrc: '',
      uploadData: {
        imgWidth: 240, // 上传的图片大小
        imgHeight: 120,
        limit: 1 // 上传的个数限制
      }
    }
  },
  methods: {
    handleArticletitleBlur () {
      if (this.articleTitle.length !== 0) {
        console.log(localStorage.articleTitle)
        localStorage.articleTitle = this.articleTitle // 本地存储文章标题
        localStorage.setItem('articleTitle', this.articleTitle)
      } else {
        this.$Message.error('文章标题不可为空哦')
      }
    },
    getImgSrc (src) {
      console.log('getImgSrc', src)
      localStorage.setItem('imagesSrc', src)
      this.articleSrc = src
    },
    handleEditOpenness () {
      this.editOpenness = !this.editOpenness
    },
    handleSaveOpenness () {
      this.Openness = this.currentOpenness
      this.editOpenness = false
    },
    cancelEditOpenness () {
      this.currentOpenness = this.Openness
      this.editOpenness = false
    },
    handleEditPublishTime () {
      this.editPublishTime = !this.editPublishTime
    },
    handleSavePublishTime () {
      this.publishTimeType = 'timing'
      this.editPublishTime = false
    },
    cancelEditPublishTime () {
      this.publishTimeType = 'immediately'
      this.editPublishTime = false
    },
    setPublishTime (datetime) {
      this.publishTime = datetime
    },
    handleAddNewTag () {
      this.addingNewTag = !this.addingNewTag
    },
    createNewTag () {
      if (this.newTagName.length !== 0) {
        let mark = this.articleTagList.some((item) => {
          return item.sort_article_name.toLocaleLowerCase() === this.newTagName.toLocaleLowerCase()
        })
        if (mark === false) {
          const user = JSON.parse(localStorage.getItem('userInfo'))
          if (user && user.id) {
            // 使用用户ID
            this.$http.post('/api/article_sort/add', {
              sort_article_name: this.newTagName,
              user_id: JSON.parse(localStorage.getItem('userInfo')).id
            })
              .then((res) => {
                console.log(res, res.data.data[0])
                if (res.status === 200) {
                  this.articleTagList.push({
                    id: res.data.data[0],
                    sort_article_name: this.newTagName
                  })
                }
                this.$Notice.success({
                  title: '添加成功！'
                })
                this.addingNewTag = false
                this.newTagName = ''
              })
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
        }
      } else {
        this.$Message.error('请输入标签名')
      }
    },
    cancelCreateNewTag () {
      this.newTagName = ''
      this.addingNewTag = false
    },
    canPublish () {
      if (this.articleTitle.length === 0) {
        this.$Message.error('请输入文章标题')
        return false
      } else {
        return true
      }
    },
    handlePreview () {
      if (this.canPublish()) {
        if (this.publishTimeType === 'immediately') {
          let date = new Date()
          let year = date.getFullYear()
          let month = date.getMonth() + 1
          let day = date.getDate()
          let hour = date.getHours()
          let minute = date.getMinutes()
          let second = date.getSeconds()
          localStorage.publishTime = year + ' 年 ' + month + ' 月 ' + day + ' 日 -- ' + hour + ' : ' + minute + ' : ' + second
        } else {
          localStorage.publishTime = this.publishTime // 本地存储发布时间
        }
        localStorage.content = tinymce.activeEditor.getContent()
      }
    },
    handleSaveDraft () {
      if (!this.canPublish()) {
        //
      }
    },
    handlePublish () {
      var activeEditor = tinymce.activeEditor
      var editBody = activeEditor.getBody()
      console.log(editBody.innerHTML)
      console.log(this.articleTagSelected)
      let classify = ''
      if (!this.articleTagSelected.length) {
        this.$Notice.warning({
          title: '温馨提示',
          desc: '请选择文章所属的标签'
        })
        return false
      } else {
        const len = this.articleTagList.length
        this.articleTagSelected.sort((a, b) => b - a).forEach((el, index) => {
          for (let i = index; i < len; i++) {
            if (this.articleTagList[i].id === el) {
              classify += ',' + this.articleTagList[i].sort_article_name + '&' + this.articleTagList[i].id
            }
          }
        })
      }
      const queryData = {
        article_title: this.articleTitle,
        user_id: JSON.parse(localStorage.getItem('userInfo')).id,
        content: editBody.innerHTML,
        img: this.articleSrc,
        classify: classify.substring(1, classify.length)
      }
      console.log(queryData)
      this.$http.post('/api/add_article', queryData, {
        headers: {
          token: localStorage.getItem('loginToken').split('&&expireTime:')[0]
        }
      })
        .then((res) => {
          console.log(res)
          if (res.status === 200 && res.data.status === 'success') {
            this.$Notice.success({
              title: '保存成功',
              desc: '文章《' + this.articleTitle + '》保存成功'
            })
            localStorage.removeItem('imagesSrc')
            localStorage.removeItem('articleTitle')
          }
        })
    },
    handleSelectTag () {
      localStorage.tagsList = JSON.stringify(this.articleTagSelected) // 本地存储文章标签列表
    }
  },
  created () {
    const src = localStorage.getItem('imagesSrc')
    const articleTitle = localStorage.getItem('articleTitle')
    if (src) {
      this.articleSrc = src
    }
    if (articleTitle) {
      this.articleTitle = articleTitle
    }
  },
  mounted () {
    this.$http.get('/api/article_sort')
      .then((res) => {
        if (res.status === 200 && res.data.data) {
          this.articleTagList = res.data.data
        }
      })
    // 解决tinymce Unexpected token 报错
    window.tinymce.baseURL = 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.7.4'
    // 设置为压缩文件
    window.tinymce.suffix = '.min'
    tinymce.init({
      selector: '#articleEditor',
      branding: false,
      elementpath: false,
      height: 600,
      language: 'zh_CN',
      menubar: 'edit insert view format table tools',
      theme: 'modern',
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
        'searchreplace visualblocks visualchars code fullscreen fullpage',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons paste textcolor colorpicker textpattern imagetools codesample'
      ],
      toolbar1: ' newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
      autosave_interval: '20s',
      image_advtab: true,
      table_default_styles: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    })
  },
  destroyed () {
    tinymce.get('articleEditor').destroy()
  }
}
</script>
