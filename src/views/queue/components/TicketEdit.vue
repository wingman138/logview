<script setup>
import VueDrag from '@/components/DragResize.vue'
import { reactive, ref, computed, watch, onBeforeUnmount } from 'vue'
import { formatTimeDef } from '@/utils/format'
import SelectTag from '@/components/SelectTag.vue'
import { getDeviceDPI, mmToPx, guid, pxToPt, pxToMm, queueStore, parseTicket } from '@/utils/common'
import { ticketEditService, picGetService } from '@/api/queue'
import VueRulerTool from '@/components/ruler-tool/vue-ruler-tool-1.vue'
const visibleDrawer = ref(false)
const loading = ref(false)
const ruler = ref(null)
// const items = ref([])
// const presetLine = ref([
//   { type: 'l', site: 100 },
//   { type: 'v', site: 200 }
// ])
const categoryList = ref([])
const buttonList = ref([])
const pics = ref([])
const ticketTitle = ref('')
const pkid = ref(0)
// const branchId = queueStore.branchId
let offsetX = 0
let offsetY = 0

// var canvasPxW=0
// var canvasPxH=0
//画布毫米尺寸
const canvasMmW = ref(80)
const canvasMmH = ref(120)
const curTicket = ref({})
let stopWatchImg = null
let stopWatchFontSize = null

const tags = reactive([
  {
    groupName: '文本组件',
    groupId: '1',
    children: [
      {
        id: 'text-info',
        title: '静态文字',
        icon: 'DocumentAdd',
        type: 'text',
        value: '欢迎光临',
        alias: 'TX'
      },
      {
        id: 'text-script',
        title: '自定义脚本...',
        icon: 'Box',
        type: 'text',
        value: '请输入自定义脚本',
        alias: 'TS'
      },
      {
        id: 'text-barcode',
        title: '条码...',
        icon: 'Box',
        type: 'text',
        value: '请输入条码内容',
        alias: 'TB'
      },
      {
        id: 'text-qr',
        title: '二维码...',
        icon: 'Box',
        type: 'text',
        value: '请输入二维码内容',
        alias: 'TQ'
      }
    ]
  },
  {
    groupName: '功能组件',
    groupId: '2',
    children: [
      {
        id: 'static-picture',
        title: '图片',
        icon: 'Picture',
        type: 'image',
        value: '',
        alias: 'IM'
      },
      {
        id: 'static-date',
        title: '日期',
        icon: 'Calendar',
        type: 'text',
        value: '2000-01-01',
        alias: 'DA'
      },
      {
        id: 'static-time',
        title: '时间',
        icon: 'Timer',
        type: 'text',
        value: '13:00:00',
        alias: 'TM'
      },
      {
        id: 'static-datetime',
        title: '日期时间',
        icon: 'Timer',
        type: 'text',
        value: '2000-01-01 12:00:00',
        alias: 'DT'
      },
      {
        id: 'function-queue',
        title: '当前业务等候人数',
        icon: 'User',
        type: 'text',
        value: '0100',
        alias: 'GU'
      },
      {
        id: 'function-more-queue',
        title: '多业务等候人数',
        icon: 'User',
        type: 'text',
        value: '0100',
        alias: 'SM'
      },
      {
        id: 'function-cate-queueNo',
        title: '当前类别号码',
        icon: 'Ticket',
        type: 'text',
        value: '1234',
        alias: 'GQ'
      },

      {
        id: 'function-category',
        title: '当前类别名称',
        icon: 'Box',
        type: 'text',
        value: '综合业务办理',
        alias: 'GN'
      },
      {
        id: 'function-button',
        title: '当前按键名称...',
        icon: 'Box',
        type: 'text',
        value: '综合业务办理(VIP)',
        alias: 'BN'
      }
    ]
  }
])
const tickets = ref([])

// 获取设备DPI
const deviceDPI = getDeviceDPI()

// #region 打开抽屉

