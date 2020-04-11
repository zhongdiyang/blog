<template>
  <div>
    <div class="demo-upload-list" v-for="(item, index) in uploadList" v-bind:key='index' :style="{'line-height': uploadData.imgHeight?uploadData.imgHeight+'px':'60px'}">
      <template v-if="item.status === 'finished'">
        <img style="display:block;" :style="{width: uploadData.imgWidth?uploadData.imgWidth+'px':'58px',height: uploadData.imgHeight?uploadData.imgHeight+'px':'58px'}" :src="item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      v-if="defaultList.length"
      v-show="showUplad"
      ref="upload"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      multiple
      type="drag"
      action="/api/uploadImg"
      style="display: inline-block;width:58px;" :style="{width: uploadData.imgWidth?uploadData.imgWidth+'px':'58px',height: uploadData.imgHeight?uploadData.imgHeight+'px':'58px','line-height': uploadData.imgHeight?uploadData.imgHeight+'px':'58px'}">
      <div v-if='uploadData.limit >= uploadList.length' :style="{width: uploadData.imgWidth?uploadData.imgWidth+'px':'58px',height: uploadData.imgHeight?uploadData.imgHeight+'px':'58px','line-height': uploadData.imgHeight?uploadData.imgHeight+'px':'58px'}">
        <Icon type="camera" size="20"></Icon>
        {{ '图片大小:'+ uploadData.imgWidth +'*'+ uploadData.imgHeight }}
      </div>
    </Upload>
    <Upload
      v-else
      v-show="showUplad"
      ref="upload"
      :default-file-list="defaultList"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      multiple
      type="drag"
      action="/api/uploadImg"
      style="display: inline-block;width:58px;" :style="{width: uploadData.imgWidth?uploadData.imgWidth+'px':'58px',height: uploadData.imgHeight?uploadData.imgHeight+'px':'58px','line-height': uploadData.imgHeight?uploadData.imgHeight+'px':'58px'}">
      <div v-if='uploadData.limit >= uploadList.length' :style="{width: uploadData.imgWidth?uploadData.imgWidth+'px':'58px',height: uploadData.imgHeight?uploadData.imgHeight+'px':'58px','line-height': uploadData.imgHeight?uploadData.imgHeight+'px':'58px'}">
        <Icon type="camera" size="20"></Icon>
        {{ '图片大小:'+ uploadData.imgWidth +'*'+ uploadData.imgHeight }}
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible">
      <img :src="imgSrc" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    uploadData: Object,
    srcArr: Array
  },
  data () {
    return {
      defaultList: [],
      imgSrc: '',
      visible: false,
      showUplad: true,
      uploadList: []
    }
  },
  methods: {
    handleView (url) {
      this.imgSrc = url
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      console.log('handleSuccess', res, file)
      if (file.status === 'finished' && file.uid && res.imgUrl) {
        file.url = res.imgUrl
        file.name = file.uid
        this.$emit('imgSrc', res.imgUrl)
      }
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < this.uploadData.limit
      if (!check) {
        this.$Notice.warning({
          title: `上传图片个数不能超过${this.uploadData.limit + 1} 个。`
        })
      }
      return check
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
  },
  created () {
    if (this.srcArr && this.srcArr.length) {
      this.defaultList.push(...this.srcArr)
    }
  }
}
</script>
<style>
  .demo-upload-list{
    display: inline-block;
    text-align: center;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
