<script setup>
import { ref, computed } from 'vue'
import { Delete, FolderAdd, CircleCloseFilled, Edit, CirclePlus } from '@element-plus/icons-vue'
import LayerEdit from '@/views/queue/components/LayerEdit.vue'
import { priorityEditService } from '@/api/queue'
import { priorityBaseList, priorityCompareList, convertPriorityBase, convertPriorityCompare } from '@/utils/common'
const loading = ref(false)
const visibleDrawer = ref(false)
const formRef = ref()
const categoryList = ref([])
const buttonList = ref([])
const curRowIndex = ref(0)
const curBase = ref(0)
const curCompareTo = ref(0)
const curCategory = ref(1)
const curButton = ref(1)
const curGreater = ref(1)
const curCompareButton = ref(0)
const curJudgeTrue = ref(0)
const curJudgeFalse = ref(0)
const priorityTitle = ref('')
const pkid = ref(0)
const branchId = ref(0)
const lines = ref([])
function reset(script) {
  lines.value = []
  curRowIndex.value = -1
  curBase.value = 0
  curCategory.value = 1
  curButton.value = 1
  curGreater.value = 1
  curCompareButton.value = 1
  script.split(' ').forEach((item) => {
    const arr = item.split(':')
    if (arr.length === 5) {
      const item = {
        baseRule: parseInt(arr[0]),
        compareTo: parseInt(arr[1]),
        judgeTrue: parseInt(arr[2]),
        judgeFalse: parseInt(arr[3]),
        content: arr[4]
      }
      lines.value.push(item)
    }
  })
}

const open = (content) => {
  visibleDrawer.value = true
  // defaultContent.value = { ...content }
  categoryList.value = content.categories
  buttonList.value = content.buttons
  priorityTitle.value = content.title
  pkid.value = content.pkid
  branchId.value = content.branchId
  reset(content.script)
  // console.log(content.script)
}
defineExpose({
  open
})