const open = async (content) => {
  visibleDrawer.value = true
  categoryList.value = content.categories
  buttonList.value = content.buttons

  if (content.pics && content.pics.length > 0) pics.value = ['------', ...content.pics]
  else pics.value = ['------']
  ticketTitle.value = content.title
  pkid.value = content.pkid
  curTicket.value = {}
  canvasMmW.value = content.pageWidth === 0 ? 80 : Math.round(pxToMm(content.pageWidth, deviceDPI))
  canvasMmH.value = content.pageHeight === 0 ? 120 : Math.round(pxToMm(content.pageHeight, deviceDPI))
  loading.value = true
  const tks = await parseTicket(content.tickets, canvasPxW.value)
  tickets.value = tks
  loading.value = false
  startWatch()
  // presetLine.value = []
  ruler.value.cleanLine()
  ruler.value.addEventHooks()
}
// #endregion

defineExpose({
  open
})
const handleClose = (done) => {
  ElMessageBox.confirm('您确定要关闭么?')
    .then(() => {
      // console.log('关闭')
      stopWatch()
      ruler.value.cleanEventHooks()
      done()
    })
    .catch(() => {
      // catch error
    })
}
function cancelClick() {
  visibleDrawer.value = false
  stopWatch()
  ruler.value.cleanEventHooks()
}
async function confirmClick() {
  if (!ticketTitle.value || ticketTitle.value === '') {
    ElMessage.error('请输入号票名称')
    return
  }

  if (!ticketScript.value) {
    ElMessage.error('尚未编辑号票内容')
    return
  }
  loading.value = true
  const fd = new FormData()
  fd.append('id', pkid.value)
  fd.append('script', ticketScript.value)
  fd.append('name', ticketTitle.value)
  // console.log(branchId)
  fd.append('branchId', queueStore.branchId)
  // console.log('save', pkid.value, ticketScript.value, ticketTitle.value, queueStore.branchId)
  await ticketEditService(fd)
    .then(async () => {
      loading.value = false
      visibleDrawer.value = false
      stopWatch()
      ruler.value.cleanEventHooks()
      emit('TicketSaved', 'success')
    })
    .catch(() => {
      loading.value = false
      stopWatch()
      ruler.value.cleanEventHooks()
    })
}
const emit = defineEmits(['TicketSaved'])
const dragend = (event) => {
  event.dataTransfer.clearData()
  // console.log('dragend', event)
}
function getElContent(id, value) {
  const rtn =
    id === 'text-info' || id === 'text-script' || id === 'text-barcode' || id === 'text-qr'
      ? { text: value }
      : id === 'static-picture'
        ? { text: value, image: { src: '/src/assets/logo.png', fit: 'fill' } }
        : id === 'static-date'
          ? { text: formatTimeDef(new Date(), 'YYYY-MM-DD') }
          : id === 'static-time'
            ? { text: formatTimeDef(new Date(), 'HH:mm:ss') }
            : id === 'static-datetime'
              ? { text: formatTimeDef(new Date(), 'YYYY-MM-DD HH:mm:ss') }
              : id === 'function-queue'
                ? { text: '0100' }
                : id === 'function-more-queue'
                  ? { text: '0200' }
                  : id === 'function-cate-queueNo' || id === 'function-button-queueNo'
                    ? { text: '1234' }
                    : id === 'function-category'
                      ? { text: '综合业务办理' }
                      : id === 'function-button'
                        ? { text: '综合业务办理(vip)' }
                        : id === 'function-script'
                          ? { text: '自定义脚本' }
                          : { text: '' }
  // console.log(rtn)
  return rtn
}

