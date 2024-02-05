<script setup>
// import { DocumentAdd } from '@element-plus/icons-vue'
defineProps({
  tagTitle: {
    type: String,
    default: ''
  },
  tagIcon: {
    type: String,
    default: ''
  },
  direction: {
    type: String,
    default: 'left-to-right disabled-tag'
  }
})
</script>
<template>
  <div :class="direction">
    <el-icon class="icon">
      <component :is="tagIcon"></component>
    </el-icon>
    <el-text type="primary" size="small"> {{ tagTitle }} </el-text>
  </div>
</template>
<style lang="scss" scoped>
.left-to-right {
  padding: 2px 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  width: 100px;

  border: solid 1px rgb(193, 191, 191);
  //   background-color: rgb(208, 244, 244);
  border-radius: 5px;
  margin: 2px;
  .icon {
    margin-right: 4px;
  }
}
.disabled-tag {
  background-color: rgb(220, 215, 215);
}
.top-to-bottom {
  padding: 4px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  border: solid 1px rgb(193, 191, 191);
  //   background-color: rgb(208, 244, 244);
  border-radius: 5px;
  margin: 2px;
  .icon {
    margin-right: 4px;
  }
}
</style>
