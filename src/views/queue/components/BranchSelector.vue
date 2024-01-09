<script setup>
import { ref } from 'vue'
import { regionGetService, branchGetService } from '@/api/queue'
const regionList = ref([])
const branchList = ref([])
const regionLoading = ref(false)
const branchLoading = ref(false)

const selectValue = ref({
  region: null,
  branch: null
})

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
  branchGetService(selectValue.value.region)
    .then((res) => {
      branchList.value = res.data.data
      if (res.data.data.length > 0) {
        selectValue.value.branch = res.data.data[0].id
      } else {
        selectValue.value.branch = null
      }

      branchLoading.value = false
    })
    .catch(() => {
      branchList.value = []
      branchLoading.value = false
    })
}
const branchSelected = (value) => {
  emit('branchChange', value)
}
</script>
//自定义组件 v-model 子传父，父传子
<template>
  <el-row :style="{ width }">
    <el-col :span="10">
      区局:<el-select
        v-model="selectValue.region"
        @change="getBranchList"
        :loading="regionLoading"
        placeholder="请选择区局"
        style="max-width: 120px; margin-left: 5px"
      >
        <el-option
          v-for="item in regionList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-col>
    <el-col :span="14">
      网点:<el-select
        v-model="selectValue.branch"
        style="max-width: 200px; margin-left: 5px"
        placeholder="请选择区局网点"
        :loading="branchLoading"
        @change="branchSelected"
      >
        <el-option
          v-for="item in branchList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-col>
  </el-row>
</template>
<style scoped>
.block {
  display: flex;
}
</style>
