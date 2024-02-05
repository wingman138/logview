<script setup>
import { ref, nextTick } from 'vue'
import { Delete, Edit, CircleCloseFilled, SuccessFilled, CirclePlus } from '@element-plus/icons-vue'
const visibleDrawer = ref(false)

let buttonList = []
const curRowIndex = ref(0)
const curLevel = ref(1)
const curButton = ref(1)

const lines = ref([])
function reset(script) {
  lines.value = []
  curRowIndex.value = -1
  curLevel.value = 1
  curButton.value = 1
  if (script) {
    script.split('@').forEach((item) => {
      const arr = item.split(',')
      if (arr.length === 2) {
        const item = {
          level: parseInt(arr[0]),
          button: parseInt(arr[1])
        }
        lines.value.push(item)
      }
    })
  }
}

const open = (content) => {
  visibleDrawer.value = true
  buttonList = [...content.buttons, { id: 0, name: '已经不存在' }]
  //   console.log(buttonList)
  reset(content.script)
  // console.log(lines.value)
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
  //   console.log('cancelClick')
  visibleDrawer.value = false
}
function confirmClick() {
  const script = lines.value
    .map((x) => {
      return `${x.level},${x.button}`
    })
    .join('@')
  //   console.log(script)
  visibleDrawer.value = false
  emit('layerChange', script)
}
const handleCurrentChange = (val) => {
  if (val == null) {
    return
  }
  curLevel.value = val.level
  curRowIndex.value = val.rowIndex
  const item = buttonList ? buttonList.find((x) => x.id === val.button) : null
  if (item) {
    curButton.value = item.id
  } else {
    curButton.value = 0
  }
}

const onDelete = (row) => {
  lines.value.splice(row.rowIndex, 1)
  nextTick(() => {
    curRowIndex.value = -1
  })
}
const tableRowClassName = ({ row, rowIndex }) => {
  row.rowIndex = rowIndex
}
const getButtonName = (id) => {
  const item = buttonList.find((x) => x.id == id)
  return item ? { name: item.name, id: item.id } : { name: '已经不存在', id: 0 }
}
const onAddRow = () => {
  curRowIndex.value = -1
  if (curButton.value === 0) {
    ElMessage.error('请选择按键')
    return
  }
  let b = lines.value.find((x) => x.button === curButton.value)
  if (b != undefined) {
    ElMessage.error('按键已经存在不能再添加')
    return
  }
  const item = {
    level: curLevel.value,
    button: curButton.value
  }
  lines.value.push(item)
}

const onEditRow = () => {
  //   console.log(curRowIndex.value)

  if (curButton.value === 0) {
    ElMessage.error('请选择按键')
    return
  }
  if (curRowIndex.value < 0) {
    ElMessage.error('请选择要更改的行')
    return
  }
  for (let i = 0; i < lines.value.length; i++) {
    if (i === curRowIndex.value) {
      continue
    }
    if (lines.value[i].button === curButton.value) {
      ElMessage.error('按键已经存在不能再更改')
      return
    }
  }
  lines.value[curRowIndex.value].level = curLevel.value
  lines.value[curRowIndex.value].button = curButton.value
}
const emit = defineEmits(['layerChange'])
</script>
<template>
  <el-drawer v-model="visibleDrawer" :before-close="handleClose" :show-close="false" direction="rtl" size="50%">
    <template #header>
      <div class="flex">
        <span style="width: 40px">级别:</span>
        <el-input-number v-model="curLevel" :min="1" :max="9999" />
        <span>按键:</span>
        <el-select v-model="curButton" placeholder="请选择">
          <el-option v-for="item in buttonList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-button @click="onAddRow()" type="primary">
          <el-icon><CirclePlus /></el-icon>
          添加
        </el-button>
        <el-button @click="onEditRow()" type="primary" :disabled="curRowIndex < 0">
          <el-icon><Edit /></el-icon>
          更改
        </el-button>
      </div>
    </template>

    <template #default>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="lines"
            @row-click="handleCurrentChange"
            border
            height="500"
            style="width: 100%"
            :highlight-current-row="true"
            :row-class-name="tableRowClassName"
          >
            <el-table-column label="序号" width="60" type="index"> </el-table-column>
            <el-table-column label="级别" prop="level" width="260"> </el-table-column>
            <el-table-column label="按键" prop="button" width="160">
              <template #default="{ row }">
                <el-text :type="getButtonName(row.button).id === 0 ? 'danger' : 'info'" disable-transitions>
                  {{ getButtonName(row.button).name }}
                </el-text>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button @click="onDelete(row)" size="small" type="danger">
                  <el-icon><Delete /></el-icon>
                  删除
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
    </template>
    <template #footer>
      <el-button type="primary" @click="confirmClick">
        <el-icon class="el-icon--left"><SuccessFilled /></el-icon>
        确定
      </el-button>
      <el-button type="danger" @click="cancelClick">
        <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
        关闭
      </el-button>
    </template>
  </el-drawer>
</template>
<style lang="scss" scoped>
.flex {
  // background-color: aqua;
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
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
}
</style>
