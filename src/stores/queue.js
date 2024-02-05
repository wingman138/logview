import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useQueueStore = defineStore(
  'queue-store',
  () => {
    const branchId = ref(0)
    const branchNo = ref('0')

    const setBranchId = (newVal) => {
      branchId.value = newVal
    }
    const setBranchNo = (newVal) => {
      branchNo.value = newVal
    }

    return {
      branchId,
      branchNo,
      setBranchId,
      setBranchNo
    }
  },
  {
    persist: false
  }
)
