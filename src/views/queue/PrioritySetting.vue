<script setup>
import BranchSelector from './components/BranchSelector.vue'
import PriorityEdit from './components/PriorityEdit.vue'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { priorityGetService, priorityDelService } from '@/api/queue'
const loading = ref(false)
const branchId = ref()
const priorities = ref([])
const categories = ref([])
const buttons = ref([])
const editFormRef = ref()
// 可以在branch-selector添加@branchChange事件，然后在这里监听
const getPriority = async (value) => {
  branchId.value = value
  if (value) {
    loading.value = true
    await priorityGetService(value)
      .then((res) => {
        // console.log(res)
        loading.value = false
        priorities.value = res.data.data.priorities
        categories.value = [...res.data.data.categories]
        buttons.value = res.data.data.buttons
      })
      .catch(() => {
        loading.value = false
        priorities.value = []
      })
  } else {
    priorities.value = []
  }
}
// watch(
//   () => params.branchId,
//   (value) => {
//     console.log(value)
//     if (value) {
//     }
//   }
// )
const onEdit = (row) => {
  // console.log(row)
  //编辑
  if (row) {
    editFormRef.value.open({
      title: row.name,
      pkid: row.id,
      script: row.script,
      categories: categories.value,
      buttons: buttons.value,
      branchId: branchId.value
    })
  } else {
    //新增
    editFormRef.value.open({
      title: '',
      pkid: 0,
      script: '',
      categories: categories.value,
      buttons: buttons.value,
      branchId: branchId.value
    })
  }
}
// 转换 formData 数据

const onDelete = (row) => {
  ElMessageBox.confirm('您确定要删除么?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      loading.value = true
      const fd = new FormData()
      fd.append('id', row.id)
      await priorityDelService(fd)
        .then(async () => {
          loading.value = false
          await getPriority(branchId.value)
        })
        .catch(() => {
          loading.value = false
          priorities.value = []
        })
    })
    .catch(() => {})
}
const onPrioritySaved = async (value) => {
  console.log('onPrioritySaved')
  if (value === 'success') {
    await getPriority(branchId.value)
  }
}
</script>
<template>
  <PageContainer title="优先级设置">
    <template #extra>
      <branch-selector @branchChange="getPriority" width="700px">
        <template #extra>
          <el-button @click="onEdit(null)" :icon="Plus" type="primary" style="margin-left: 10px">添加 </el-button>
        </template>
      </branch-selector>
    </template>
    <el-table :data="priorities" stripe border height="660" style="width: 100%; margin-top: 8px" v-loading="loading">
      <el-table-column label="序号" width="80" prop="no"> </el-table-column>
      <el-table-column label="名称" prop="name"> </el-table-column>

      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-tooltip effect="dark" content="修改" :auto-close="500" placement="top">
            <el-button :icon="Edit" circle plain type="primary" @click="onEdit(row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" :auto-close="500" placement="top">
            <el-button :icon="Delete" circle plain type="danger" @click="onDelete(row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
  </PageContainer>
  <priority-edit ref="editFormRef" @PrioritySaved="onPrioritySaved"></priority-edit>
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
}
</style>