const drop = (event) => {
  const arg = JSON.parse(event.dataTransfer.getData('arg'))
  //   console.log('drop', arg)
  let { type, title, value, id, groupId, alias } = arg
  let y = event.offsetY - offsetY < 0 ? 0 : event.offsetY - offsetY
  let x = event.offsetX - offsetX < 0 ? 0 : event.offsetX - offsetX

  const item = getElContent(id, value)
  // console.log(item)
  x = x + 120 > canvasPxW.value ? canvasPxW.value - 120 : x
  let data = {
    id: guid(),
    width: 120,
    height: 24,
    top: y,
    left: x,
    draggable: true,
    resizable: true,
    minw: 10,
    minh: 10,
    axis: 'both',
    parentLim: true,
    snapToGrid: false,
    aspectRatio: false,
    zIndex: 2,
    color: 'black',
    backgroundColor: 'white',
    fontSize: 12,
    active: true,
    elType: type,
    elName: title,
    functionCode: id,
    defaultText: item.text,
    bindLabel: alias === 'IM' ? '------' : [1],
    bindVal: '',
    groupId: groupId,
    alias: alias,
    item: item
  }
  // console.log(data)
  curTicket.value = { ...data }
  tickets.value.push(data)
}
const dragstart = (event, arg) => {
  offsetX = event.offsetX
  offsetY = event.offsetY
  // console.log('dragstart', arg)
  event.dataTransfer.setData('arg', JSON.stringify(arg))
}
const onResize = (newRect) => {
  curTicket.value.left = newRect.left
  curTicket.value.top = newRect.top
  curTicket.value.width = newRect.width
  curTicket.value.height = newRect.height
  // console.log('onResize', newRect.left, newRect.top, newRect.width, newRect.height)
}
const onActivateEv = (id) => {
  curTicket.value = tickets.value.find((item) => item.id === id)
  //   console.log('vueDragActivated', curTicket.value.item.text)
  tickets.value.forEach((item) => {
    if (item.id === id) {
      item.active = true
    } else {
      item.active = false
    }
  })
}
// const onDeactivateEv = () => {
//   console.log('onDeactivateEv')
// }
const onCanvasClick = () => {
  curTicket.value = {}
  tickets.value.forEach((item) => (item.active = false))
  // let p = [
  //   { type: 'l', site: $event.offsetX },
  //   { type: 'v', site: $event.offsetY }
  // ]
  ruler.value.cleanLine()
}
//拖拽组件防止冒泡
const onDragClick = () => {}

const activeName = ref(['1', '2'])

//画布毫米尺寸转像素
const canvasPxW = computed(() => {
  // console.log('computed')
  const px = mmToPx(canvasMmW.value, deviceDPI)
  // console.log('canvasPxW', px)
  // if (ruler.value) {
  //   ruler.value.init()
  // }

  return px
})
const canvasPxH = computed(() => {
  const px = mmToPx(canvasMmH.value, deviceDPI)
  // console.log('canvasPxH', px)
  // if (ruler.value) {
  //   ruler.value.init()
  // }
  return px
})

const ticketScript = computed(() => {
  if (tickets.value) {
    let script = tickets.value
      .map((item) => {
        return item.groupId === '1'
          ? item.alias +
              ':' +
              item.defaultText.trim() +
              ' at:' +
              item.left +
              ',' +
              item.top +
              ',' +
              item.width +
              ',' +
              item.height +
              ' font:宋体,' +
              pxToPt(item.fontSize, deviceDPI)
          : item.alias === 'IM'
            ? item.alias +
              ':' +
              item.bindLabel.trim() +
              ' at:' +
              item.left +
              ',' +
              item.top +
              ',' +
              item.width +
              ',' +
              item.height +
              ' font:宋体,12.0'
            : item.alias === 'SM'
              ? item.alias +
                ':' +
                (item.bindLabel ? item.bindLabel.join(',') : '') +
                ' at:' +
                item.left +
                ',' +
                item.top +
                ',' +
                item.width +
                ',' +
                item.height +
                ' font:宋体,12.0'
              : item.alias +
                ' at:' +
                item.left +
                ',' +
                item.top +
                ',' +
                item.width +
                ',' +
                item.height +
                ' font:宋体,' +
                pxToPt(item.fontSize, deviceDPI)
      })
      .join('@@@')
    script += '@@@' + 'SZ' + ' at:' + canvasPxW.value + ',' + canvasPxH.value + ' font:宋体,12'
    return script
  }
  return ''
})

const delCurTag = () => {
  // console.log(ruler.value)
  ElMessageBox.confirm('您确定要删除么?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      if (curTicket.value.id) {
        tickets.value = tickets.value.filter((item) => {
          return item.id !== curTicket.value.id
        })
        curTicket.value = {}
      }
    })
    .catch(() => {})
}
const startWatch = () => {
  // console.log('startWatch')
  stopWatchImg = watch(
    () => curTicket.value.bindLabel,
    async (newValue) => {
      if (newValue && curTicket.value.alias === 'IM') {
        loading.value = true
        let base64 = ''
        await picGetService(queueStore.branchId, newValue, 3)
          .then((res) => {
            base64 = 'data:image/jpg;base64,' + res.data.data
          })
          .catch(() => {
            base64 = ''
          })
        if (base64 !== '') {
          curTicket.value.bindVal = base64
        }
        loading.value = false
      } else if (newValue && curTicket.value.alias === 'SM') {
        if (newValue.length === 0) {
          ElMessage.error('多业务等候人数组件至少需要选择一个业务')
          tickets.value = tickets.value.filter((item) => item.id !== curTicket.value.id)
        }
      }
    }
    // { deep: true }
  )

  stopWatchFontSize = watch(
    () => curTicket.value.fontSize,
    async (newValue) => {
      if (newValue && curTicket.value.elType === 'text') {
        curTicket.value.height = curTicket.value.height < newValue ? newValue : curTicket.value.height
      }
    }
    // { deep: true }
  )
}
//销毁watch
onBeforeUnmount(() => {
  stopWatch()
})

