<template>
<div class="editor-api">
  <Card class="left-info">
    <p slot="title">
      API{{title}} - 基本信息
    </p>
    <editorBase @submit="submitBase" @delete="deleteApi" :info="info"></editorBase>
  </Card>
  <Card :bordered="false" class="right-list-full right-container" style="height:calc(100vh - 112px)">
    <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        API分支列表
    </p>
    <editorModel @submit="submitModel" @delete="deleteApiModel" v-for="model in (info.model || [{}])" :info="model" :key="model._id" style="margin: 8px 0;"></editorModel>
    <Button type="primary" icon="add" @click="addNewBranch">添加新分支</Button>
  </Card>
</div>
</template>
<script>
import editorBase from './editor-apiBase.vue'
import editorModel from './editor-apiModel.vue'
import { getApiDetail, addApiBase, editApiBase, addApiModel, editApiModel, deleteApi, deleteApiModel } from '@/api/api.js'
export default {
  name: 'editor-api',
  data () {
    return {
      jsonData: '',
      info: {

      },
      baseid: '',
    }
  },
  components: {
    editorBase,
    editorModel,
  },
  watch: {

  },
  computed: {
    title () {
      return this.baseid ? '编辑' : '新增'
    },
  },
  mounted () {
    let query = this.$route.query
    if (query.project) this.info = {project: query.project}
    if (query.id) {
      this.getApiDetail({id: query.id})
    }
  },
  methods: {
    submitBase (data) {
      let func = data.id ? editApiBase : addApiBase
      func(data).then((data) => {
        if (!data.code) {
          this.baseid = data.data.result._id
          this.$Message.success(data.message)
        }
      })
    },
    submitModel (data) {
      let func = data.id ? editApiModel : addApiModel

      if (!data.baseid) {
        if (!this.baseid) {
          this.$Message.error('您还没有保存基础信息，无法提交分支信息!')
          return
        }
        data.baseid = this.baseid
      }
      func(data).then((data) => {
        if (!data.code) {
          this.$Message.success(data.message)
        }
      })
    },
    deleteApi (data) {
      deleteApi(data).then((data) => {
        if (!data.code) {
          this.$Message.success(data.message)
          this.$router.go(-1)
        }
      })
    },
    deleteApiModel (data) {
      deleteApiModel(data).then((data) => {
        if (!data.code) {
          this.$Message.success(data.message)
          this.getApiDetail({id: this.$route.query.id})
        }
      })
    },
    getApiDetail (data) {
      return getApiDetail(data).then((res) => {
        if (!res.code) {
          this.info = res.data.result
          this.baseid = this.info._id
        } else {
          this.$Message.error('API未找到！')
        }
      })
    },
    addNewBranch () {
      if (!this.info.model) this.info.model = []
      this.info.model.push({})
    },
  },
}
</script>
<style scoped>
.editor-api {
  display: flex;
  min-width: 1000px;
}
.editor-api .right-container {
  flex-basis: 600px;
  flex-grow: 1;
}
.editor-api .left-info {
  flex-basis: 600px;
  flex-grow: 1;
}
</style>
<style>
.right-list-full > .ivu-card-body {
  height: calc( 100% - 52px );
  overflow-y: auto;
}
</style>
