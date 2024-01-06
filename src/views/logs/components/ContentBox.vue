<script setup>
import { ref } from 'vue'
// import '@vueup/vue-quill/dist/vue-quill.snow.css'

const visibleDrawer = ref(false)

const defaultContent = {
  inputMessage: '',
  outputMessage: ''
}
const detailContent = ref({ ...defaultContent })
const open = (content) => {
  visibleDrawer.value = true
  detailContent.value = { ...content }
}

defineExpose({
  open
})

const onClose = () => {
  visibleDrawer.value = false
}
</script>

<template>
  <el-drawer v-model="visibleDrawer" title="数据详情" direction="rtl" size="50%">
    <el-row>
      <el-col :span="24">
        <div class="banner">输入数据:</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"
        ><div class="main input">
          {{ detailContent.inputMessage }}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="banner">输入数据:</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"
        ><div class="main output">
          {{ detailContent.outputMessage }}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="footer"><el-button @click="onClose()" type="primary">关闭</el-button></div>
      </el-col>
    </el-row>
  </el-drawer>
</template>
<style lang="scss" scoped>
.main {
  width: 100%;
  border: solid thin #c9d3f0;
  color: #1750ed;
  word-wrap: break-word;
  overflow-y: auto;
  padding: 5px;
}
.input {
  height: 40vh;
}

.output {
  height: 30vh;
}
.footer {
  padding: 10px;
  height: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.banner {
  padding: 10px;
  height: 14px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
</style>
