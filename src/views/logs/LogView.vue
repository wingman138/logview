<script setup>
import { ref, onMounted } from 'vue'
import { Tickets } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'
import ContentBox from './components/ContentBox.vue'
import { timeAdd } from '@/utils/format'
import { logGetListService, logDelService } from '@/api/logs'
import { channelList, operationList, convertDirection, convertOperation } from '@/utils/common'
const loading = ref(false)
const total = ref(0)
const tableSize = ref('default')
const dataDelDays = ref(30)
const logList = ref([])
const contentBoxRef = ref()
const formRef = ref()
const params = ref({
  pagenum: 1,
  pagesize: 5,
  startTime: '2000-01-01 00:00:00',
  endTime: '2000-01-02 00:00:00',
  channel: -1,
  direction: -1,
  branchCode: '',
  stafCode: '',
  padID: '',
  operation: 0
})
const canSubmit = ref(false)
onMounted(() => {
  params.value.startTime = timeAdd(new Date(), 0, -1, 0, 0)
  params.value.endTime = new Date()
})
const onShowDetail = async (row) => {
  // loading.value = true
  // await logGetDetailService(row.id)
  //   .then((res) => {
  //     if (res.data.state === 0) {
  //       contentBoxRef.value.open({ inputMessage: res.data.data.inStr, outputMessage: res.data.data.outStr })
  //     }
  //     loading.value = false
  //   })
  //   .catch(() => {
  //     loading.value = false
  //   })

  contentBoxRef.value.open({ inputMessage: row.inStr, outputMessage: row.outStr })
}
const onDelData = async () => {
  ElMessageBox.confirm('您确定要删除么?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      loading.value = true
      await logDelService(dataDelDays.value)
        .then((res) => {
          loading.value = false
          ElMessage({ message: `删除成功！共删除${res.data.data}条记录`, type: 'success' })
        })
        .catch(() => {
          loading.value = false
        })
      logList.value = []
    })
    .catch(() => {})
}
const rules = {
  startTime: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          canSubmit.value = true
          callback(new Error('请输入开始时间!'))
        } else if (params.value.endTime && value >= params.value.endTime) {
          canSubmit.value = true
          callback(new Error('开始时间要小于结束时间!'))
        } else {
          formRef.value.clearValidate('endTime')

          canSubmit.value = false
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  endTime: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          canSubmit.value = true
          callback(new Error('请输入结束时间!'))
        } else if (params.value.startTime && value <= params.value.startTime) {
          canSubmit.value = true
          callback(new Error('结束时间要大于开始时间!'))
        } else {
          formRef.value.clearValidate('startTime')

          canSubmit.value = false
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}
const getLogList = async () => {
  loading.value = true
  await logGetListService(params.value)
    .then((res) => {
      if (res.data.state === 0) {
        logList.value = res.data.data.list
        total.value = res.data.data.total
      }
      loading.value = false
    })
    .catch(() => {
      logList.value = []
      loading.value = false
    })

  // loading.value = false
}
const onSearch = async () => {
  params.value.pagenum = 1
  getLogList()
}
const onSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getLogList()
}
const onCurrentChange = (page) => {
  params.value.pagenum = page
  getLogList()
}

//序号
const getIndex = (index) => {
  return (params.value.pagenum - 1) * params.value.pagesize + index + 1
}

