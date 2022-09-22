<template>
  <div class="container">
    <a-form
        ref="formRef"
        name="advanced_search"
        class="search-form"
        :model="formState"
        @finish="onFinish"
        layout="inline"
    >
      <a-form-item name="build" label="小区">
        <a-input v-model:value="formState.build" placeholder="请输入小区名"></a-input>
      </a-form-item>
      <a-form-item name="build" label="楼号">
        <a-input v-model:value="formState.build" placeholder="18楼402室,输18-402"></a-input>
      </a-form-item>

      <a-form-item>
        <a-button type="default" class="submit_btn" html-type="submit">查询</a-button>
        <a-button style="margin: 0 8px" class="default_btn" @click="resetForm">清空</a-button>
      </a-form-item>
    </a-form>
    <div class="tool">
      <a-button type="default" class="submit_btn">新增租单</a-button>
      <a-button type="default" class="default_btn" @click="downTemplate" :loading="downLoad"
      >模板下载
      </a-button>
      <a-button type="default" class="default_btn" @click="showImport">导入</a-button>
      <a-button type="default" class="default_btn">导出</a-button>
    </div>
    <div class="search-result-list">
      <a-table
          :columns="columns"
          :data-source="dataSource"
          @change="tableChange"
          :pagination="paginationData"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'building'">{{ record.building }} - {{ record.roomNo }}</template>
          <template v-if="column.key === 'action'">
            <div class="action_btn">
              <a-button type="default" class="submit_btn">收租</a-button>
              <a-button type="default" class="default_btn">编辑</a-button>
              <a-button type="default" class="default_btn">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <!--  导入弹窗-->
  <a-modal v-model:visible="visible" title="导入" :footer="null">
    <a-upload
        :file-list="fileList"
        :before-upload="beforeUpload"
        @remove="handleRemove"
        accept=".xlsx"
    >
      <a-button>
        <!--        <UploadOutlined />-->
        选择文件，仅为.xlsx文件，不超过 10M
      </a-button>
    </a-upload>
    <a-button
        type="primary"
        :disabled="fileList.length === 0"
        :loading="uploading"
        style="margin-top: 16px"
        @click="handleUpload"
    >
      {{ uploading ? '上传中' : '开始上传' }}
    </a-button>
  </a-modal>
</template>
<script lang="ts" setup>
import {computed, defineComponent, reactive, ref, toRefs, watch} from 'vue'
import {getRentList} from '@/services/sys.service'
// import {usePagination} from 'vue-request'
import type {TableProps, UploadProps} from 'ant-design-vue'
import request from '@/services/request'
import {UploadOutlined} from '@ant-design/icons-vue'
import {table} from "@/pages/rent/data";
import {RentParams} from "@/services/data";

const columns = ref(table.columns)
const paginationData = ref(table.pagination);
const dataSource = ref([]);

function loadDataSource() {
  let param: RentParams = {
    pageNo: paginationData.value.current,
    pageSize: paginationData.value.pageSize
  }
  getRentList(param).then((res) => {
    console.log(res.data)
    dataSource.value = res.data.data
    paginationData.value.total = res.data.totalRecord
  })
}

loadDataSource()

function tableChange(pagination: any) {
  paginationData.value.current = pagination.current;
  paginationData.value.pageSize = pagination.pageSize;
  loadDataSource();
}

const formState = ref({
  build: '',
})

type Key = string | number
const state = reactive<{
  selectedRowKeys: Key[]
  loading: boolean
  downLoad: boolean
  visible: boolean
  fileList: UploadProps['fileList']
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
  downLoad: false,
  visible: false,
  fileList: [],
})


// const {
//   data: dataSource,
//   run,
//   loading,
//   current,
//   pageSize,
//   total
// } = usePagination(getRentList, {
//   formatResult: res => res.data.data,
//   pagination: {
//     currentKey: 'pageNo',
//     pageSizeKey: 'pageSize',
//     totalKey: 'data.totalRecord',
//     // totalPageKey:'pageCount'
//   },
// })

//
//
// const pagination = computed(() => ({
//   total: total.value,
//   current: current.value,
//   pageSize: pageSize.value,
// }))
//
// watch(
//     pageSize, // 注意这里变化
//     (val, old) => {
//       console.log('val', val)
//       console.log('old', old)
//     },
// )

