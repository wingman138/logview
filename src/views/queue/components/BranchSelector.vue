<script setup>
import { ref } from 'vue'
import { regionGetService, branchGetService } from '@/api/queue'
import { queueStore } from '@/utils/common'
const regionList = ref([])
const branchList = ref([])
const regionLoading = ref(false)
const branchLoading = ref(false)
const selectValue = ref({
  region: null,
  branch: null
})
queueStore.setBranchId(null)
queueStore.setBranchNo('')
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue', 'branchChange'])
const getRegionList = () => {
  regionLoading.value = true

  selectValue.value.branch = null
  //   emit('update:modelValue', '0')
  regionGetService()
    .then((res) => {
      //   console.log(res)
      regionList.value = res.data.data
      regionLoading.value = false
    })
    .catch(() => {
      regionList.value = []
      regionLoading.value = false
    })
}
getRegionList()
const getBranchList = () => {
  branchLoading.value = true
  selectValue.value.branch = null
  emit('branchChange', null)
  branchGetService(selectValue.value.region)
    .then((res) => {
      branchList.value = res.data.data
      branchLoading.value = false
    })
    .catch(() => {
      branchList.value = []
      branchLoading.value = false
    })
}
const branchSelected = (value) => {
  // console.log(value)
  queueStore.setBranchId(value)
  emit('branchChange', value)
}
</script>
//自定义组件 v-model 子传父，父传子
<template>
  <div class="flex">
    <span>区局:</span>
    <el-select
      v-model="selectValue.region"
      @change="getBranchList"
      :loading="regionLoading"
      placeholder="请选择区局"
      style="max-width: 120px; margin-left: 5px"
    >
      <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <span>网点:</span>
    <el-select
      v-model="selectValue.branch"
      style="max-width: 200px; margin-left: 5px"
      placeholder="请选择区局网点"
      :loading="branchLoading"
      @change="branchSelected"
    >
      <el-option v-for="item in branchList" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <slot name="extra"></slot>
  </div>
</template>
<style lang="scss" scoped>
.block {
  display: flex;
}

.flex {
  // background-color: aqua;
  // border: solid thin red;
  // border: solid thin #d3d0d0;
  width: 99%;
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
    // width: 120px;
    min-width: 80px;
    color: #72767b;
    // border-right: solid thin #d3d0d0;
    // background-color: #72767b;
    // font-size: small;
  }
}
</style>
