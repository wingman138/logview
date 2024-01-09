<script setup>
import BranchSelector from './components/BranchSelector.vue'
import { reactive, watch } from 'vue'
const params = reactive({
  branchId: ''
})
// 可以在branch-selector添加@branchChange事件，然后在这里监听
const getPriority = (value) => {
  console.log(value)
}
// watch(
//   () => params.branchId,
//   (value) => {
//     console.log(value)
//     if (value) {
//     }
//   }
// )
</script>
<template>
  <PageContainer title="优先级设置"
    ><branch-selector @branchChange="getPriority" width="500px"></branch-selector
  ></PageContainer>
</template>