//   const handleTableChange= (pag: Pagination, sorter: any) => {
//     run({
//           results: pag!.pageSize!,
//     page: pag?.current,
//     sortField: sorter.field,
//     sortOrder: sorter.order,
//   });
// };

// const showImport = () => {
//   state.visible = true
// }
/**
 * 下载模板
 */
const downTemplate = () => {
  state.downLoad = true
  const token = localStorage.getItem('token')
  request.get('/rentList/modelExport', {
    headers: {
      'Content-type': 'application/json;charset:utf-8;',
      // Authorization: 'Bearer ' + token, //认证或授权
    },
    responseType: 'blob',
  })
      .then((res) => {
        const blob = new Blob([res.data])
        const fileName = '租单导入模板.xlsx'
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
        state.downLoad = false
      })
      .catch((err) => {
        console.log(err)
        state.downLoad = false
      })
}

const onFinish = (values: any) => {
  console.log('Received values of form: ', values)
  // console.log('formState: ', formState)
}

// const resetForm = () => {
// }

// return {
//   dataSource,
//   pagination,
//   formState,
//   columns,
//   // handleTableChange,
//   ...toRefs(state),
//   showImport,
//   downTemplate,
//   onFinish,
//   UploadOutlined,
//   resetForm,
//   total,
// }
// },
// })

// getRentList(params).then((res: any) => {
//   console.log(res)
//   if (res.data) {
//     res.data.forEach((r: any) => {
//       r.buildInfo = r.building + '-' + r.roomNo
//     })
//     data.value = res.data
//   }
//   state.pagination.total = res.totalRecord
// })
//
// const formRef = ref<FormInstance>()
// const formState = reactive<FormState>({
//   build: null,
// })

// const onSelectChange = (selectedRowKeys: Key[]) => {
//   console.log('selectedRowKeys changed: ', selectedRowKeys)
//   state.selectedRowKeys = selectedRowKeys
// }

//
// const beforeUpload: UploadProps['beforeUpload'] = (file) => {
//   state.fileList = [file]
//   return false
// }

// const self = this
// const handleUpload = () => {
//   const formData = new FormData()
//   if (state.fileList && state.fileList.length > 0) {
//     formData.append('file', state.fileList[0] as any, 'file')
//   }
//   // uploading.value = true
//   // const token = localStorage.getItem('token')
//   // You can use any AJAX library you like
//   const config = { headers: { 'Content-Type': 'multipart/form-data' } } //修改请求头
//   request.post('/rentList/import', formData, config).then((res) => {
//     console.log(res)
//   })
// axios({
//   method: 'POST',
//
//   data: formData,
// }).then((res) => {
//   console.log(res)
// })

// const jsonp = VueJsonp()

// request('', {
//   method: 'post',
//   data: formData,
// })
//   .then(() => {
//     fileList.value = []
//     uploading.value = false
//     message.success('upload successfully.')
//   })
//   .catch(() => {
//     uploading.value = false
//     message.error('upload failed.')
//   })
// }
// const handleRemove: UploadProps['onRemove'] = (file) => {
//   // const index = state.fileList.indexOf(file)
//   // const newFileList = state.fileList.slice()
//   // newFileList.splice(index, 1)
//   state.fileList = []
// }
// const { selectedRowKeys, downLoad, visible, fileList, pagination } = toRefs(state)
</script>

<style lang="less" scoped>
.container {
  //border: 1px solid black;
  //height: 1900px;

  .search-form {
    // border: 1px solid red;
    margin-bottom: 10px;
  }

  .tool {
    line-height: 30px;
    margin-bottom: 15px;

    .submit_btn {
      margin-right: 10px;
    }

    .default_btn {
      margin-right: 10px;
    }
  }

  .action_btn {
    .submit_btn {
      margin-right: 10px;
    }

    .default_btn {
      margin-right: 10px;
    }
  }
}

.submit_btn {
  width: 100px;
  color: #ffffff;
  border-color: @theme-color;
  height: 35px;
  background-color: @theme-color;
}

.default_btn {
  width: 100px;
  border-color: @theme-color;
  height: 35px;
  color: @theme-color;
}
</style>