const exportData = (data) => {
  const headers = [
    'ID',
    'CHANEL',
    'INOUTTAG',
    'TMSTAMP',
    'DATA',
    'OUTPUT',
    'BRANCHNO',
    'PADID',
    'STAFCODE',
    'OPTYPE'
  ]
  const excelData = data.map((item) => [
    item.id,
    item.channel,
    item.direction,
    item.tmstamp,
    item.inStr,
    item.outStr,
    item.branchCode,
    item.padID,
    item.stafCode,
    item.operation
  ])
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...excelData])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, 'que_interface_log.xlsx')
}
const exportExcel = async () => {
  loading.value = true
  let query = {
    ...params.value,
    pagesize: 0
  }
  await logGetListService(query)
    .then((res) => {
      if (res.data.state === 0) {
        if (res.data.data.list.length > 0) {
          exportData(res.data.data.list)
        } else {
          ElMessage({ message: '没有查询到符合条件的数据', type: 'warning' })
        }
      }
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}
</script>
<template>
  <PageContainer title="日志查询">
    <el-form
      class="params"
      :model="params"
      :rules="rules"
      ref="formRef"
      size="default"
      label-position="left"
    >
      <el-form-item label="开始时间:" prop="startTime" class="block">
        <el-date-picker
          v-model="params.startTime"
          type="datetime"
          placeholder="请选择开始时间"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY-MM-DD"
          time-format="HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="结束时间:" prop="endTime" class="block">
        <el-date-picker
          v-model="params.endTime"
          type="datetime"
          placeholder="请选择结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY-MM-DD"
          time-format="HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="数据渠道:" class="block">
        <el-select v-model="params.channel">
          <el-option
            v-for="item in channelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据方向:" class="block">
        <el-select v-model="params.direction">
          <el-option label="所有" :value="-1"></el-option>
          <el-option label="输入" :value="0"></el-option>
          <el-option label="输出" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作类型:" class="block">
        <el-select v-model="params.operation">
          <el-option
            v-for="item in operationList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="网点编号:" class="block">
        <el-input v-model="params.branchCode" placeholder="请输入网点编号"></el-input>
      </el-form-item>
      <el-form-item label="员工编号:" class="block">
        <el-input v-model="params.stafCode" placeholder="请输入员工编号"></el-input>
      </el-form-item>
      <el-form-item label="设备信息:" class="block">
        <el-input v-model="params.padID" placeholder="请输入设备信息"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary" :disabled="canSubmit || loading">
          搜索
        </el-button>
        <el-button @click="exportExcel" type="primary" :disabled="canSubmit || loading">
          导出excel
        </el-button>
        <el-button @click="onDelData()" type="danger" :disabled="loading">删除</el-button>
        <el-select v-model="dataDelDays">
          <el-option label="1天前数据" :value="1"></el-option>
          <el-option label="7天前数据" :value="7"></el-option>
          <el-option label="30天前数据" :value="30"></el-option>
          <el-option label="90天前数据" :value="90"></el-option>
          <el-option label="180天前数据" :value="180"></el-option>
          <el-option label="360天前数据" :value="360"></el-option>
          <el-option label="所有前数据" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-table
      :data="logList"
      stripe
      border
      height="400"
      :size="tableSize"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="序号" width="80" type="index">
        <template #default="scope">
          <span v-text="getIndex(scope.$index)"></span>
        </template>
      </el-table-column>
      <el-table-column label="数据渠道" prop="channel" width="180"> </el-table-column>
      <el-table-column label="时间" prop="tmstamp" width="180"> </el-table-column>
      <el-table-column label="数据方向" prop="direction" width="80">
        <template #default="{ row }">
          {{ convertDirection(row.direction) }}
        </template>
      </el-table-column>
      <el-table-column label="操作类型" prop="operation" width="100">
        <template #default="{ row }">
          {{ convertOperation(row.operation) }}
        </template>
      </el-table-column>
      <el-table-column label="网点编号" prop="branchCode" width="80">
        <template #default="{ row }">
          {{ row.branchCode ? row.branchCode : '---' }}
        </template>
      </el-table-column>
      <el-table-column label="员工编号" prop="stafCode" width="100">
        <template #default="{ row }">
          {{ row.stafCode ? row.stafCode : '---' }}
        </template>
      </el-table-column>
      <el-table-column label="设备信息" prop="padID">
        <template #default="{ row }">
          {{ row.padID ? row.padID : '---' }}
        </template>
      </el-table-column>

      <el-table-column label="查看数据" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Tickets"
            circle
            plain
            type="primary"
            @click="onShowDetail(row)"
          ></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <el-row>
      <el-col :span="8">
        <el-radio-group v-model="tableSize" style="margin-top: 20px" :disabled="loading">
          <el-radio-button label="large">大</el-radio-button>
          <el-radio-button label="default">中</el-radio-button>
          <el-radio-button label="small">小</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="16">
        <el-pagination
          v-show="logList.length > 0 && !loading"
          v-model:current-page="params.pagenum"
          v-model:page-size="params.pagesize"
          :page-sizes="[2, 5, 10, 20]"
          layout="jumper, total, sizes, prev, pager, next"
          background
          :total="total"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
          style="margin-top: 20px; justify-content: flex-end"
        />
      </el-col>
    </el-row>
  </PageContainer>
  <ContentBox ref="contentBoxRef"></ContentBox>
</template>
<style scoped>
.params {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: left;
}
.params .block {
  width: 22%;
  padding: 0px 3px;
  text-align: center;
}
</style>