const handleClose = (done) => {
  ElMessageBox.confirm('您确定要关闭么?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
function cancelClick() {
  visibleDrawer.value = false
}
async function confirmClick() {
  if (!priorityTitle.value || priorityTitle.value === '') {
    ElMessage.error('请输入优先级名称')
    return
  }
  const script = buildSettings()
  if (!script) {
    ElMessage.error('尚未编辑优先级内容')
    return
  }
  console.log(script)
  loading.value = true
  const fd = new FormData()
  fd.append('id', pkid.value)
  fd.append('script', script)
  fd.append('name', priorityTitle.value)
  fd.append('branchId', branchId.value)

  await priorityEditService(fd)
    .then(async () => {
      loading.value = false
      visibleDrawer.value = false
      emit('PrioritySaved', 'success')
    })
    .catch(() => {
      loading.value = false
    })
}
const handleCurrentChange = (val) => {
  if (val == null) {
    return
  }
  curBase.value = val.baseRule
  curRowIndex.value = val.rowIndex
  curCompareTo.value = val.compareTo
  curJudgeTrue.value = val.judgeTrue
  curJudgeFalse.value = val.judgeFalse
  if (curBase.value === 0) {
    curButton.value = parseInt(val.content)
    curCategory.value = 1
    curGreater.value = 0
    curCompareButton.value = 1
    curJudgeFalse.value = 0
    curJudgeTrue.value = 0
  } else if (curBase.value === 1) {
    curGreater.value = 0
    curJudgeFalse.value = 0
    curJudgeTrue.value = 0
  } else if (curBase.value === 2) {
    curButton.value = parseInt(val.content.split(',')[0])
    curCategory.value = 1
    curGreater.value = parseInt(val.content.split(',')[1])
    curCompareButton.value = 1
  } else if (curBase.value === 3) {
    curButton.value = 1
    curCategory.value = parseInt(val.content)
    curGreater.value = 0
    curCompareButton.value = 1
    curJudgeFalse.value = 0
    curJudgeTrue.value = 0
  } else if (curBase.value === 4) {
    curButton.value = 1
    curCategory.value = parseInt(val.content.split(',')[0])
    curGreater.value = parseInt(val.content.split(',')[1])
    curCompareButton.value = 1
  } else if (curBase.value === 5) {
    curButton.value = parseInt(val.content.split(',')[0])
    curCategory.value = 1
    curGreater.value = parseInt(val.content.split(',')[2])
    curCompareButton.value = parseInt(val.content.split(',')[1])
  }
}

const onDelete = (row) => {
  ElMessageBox.confirm('您确定要删除么?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      curRowIndex.value = -1
      lines.value.splice(row.rowIndex, 1)
      lines.value.forEach((item) => {
        if (item.judgeTrue > row.rowIndex) {
          item.judgeTrue = item.judgeTrue - 1
        }
        if (item.judgeFalse > row.rowIndex) {
          item.judgeFalse = item.judgeFalse - 1
        }
      })
    })
    .catch(() => {})
}

const onEditLayer = (row) => {
  formRef.value.open({
    script: row.content,
    buttons: buttonList.value
  })
}
const tableRowClassName = ({ row, rowIndex }) => {
  row.rowIndex = rowIndex
}
const onAddRow = () => {
  lines.value.push({
    baseRule: 0,
    compareTo: 0,
    judgeTrue: 0,
    judgeFalse: 0,
    content: '1'
  })
  curRowIndex.value = -1
}
const computeContent = () => {
  if (curBase.value === 0) {
    lines.value[curRowIndex.value].content = curButton.value
  } else if (curBase.value === 2) {
    lines.value[curRowIndex.value].content = curButton.value + ',' + curGreater.value
  } else if (curBase.value === 5) {
    lines.value[curRowIndex.value].content = curButton.value + ',' + curCompareButton.value + ',' + curGreater.value
  } else if (curBase.value === 3) {
    lines.value[curRowIndex.value].content = curCategory.value
  } else if (curBase.value === 4) {
    lines.value[curRowIndex.value].content = curCategory.value + ',' + curGreater.value
  }
}
const onBaseChange = (value) => {
  lines.value[curRowIndex.value].baseRule = value
  if (value === 0) {
    lines.value[curRowIndex.value].content = curButton.value
  } else if (value === 2) {
    lines.value[curRowIndex.value].content = curButton.value + ',' + curGreater.value
  } else if (value === 5) {
    lines.value[curRowIndex.value].content = curButton.value + ',' + curCompareButton.value + ',' + curGreater.value
  } else if (value === 3) {
    lines.value[curRowIndex.value].content = curCategory.value
  } else if (value === 4) {
    lines.value[curRowIndex.value].content = curCategory.value + ',' + curGreater.value
  }
}
const onCompareChange = (value) => {
  lines.value[curRowIndex.value].compareTo = value
}
const onJudgeTrueChange = (value) => {
  lines.value[curRowIndex.value].judgeTrue = value
}
const onJudgeFalseChange = (value) => {
  lines.value[curRowIndex.value].judgeFalse = value
}
const disableW = computed(() => (w) => {
  if (curRowIndex.value < 0) {
    return true
  }
  return w === 'base'
    ? false
    : w === 'compare'
      ? curBase.value === 0 || curBase.value === 3
      : w === 'button'
        ? curBase.value === 1 || curBase.value === 3 || curBase.value === 4
        : w === 'category'
          ? curBase.value === 0 || curBase.value === 1 || curBase.value === 2 || curBase.value === 5
          : w === 'compareButton'
            ? curBase.value !== 5
            : w === 'greater'
              ? curBase.value === 0 || curBase.value === 1 || curBase.value === 3
              : w === 'judge'
                ? curBase.value === 0 || curBase.value === 1 || curBase.value === 3
                : false
})
const onLayerChange = (script) => {
  // console.log(script)
  lines.value[curRowIndex.value].content = script
}
const buildSettings = () => {
  if (lines.value.length === 0) {
    return ''
  }
  return lines.value
    .map((item) => {
      return `${item.baseRule}:${item.compareTo}:${item.judgeTrue}:${item.judgeFalse}:${item.content}`
    })
    .join(' ')
}
const emit = defineEmits(['PrioritySaved'])
</script>
<template>
  <el-drawer v-model="visibleDrawer" :before-close="handleClose" :show-close="false" direction="rtl" size="75%">
    <template #header>
      <div class="flex">
        <span>优先级名称:</span>
        <el-input v-model.trim="priorityTitle" placeholder="请输入名称" style="margin-right: 10px"></el-input>
        <el-button @click="onAddRow()" type="primary" :disabled="loading">
          <el-icon><CirclePlus /></el-icon>
          添加行
        </el-button>
      </div>
    </template>

    <template #default>
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="lines"
            @row-click="handleCurrentChange"
            border
            height="400"
            style="width: 100%"
            :highlight-current-row="true"
            :row-class-name="tableRowClassName"
          >
            <el-table-column label="序号" width="60" type="index"> </el-table-column>
            <el-table-column label="判断准则" prop="baseRule" width="260">
              <template #default="{ row }">
                {{ convertPriorityBase(row.baseRule).label }}
              </template>
            </el-table-column>
            <el-table-column label="基于" prop="compareTo" width="160">
              <template #default="{ row }">
                {{ convertPriorityCompare(row.compareTo).label }}
              </template>
            </el-table-column>
            <el-table-column label="为真跳转行" prop="judgeTrue" width="80"> </el-table-column>
            <el-table-column label="为假跳转行" prop="judgeFalse" width="80"> </el-table-column>
            <el-table-column label="设置内容" prop="content"> </el-table-column>

            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button @click="onEditLayer(row)" size="small" type="primary" :disabled="row.baseRule != 1">
                  <el-icon><Edit /></el-icon>
                  编辑层次
                </el-button>
                <el-button @click="onDelete(row)" size="small" type="danger">
                  <el-icon><Delete /></el-icon>
                  删除行
                </el-button>
              </template>
            </el-table-column>

            <template #empty>
              <el-empty description="没有数据" />
            </template>
          </el-table>
        </el-col>
      </el-row>
      <el-divider border-style="dashed" />

      <el-row>
        <el-col :span="12" class="flex">
          <span>判断准则:</span>
          <el-select v-model="curBase" placeholder="请选择" @change="onBaseChange" :disabled="disableW('base')">
            <el-option v-for="item in priorityBaseList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="12" class="flex">
          <span>基于:</span>
          <el-select v-model="curCompareTo" placeholder="请选择" :disabled="disableW('compare')" @change="onCompareChange">
            <el-option v-for="item in priorityCompareList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="flex">
          <span>号票键:</span>
          <el-select v-model="curButton" placeholder="请选择" :disabled="disableW('button')" @change="computeContent">
            <el-option v-for="item in buttonList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-col>
        <el-col :span="12" class="flex">
          <span>类别:</span>
          <el-select v-model="curCategory" placeholder="请选择" :disabled="disableW('category')" @change="computeContent">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="flex">
          <span>被比较号票键:</span>
          <el-select v-model="curCompareButton" placeholder="请选择" @change="computeContent" :disabled="disableW('compareButton')">
            <el-option v-for="item in buttonList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-col>
        <el-col :span="12" class="flex">
          <span>大于:</span>
          <el-input-number v-model="curGreater" :min="1" :max="9999" @change="computeContent" :disabled="disableW('greater')" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="flex">
          <span>判断为真跳转行:</span>
          <el-input-number v-model="curJudgeTrue" :min="0" :max="lines.length" @change="onJudgeTrueChange" :disabled="disableW('judge')" />
        </el-col>
        <el-col :span="12" class="flex">
          <span>判断为假跳转行:</span>
          <el-input-number v-model="curJudgeFalse" :min="0" :max="lines.length" @change="onJudgeFalseChange" :disabled="disableW('judge')" />
        </el-col>
      </el-row>
      <layer-edit ref="formRef" @layer-change="onLayerChange"></layer-edit>
    </template>
    <template #footer>
      <el-button type="primary" @click="confirmClick" :disabled="loading">
        <el-icon class="el-icon--left"><FolderAdd /></el-icon>
        保存
      </el-button>
      <el-button type="danger" @click="cancelClick" :disabled="loading">
        <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
        关闭
      </el-button>
    </template>
  </el-drawer>
</template>
<style lang="scss" scoped>
.flex {
  // background-color: aqua;
  // border: solid thin red;
  width: 100%;
  display: inline-flex;
  justify-content: left;
  flex-wrap: nowrap;
  align-items: center; /* 水平居中对齐 */
  margin-bottom: 5px;
  span {
    display: flex;
    justify-content: right;
    margin-right: 5px;
    white-space: nowrap;
    width: 120px;
    color: #72767b;
    // font-size: small;
  }
  .el-select {
    width: 60%;
    margin-right: 5px;
  }
}
</style>
