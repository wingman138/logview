<!-- eslint-disable no-undef -->
<script setup>
import { DataBoard, Files, Management, Promotion, SetUp, Setting, Ticket, TrendCharts } from '@element-plus/icons-vue'
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/logs/view">
          <el-icon><Management /></el-icon>
          <span>接口日志查询</span>
        </el-menu-item>
        <el-sub-menu index="/queue">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>排队系统</span>
          </template>
          <el-menu-item index="/queue/category">
            <el-icon><Files /></el-icon>
            <span>类别管理</span>
          </el-menu-item>
          <el-menu-item index="/queue/button">
            <el-icon><SetUp /></el-icon>
            <span>按键管理</span>
          </el-menu-item>
          <el-menu-item index="/queue/ticket">
            <el-icon><Ticket /></el-icon>
            <span>号票管理</span>
          </el-menu-item>
          <el-menu-item index="/queue/priority">
            <el-icon><TrendCharts /></el-icon>
            <span>优先级管理</span>
          </el-menu-item>
          <el-menu-item index="/queue/page">
            <el-icon><DataBoard /></el-icon>
            <span>取号界面管理</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/other/building">
          <el-icon><Promotion /></el-icon>
          <span>其他</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>柜面清系统 ©2023 Created by chg</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