const stopWatch = () => {
  // console.log('销毁watch')
  if (stopWatchImg) {
    stopWatchImg()
  }
  if (stopWatchFontSize) {
    stopWatchFontSize()
  }
}
</script>
<template>
  <el-drawer v-model="visibleDrawer" :before-close="handleClose" :show-close="false" direction="rtl" size="75%">
    <template #header>
      <div class="flex" style="padding: 5px">
        <span>优先级名称:</span>
        <el-input v-model.trim="ticketTitle" placeholder="请输入名称" style="margin-right: 10px; width: 240px"></el-input>
        <span style="margin-left: 50px">纸张尺寸(毫米) 宽度:</span>
        <el-input-number v-model="canvasMmW" :min="40" :max="1024" />

        <span>高度:</span>
        <el-input-number v-model="canvasMmH" :min="40" :max="1024" />
      </div>
    </template>
    <template #default>
      <el-container class="el-container" title="号票编辑" v-loading="loading">
        <el-aside class="el-aside-left">
          <div class="el-header">组件</div>
          <div class="tag-box">
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item v-for="item in tags" :key="item.groupId" :title="item.groupName" :name="item.groupId">
                <div class="tag-container">
                  <select-tag
                    style="width: 100%; height: 20px"
                    v-for="child in item.children"
                    :key="child.id"
                    :tagTitle="child.title"
                    :tagIcon="child.icon"
                    draggable="true"
                    direction="left-to-right"
                    @dragstart="dragstart($event, { groupId: item.groupId, ...child })"
                    @dragend="dragend"
                  >
                  </select-tag>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-aside>
        <el-main class="el-main-me">
          <div class="el-header">工作区</div>
          <div class="main-box">
            <div :style="{ width: canvasPxW + 20 + 'px', height: canvasPxH + 20 + 'px' }">
              <vue-ruler-tool
                :content-layout="{ left: 0, top: 0 }"
                :is-scale-revise="true"
                :is-hot-key="false"
                :is-hooks="false"
                :parent="true"
                :parent-w="canvasPxW"
                :parent-h="canvasPxH"
                ref="ruler"
              >
                <div
                  class="canvas"
                  @drop="drop"
                  @dragover.prevent
                  :style="{ width: canvasPxW + 'px', height: canvasPxH + 'px' }"
                  @click="onCanvasClick"
                >
                  <VueDrag
                    v-for="item in tickets"
                    :active="item.active"
                    :id="item.id"
                    :key="item.id"
                    :elType="item.elType"
                    :width="item.width"
                    :height="item.height"
                    :top="item.top"
                    :left="item.left"
                    :data="item.item"
                    :defaultText="item.defaultText"
                    :minH="item.minh"
                    :minW="item.minw"
                    :draggable="item.draggable"
                    :resizable="item.resizable"
                    :parentH="canvasPxH"
                    :parentW="canvasPxW"
                    :color="item.color"
                    :backgroundColor="item.backgroundColor"
                    :fontSize="item.fontSize"
                    :fontFamily="item.fontFamily"
                    :bindVal="item.bindVal"
                    @activated="onActivateEv(item.id)"
                    @resize="onResize"
                    @click.stop="onDragClick"
                  >
                  </VueDrag>
                </div>
              </vue-ruler-tool>
            </div>
          </div>
          <!-- <button @click="test">test</button> -->
        </el-main>
        <el-aside class="el-aside-right">
          <div class="el-header">参数</div>
          <div class="tag-box">
            <table class="table-arg">
              <tr>
                <td style="width: 70px">标签名称</td>
                <td>{{ curTicket.elName }}</td>
              </tr>
              <tr>
                <td>左边距</td>
                <td><el-input-number v-model="curTicket.left" :min="0" :max="1024" size="small" :disabled="!curTicket.id" /></td>
              </tr>
              <tr>
                <td>上边距</td>
                <td><el-input-number v-model="curTicket.top" :min="0" :max="1024" size="small" :disabled="!curTicket.id" /></td>
              </tr>
              <tr>
                <td>宽度</td>
                <td><el-input-number v-model="curTicket.width" :min="0" :max="1024" size="small" :disabled="!curTicket.id" /></td>
              </tr>
              <tr>
                <td>高度</td>
                <td><el-input-number v-model="curTicket.height" :min="0" :max="1024" size="small" :disabled="!curTicket.id" /></td>
              </tr>
              <tr>
                <td>字体大小</td>
                <td>
                  <el-input-number
                    v-model="curTicket.fontSize"
                    :min="0"
                    :max="512"
                    size="small"
                    :disabled="!curTicket.id || curTicket.functionCode === 'static-picture'"
                  />
                </td>
              </tr>
              <tr>
                <td>图片</td>
                <td>
                  <el-select v-model="curTicket.bindLabel" :disabled="curTicket.alias !== 'IM'" placeholder="请选择">
                    <el-option v-for="(item, key) in pics" :key="key" :label="item" :value="item"></el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>业务类别</td>
                <td>
                  <el-select
                    v-model="curTicket.bindLabel"
                    :disabled="curTicket.alias !== 'SM'"
                    placeholder="请选择"
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                  >
                    <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>文字内容</td>
                <td>
                  <el-input
                    v-model="curTicket.defaultText"
                    size="small"
                    placeholder="请输入文字"
                    type="textarea"
                    rows="3"
                    :disabled="!curTicket.id || curTicket.groupId !== '1'"
                  />
                </td>
              </tr>
            </table>

            <el-button type="danger" style="width: 100%" :disabled="!curTicket.id" @click="delCurTag">删除当前组件</el-button>
            <el-divider />
            <div class="flex">
              <el-input v-model="ticketScript" size="small" type="textarea" rows="12" :readonly="true" />
            </div>
          </div>
        </el-aside>
      </el-container>
    </template>
    <template #footer>
      <el-button type="primary" @click="confirmClick" :disabled="loading">
        <el-icon class="el-icon--left"><FolderAdd /></el-icon>
        保存
      </el-button>
      <el-button type="danger" @click="cancelClick" :disabled="loading">
        <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
        关闭
      </el-button>
    </template>
  </el-drawer>
