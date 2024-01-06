<script setup>
import { ref, onMounted } from 'vue'
import ContentBox from './components/ContentBox.vue'
import { timeAdd } from '@/utils/format'
import { logGetListService } from '@/api/logs'
import { channelList, operationList, convertDirection, convertOperation } from '@/utils/common'
const loading = ref(false)
const total = ref(0)

const logList = ref([])
const contentBoxRef = ref()
const formRef = ref()
const params = ref({
  pagenum: 1,
  pagesize: 5,
  startTime: '2000-01-01 00:00:00',
  endTime: '2000-01-02 00:00:00',
  channel: 0,
  direction: 0,
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
const onShowDetail = (data) => {
  contentBoxRef.value.open(data)
}
const onReset = () => {
  logList.value = []
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
        console.log(res.data.data.list)
        logList.value = res.data.data.list
        total.value = res.data.data.total
      }
      loading.value = false
    })
    .catch(() => {
      logList.value = []
      loading.value = false
    })

  loading.value = false
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
</script>
<template>
  <PageContainer title="日志查询">
    <el-form class="params" :model="params" :rules="rules" ref="formRef">
      <el-form-item label="开始时间:" prop="startTime">
        <div class="block">
          <el-date-picker
            v-model="params.startTime"
            type="datetime"
            placeholder="请选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY-MM-DD"
            time-format="HH:mm:ss"
          />
        </div>
      </el-form-item>
      <el-form-item label="结束时间:" prop="endTime">
        <div class="block">
          <el-date-picker
            v-model="params.endTime"
            type="datetime"
            placeholder="请选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY-MM-DD"
            time-format="HH:mm:ss"
          />
        </div>
      </el-form-item>
      <el-form-item label="数据渠道:">
        <el-select v-model="params.channel">
          <el-option v-for="item in channelList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="数据方向:">
        <el-select v-model="params.direction">
          <el-option label="输入" :value="0"></el-option>
          <el-option label="输出" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作类型:">
        <el-select v-model="params.operation">
          <el-option v-for="item in operationList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="网点编号:">
        <el-input v-model="params.branchCode" placeholder="请输入网点编号"></el-input>
      </el-form-item>
      <el-form-item label="员工编号:">
        <el-input v-model="params.stafCode" placeholder="请输入员工编号"></el-input>
      </el-form-item>
      <el-form-item label="设备信息:">
        <el-input v-model="params.padID" placeholder="请输入设备信息"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary" :disabled="canSubmit">搜索</el-button>
        <el-button @click="onReset()">清空</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="logList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" width="80" type="index"> </el-table-column>
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
      <!--
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditArticle(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDeleteArticle(row)"></el-button>
        </template>
      </el-table-column>
    -->
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
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
  align-items: stretch;
}
.params.block {
  padding: 30px 0;
  text-align: center;
}
</style>
