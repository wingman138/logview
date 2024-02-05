<script setup>
import BranchSelector from './components/BranchSelector.vue'
import TicketEdit from './components/TicketEdit.vue'
import { Edit, Delete, Plus, CopyDocument } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ticketGetService, ticketDelService, ticketGhostService } from '@/api/queue'
import { queueStore } from '@/utils/common'
const loading = ref(false)
const tickets = ref([])
const categories = ref([])
const pics = ref([])
const buttons = ref([])
const editFormRef = ref()
// 可以在branch-selector添加@branchChange事件，然后在这里监听
const getTicket = async (value) => {
  if (value) {
    loading.value = true
    await ticketGetService(value)
      .then((res) => {
        // console.log(res)
        loading.value = false
        tickets.value = res.data.data.tickets
        categories.value = [...res.data.data.categories]
        buttons.value = res.data.data.buttons
        pics.value = res.data.data.pics
      })
      .catch(() => {
        loading.value = false
        tickets.value = []
      })
  } else {
    tickets.value = []
  }
}

const onEdit = async (row) => {
  // console.log(row)
  //编辑
  if (row) {
    editFormRef.value.open({
      title: row.name,
      pkid: row.id,
      tickets: row.items,
      pageHeight: row.pageHeight,
      pageWidth: row.pageWidth,
      categories: categories.value,
      buttons: buttons.value,
      pics: pics.value
    })
  } else {
    //新增
    editFormRef.value.open({
      title: '',
      pkid: 0,
      tickets: [],
      pageHeight: 0,
      pageWidth: 0,
      categories: categories.value,
      buttons: buttons.value,
      pics: pics.value
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
      await ticketDelService(fd)
        .then(async () => {
          loading.value = false
          await getTicket(queueStore.branchId)
        })
        .catch(() => {
          loading.value = false
        })
    })
    .catch(() => {})
}

const onGhost = async (row) => {
  loading.value = true
  const fd = new FormData()
  fd.append('id', row.id)
  await ticketGhostService(fd)
    .then(async () => {
      loading.value = false
      await getTicket(queueStore.branchId)
    })
    .catch(() => {
      loading.value = false
    })
}
const onTicketSaved = async (value) => {
  if (value === 'success') {
    await getTicket(queueStore.branchId)
  }
}
</script>
<template>
  <PageContainer title="号票设置">
    <template #extra>
      <branch-selector @branchChange="getTicket" width="700px">
        <template #extra>
          <el-button @click="onEdit(null)" :icon="Plus" type="primary" style="margin-left: 10px">添加 </el-button>
        </template>
      </branch-selector>
    </template>
    <el-table :data="tickets" stripe border height="660" style="width: 100%; margin-top: 8px" v-loading="loading">
      <el-table-column label="序号" width="80" prop="no"> </el-table-column>
      <el-table-column label="名称" prop="name"> </el-table-column>

      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-tooltip effect="dark" content="修改" :auto-close="500" placement="top">
            <el-button :icon="Edit" circle plain type="primary" @click="onEdit(row)"> </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" :auto-close="500" placement="top">
            <el-button :icon="Delete" circle plain type="danger" @click="onDelete(row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="克隆" :auto-close="500" placement="top">
            <el-button :icon="CopyDocument" circle plain type="primary" @click="onGhost(row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
  </PageContainer>
  <ticket-edit ref="editFormRef" @TicketSaved="onTicketSaved"></ticket-edit>
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