</template>
<style lang="scss" scoped>
.el-container {
  height: 650px;
  border: 2px solid #eee;
  .el-aside-left {
    padding: 1px;
    border-right: 2px solid #eee;
    text-align: center;
    width: 180px;
    overflow: auto;
  }
  .el-aside-right {
    padding: 1px;
    border-left: 2px solid #eee;
    text-align: center;
    width: 240px;
    overflow: auto;
  }
  .el-main-me {
    padding: 1px;
    text-align: center;
    overflow: auto;
  }
  .tag-container {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: left;
    text-align: center;
    width: 100%;
  }
  .el-tag-me {
    // flex: 1 0 80px;
    min-height: 80px;
    min-width: 80px;
  }
  .div-drop-box {
    width: 100%;
    // height: 100%;
    // text-align: center;
    // line-height: 100%;
    // font-size: 20px;
    // color: #ccc;
  }
  .el-header {
    background-color: rgb(7, 7, 123);
    margin-top: 0;
    margin-bottom: 2px;
    color: white;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    height: 28px;
  }
  .tag-box {
    height: 615px;
    position: relative;
    overflow: auto;
    // padding-top: 5px;
  }
  .main-box {
    width: 100%;
    height: 615px;
    overflow: auto;
    // display: flex;
    // justify-content: space-between;
    // text-align: center;
    // border: 1px solid rgb(157, 31, 31);
  }
  .canvas {
    width: 100%;
    height: 600px;
    position: relative;
    background-image: linear-gradient(to right, rgb(233, 233, 233) 1px, transparent 1px, transparent 10px),
      linear-gradient(to bottom, rgb(233, 233, 233) 1px, transparent 1px, transparent 10px);
    background-size: 10px 10px;
  }
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
  margin-bottom: 1px;
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
.el-border {
  border: solid thin #eee;
}
</style>
