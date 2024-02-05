<script setup>
import BranchSelector from './components/BranchSelector.vue'
import { ref, reactive, computed, watch, onBeforeUnmount, onMounted } from 'vue'
import { FullScreen, Plus, Delete, Edit } from '@element-plus/icons-vue'
import { printerGetService, pageGetService, picGetService } from '@/api/queue'
import SelectTag from '@/components/SelectTag.vue'
import VueDrag from '@/components/DragResize.vue'
import VueRulerTool from '@/components/ruler-tool/vue-ruler-tool-1.vue'
import { queueStore, guid } from '@/utils/common'
import { formatTimeDef } from '@/utils/format'
const printers = ref([])
const currentPrinter = ref(null)
const loading = ref(false)
const activeName = ref(['1', '2'])

const queButtons = ref([])
const categories = ref([])
const pageBgImages = ref([])
const btnBgImages = ref([])

const componentAvailable = ref([
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false
])
let offsetX = 0
let offsetY = 0

const ruler = ref(null)
//#region 数据获取
const getPrinters = async (value) => {
  // console.log(value)
  if (value) {
    loading.value = true
    await printerGetService(value)
      .then((res) => {
        // console.log(res)
        loading.value = false
        printers.value = res.data.data.printers

        if (printers.value.length > 0) {
          currentPrinter.value = res.data.data.printers[0]
          getPageOfPrinter(currentPrinter.value.id)
        } else {
          currentPrinter.value = null
        }
      })
      .catch(() => {
        loading.value = false
        printers.value = []
      })
  } else {
    printers.value = []
    currentPrinter.value = null
  }
}
const getPageOfPrinter = async (printer) => {
  loading.value = true
  await pageGetService(queueStore.branchId, printer)
    .then((res) => {
      // console.log(res)
      loading.value = false
      pages.value = []
      queButtons.value = res.data.data.buttons
      categories.value = res.data.data.categories
      pageBgImages.value = res.data.data.pageBgImages
      btnBgImages.value = res.data.data.btnBgImages
    })
    .catch(() => {
      loading.value = false
      pages.value = []
    })
}
const printerSelected = async (value) => {
  // console.log('printerSelected')
  if (value) {
    getPageOfPrinter(value)
  } else {
    printers.value = []
    currentPrinter.value = null
  }
}
//#endregion
//#region 组件
const tags = reactive([
  {
    id: 'queue-static-text',
    title: '静态文字',
    icon: 'Tickets',
    type: 'text',
    value: '欢迎光临',
    alias: 'TX',
    groupId: '1'
  },
  {
    id: 'queue-dynamic-text',
    title: '动态文字',
    icon: 'Reading',
    type: 'text',
    value: '从后台获取内容，不能修改',
    alias: 'DX',
    groupId: '1'
  },
  {
    id: 'queue-input-text',
    title: '参数文字',
    icon: 'DocumentAdd',
    type: 'text',
    value: '从后台获取内容或手动输入，可以修改',
    alias: 'IX',
    groupId: '1'
  },
  {
    id: 'queue-picture',
    title: '图片',
    icon: 'Picture',
    type: 'image',
    value: '',
    alias: 'IM',
    groupId: '1'
  },

  {
    id: 'queue-datetime',
    title: '日期时间',
    icon: 'Timer',
    type: 'text',
    value: '2000-01-01 12:00:00',
    alias: 'DT',
    groupId: '1'
  },
  {
    id: 'queue-ticket-button',
    title: '直接取号按键',
    icon: 'Guide',
    type: 'text',
    value: '点击直接取号',
    alias: 'QB',
    groupId: '2'
  },
  {
    id: 'queue-meun-ticket-button',
    title: '弹窗取号按键',
    icon: 'Connection',
    type: 'text',
    value: '点击直接弹窗输入客户数据',
    alias: 'MT',
    groupId: '2'
  },
  {
    id: 'queue-meun-button',
    title: '菜单按键',
    icon: 'Menu',
    type: 'text',
    value: '菜单按键',
    alias: 'MB',
    groupId: '2'
  },

  {
    id: 'queue-ok-button',
    title: '确认按键',
    icon: 'Finished',
    type: 'text',
    value: '确定',
    alias: 'OK',
    groupId: '3'
  },
  {
    id: 'queue-cancel-button',
    title: '取消按键',
    icon: 'Close',
    type: 'text',
    value: '取消',
    alias: 'CC',
    groupId: '3'
  }
])
const dragend = (event) => {
  event.dataTransfer.clearData()
}
const dragstart = (event, arg) => {
  offsetX = event.offsetX
  offsetY = event.offsetY
  event.dataTransfer.setData('arg', JSON.stringify(arg))
}
//#endregion
//#region 画布
const onSelected = (sel, id) => {
  curPage.value.components.forEach((item) => {
    if (item.id === id) {
      item.selected = sel
    }
  })
}
const onActivateEv = (id) => {
  curComponent.value = curPage.value.components.find((item) => item.id === id)
  curPage.value.components.forEach((item) => {
    if (item.id === id) {
      item.active = true
      computedAvailable(item.alias)
    } else {
      item.active = false
    }
  })
}
const onResize = (newRect, id) => {
  if (curComponent.value.id !== id) {
    const cp = curPage.value.components.find((item) => item.id === id)
    if (cp) {
      cp.left = newRect.left
      cp.top = newRect.top
      cp.width = newRect.width
      cp.height = newRect.height
    }
    return
  }
  curComponent.value.left = newRect.left
  curComponent.value.top = newRect.top
  curComponent.value.width = newRect.width
  curComponent.value.height = newRect.height
}
const onChangePosition = (newRect, id) => {
  if (curComponent.value.id !== id) {
    const cp = curPage.value.components.find((item) => item.id === id)
    if (cp) {
      cp.left = newRect.left
      cp.top = newRect.top
    }
    return
  }
  curComponent.value.left = newRect.left
  curComponent.value.top = newRect.top
}

//拖拽组件防止冒泡
const onDragClick = () => {}
const onCanvasClick = () => {
  componentAvailable.value = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  if (curPage.value && curPage.value.components) {
    curComponent.value = {}
    curPage.value.components.forEach((item) => (item.active = false))
    ruler.value.cleanLine()
  }
}

function getElContent(alias, value) {
  const rtn = alias === 'DT' ? { text: formatTimeDef(new Date(), 'YYYY-MM-DD HH:mm:ss') } : { text: value }

  return rtn
}
const drop = (event) => {
  // console.log(event.dataTransfer.getData('arg'))
  const arg = JSON.parse(event.dataTransfer.getData('arg'))
  let { type, title, value, id, groupId, alias } = arg
  let y = event.offsetY - offsetY < 0 ? 0 : event.offsetY - offsetY
  let x = event.offsetX - offsetX < 0 ? 0 : event.offsetX - offsetX

  const item = getElContent(alias, value)
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
    color: '#000000',
    backgroundColor: '#FFFFFF',
    fontSize: 12,
    active: true,
    elType: type,
    elName: title,
    functionCode: id,
    defaultText: item.text,
    bindLabel: '',
    bindVal: '',
    groupId: groupId,
    alias: alias,
    button: null,
    startTime: '08:30',
    endTime: '18:00',
    disabledDay: [],
    waitof: [],
    item: item,
    selected: false,
    jumpto: '',
    parName: '',
    parRuler: ''
  }
  curComponent.value = { ...data }
  curPage.value.components.push(data)
}
//#endregion
//#region 页面设计
const newPageName = ref('')

const curComponent = ref({})
const curPageId = ref('')
const refCanvas = ref()
const pages = ref([])
const defaultPage = () => {
  return {
    id: guid(),
    elName: '空页面',
    backgroundColor: '#ffffff',
    backgroundImage: '',
    bgImageUrl: '',
    width: 1024,
    height: 768,
    components: []
  }
}

const computedAvailable = (alias) => {
  switch (alias) {
    //静态文字
    case 'TX':
      componentAvailable.value = [true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false]
      break
    //图片
    case 'IM':
      componentAvailable.value = [true, true, true, true, false, false, false, true, false, false, false, false, false, false, false, false, false]
      break
    //时间日期
    case 'DT':
      componentAvailable.value = [true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false]
      break
    //直接取号按键
    case 'QB':
      componentAvailable.value = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false]
      break
    //菜单按键
    case 'MB':
      componentAvailable.value = [true, true, true, true, true, true, true, true, true, false, false, true, true, true, true, false, false]
      break
    //弹窗取号按键
    case 'MT':
      componentAvailable.value = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false]
      break
    //确定取消按键
    case 'OK':
    case 'CC':
      componentAvailable.value = [true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false]
      break
    //动态文字
    case 'DX':
      componentAvailable.value = [true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true]
      break
    //参数文字
    case 'IX':
      componentAvailable.value = [true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, true, true]
      break
    default:
      componentAvailable.value = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false]
      break
  }
}
const addPage = () => {
  if (!newPageName.value) {
    ElMessage.error('请输入页面名称')
    return
  }
  if (pages.value.find((page) => page.elName === newPageName.value)) {
    ElMessage.error('页面名称重复')
    return
  }
  const page = defaultPage()
  page.elName = newPageName.value

  pages.value.push(page)
  curPageId.value = page.id
  newPageName.value = ''
}
const editPageName = () => {
  let n = 0
  for (let i = 0; i < pages.value.length; i++) {
    if (pages.value[i].id === curPageId.value) {
      n = i
    }
    if (pages.value[i].elName === newPageName.value && pages.value[i].id !== curPageId.value) {
      ElMessage.error('页面名称重复')
      return
    }
  }
  pages.value[n].elName = newPageName.value
  newPageName.value = ''
}
const delPage = () => {
  if (pages.value.length <= 1) {
    ElMessage.error('至少保留一个页面')
    return
  }
  ElMessageBox.confirm('您确定要删除么?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let pid = curPageId.value
      pages.value = pages.value.filter((page) => page.id !== pid)
      if (pages.value && pages.value.length > 0) curPageId.value = pages.value[0].id
      else curPageId.value = ''
      pages.value.forEach((page) => {
        page.components.forEach((component) => {
          if (component.jumpto === pid) {
            component.jumpto = ''
          }
        })
      })
    })
    .catch(() => {})
}

const delCurTag = () => {
  console.log(ruler.value)
  ElMessageBox.confirm('您确定要删除么?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      if (curComponent.value.id) {
        curPage.value.components = curPage.value.components.filter((item) => {
          return item.id !== curComponent.value.id
        })
        curComponent.value = {}
      }
    })
    .catch(() => {})
}

const disabledDay = ref([
  { label: '星期一', value: 0 },
  { label: '星期二', value: 1 },
  { label: '星期三', value: 2 },
  { label: '星期四', value: 3 },
  { label: '星期五', value: 4 },
  { label: '星期六', value: 5 },
  { label: '星期日', value: 6 }
])

//#endregion
//#region 全局
var stopWatchPageImg = null
var stopWatchBtnImg = null
const startWatch = () => {
  stopWatchBtnImg = watch(
    () => curComponent.value.bindLabel,
    async (newValue) => {
      if (newValue) {
        loading.value = true
        let base64 = ''
        await picGetService(queueStore.branchId, newValue, 1)
          .then((res) => {
            base64 = 'data:image/jpg;base64,' + res.data.data
          })
          .catch(() => {
            base64 = ''
          })
        if (base64 !== '') {
          curComponent.value.bindVal = base64
        }
        loading.value = false
      }
    }
    // { deep: true }
  )

  stopWatchPageImg = watch(
    () => curPage.value.backgroundImage,
    async (newValue) => {
      if (newValue) {
        loading.value = true
        let base64 = ''
        await picGetService(queueStore.branchId, newValue, 0)
          .then((res) => {
            base64 = 'data:image/jpg;base64,' + res.data.data
          })
          .catch(() => {
            base64 = ''
          })
        if (base64 !== '') {
          curPage.value.bgImageUrl = base64
        }
        loading.value = false
      }
    }
    // { deep: true }
  )
}
onMounted(() => {
  // document.documentElement.addEventListener('keydown', keyboardDown, true)
  // document.documentElement.addEventListener('keyup', keyboardUp, true)
  startWatch()
})
//销毁watch
onBeforeUnmount(() => {
  // document.documentElement.removeEventListener('keydown', keyboardDown, true)
  // document.documentElement.removeEventListener('keyup', keyboardUp, true)
  stopWatch()
})
const stopWatch = () => {
  // console.log('销毁watch')
  if (stopWatchPageImg) {
    stopWatchPageImg()
  }
  if (stopWatchBtnImg) {
    stopWatchBtnImg()
  }
}

//#endregion
//#computed 计算属性
const curPage = computed(() => {
  const pg = pages.value.find((page) => page.id === curPageId.value)
  if (!pg) return {}
  return pg
})
const moreSelect = computed(() => {
  return curPage.value?.components?.filter((comp) => comp.selected)?.length > 1 && curComponent.value?.id
})
//#endregion
//#region 快捷操作
const alignLeft = () => {
  if (moreSelect.value && curComponent.value.id) {
    loading.value = true
    let curid = curComponent.value.id
    let v = curComponent.value.left
    curPage.value.components.forEach((comp) => {
      if (comp.selected) {
        setTimeout(() => {
          comp.left = v
        }, 100)
      }
    })
    setTimeout(() => {
      curComponent.value = curPage.value.components.find((item) => item.id === curid)
      curComponent.value.active = true
      loading.value = false
    }, 100)
  } else {
    ElMessage.warning('请先选择多个组件或参照组件')
  }
}
const alignTop = () => {
  if (moreSelect.value && curComponent.value.id) {
    loading.value = true
    let curid = curComponent.value.id
    let v = curComponent.value.top
    curPage.value.components.forEach((comp) => {
      if (comp.selected) {
        setTimeout(() => {
          comp.top = v
        }, 100)
      }
    })
    setTimeout(() => {
      curComponent.value = curPage.value.components.find((item) => item.id === curid)
      curComponent.value.active = true
      loading.value = false
    }, 100)
  } else {
    ElMessage.warning('请先选择多个组件或参照组件')
  }
}

const alignRight = () => {
  if (moreSelect.value && curComponent.value.id) {
    loading.value = true
    let curid = curComponent.value.id
    let v = curComponent.value.left + curComponent.value.width
    curPage.value.components.forEach((comp) => {
      if (comp.selected) {
        setTimeout(() => {
          comp.left = v - comp.width
        }, 100)
      }
    })
    setTimeout(() => {
      curComponent.value = curPage.value.components.find((item) => item.id === curid)
      curComponent.value.active = true
      loading.value = false
    }, 100)
  } else {
    ElMessage.warning('请先选择多个组件或参照组件')
  }
}
const alignBottom = () => {
  if (moreSelect.value && curComponent.value.id) {
    loading.value = true
    let curid = curComponent.value.id
    let v = curComponent.value.top + curComponent.value.height
    curPage.value.components.forEach((comp) => {
      if (comp.selected) {
        setTimeout(() => {
          comp.top = v - comp.height
        }, 100)
      }
    })
    setTimeout(() => {
      curComponent.value = curPage.value.components.find((item) => item.id === curid)
      curComponent.value.active = true
      loading.value = false
    }, 100)
  } else {
    ElMessage.warning('请先选择多个组件或参照组件')
  }
}
const sameFontSize = () => {
  if (moreSelect.value && curComponent.value.id) {
    curPage.value.components.forEach((comp) => {
      if (comp.selected) {
        comp.fontSize = curComponent.value.fontSize
      }
    })
  } else {
    ElMessage.warning('请先选择多个组件或参照组件')
  }
}
const sameFontCoor = () => {
  if (moreSelect.value && curComponent.value.id) {
    curPage.value.components.forEach((comp) => {
      if (comp.selected) {
        comp.color = curComponent.value.color
      }
    })
  } else {
    ElMessage.warning('请先选择多个组件或参照组件')
  }
}
const sameBgColor = () => {
  if (moreSelect.value && curComponent.value.id) {
    curPage.value.components.forEach((comp) => {
      if (comp.selected) {
        comp.backgroundColor = curComponent.value.backgroundColor
      }
    })
  } else {
    ElMessage.warning('请先选择多个组件或参照组件')
  }
}
const sameWidth = () => {
  if (moreSelect.value && curComponent.value.id) {
    loading.value = true
    let curid = curComponent.value.id
    let v = curComponent.value.width
    curPage.value.components.forEach((comp) => {
      if (comp.selected) {
        setTimeout(() => {
          comp.width = v
        }, 100)
      }
    })
    setTimeout(() => {
      curComponent.value = curPage.value.components.find((item) => item.id === curid)
      curComponent.value.active = true
      loading.value = false
    }, 100)
  } else {
    ElMessage.warning('请先选择多个组件或参照组件')
  }
}
const sameHeight = () => {
  if (moreSelect.value && curComponent.value.id) {
    loading.value = true
    let curid = curComponent.value.id
    let v = curComponent.value.height
    curPage.value.components.forEach((comp) => {
      if (comp.selected) {
        setTimeout(() => {
          comp.height = v
        }, 100)
      }
    })
    setTimeout(() => {
      curComponent.value = curPage.value.components.find((item) => item.id === curid)
      curComponent.value.active = true
      loading.value = false
    }, 100)
  } else {
    ElMessage.warning('请先选择多个组件或参照组件')
  }
}

const sameWorkTime = () => {
  if (moreSelect.value && curComponent.value.id) {
    curPage.value.components.forEach((comp) => {
      if (comp.selected) {
        comp.startTime = curComponent.value.startTime
        comp.endTime = curComponent.value.endTime
      }
    })
  } else {
    ElMessage.warning('请先选择多个组件或参照组件')
  }
}
const sameDisabledDay = () => {
  if (moreSelect.value && curComponent.value.id) {
    curPage.value.components.forEach((comp) => {
      if (comp.selected) {
        comp.disabledDay = curComponent.value.disabledDay
      }
    })
  } else {
    ElMessage.warning('请先选择多个组件或参照组件')
  }
}
const selectAll = (v) => {
  if (curPage.value?.components?.length > 0) {
    curPage.value.components.forEach((comp) => {
      comp.selected = v
    })
  }
}
//#endregion
</script>
<template>
  <PageContainer title="取号界面设置">
    <template #extra>
      <branch-selector @branchChange="getPrinters" width="700px">
        <template #extra>
          <span>取号机:</span>
          <el-select v-model="currentPrinter" @change="printerSelected" placeholder="请选择" :loading="loading">
            <el-option v-for="item in printers" :key="item.id" :label="item.no" :value="item.id"></el-option>
          </el-select>
          <el-button :icon="FullScreen" type="primary" style="margin-left: 10px">预览 </el-button>
        </template>
      </branch-selector>
    </template>
    <el-container class="el-container" title="取号界面设置" v-loading="loading">
      <el-aside class="el-aside-left">
        <div class="el-header">组件</div>
        <div class="tag-box">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item :key="1" title="页面" name="1">
              <div class="flex" style="margin-top: 4px">
                <el-select style="width: 100%" v-model="curPageId" :disabled="!pages || pages.length === 0" size="small" placeholder="请选择">
                  <el-option v-for="item in pages" :key="item.id" :label="item.elName" :value="item.id"></el-option>
                </el-select>
              </div>
              <div class="flex" style="margin-top: 4px">
                <span>宽</span>
                <el-input-number :disabled="!curPageId" v-model="curPage.width" controls-position="right" size="small" :min="40" :max="9999" />

                <span>高</span>
                <el-input-number :disabled="!curPageId" v-model="curPage.height" controls-position="right" size="small" :min="40" :max="9999" />
              </div>
              <div class="flex" style="margin-top: 2px">
                <span>背景颜色:</span>
                <el-color-picker size="small" :disabled="!curPageId" v-model="curPage.backgroundColor" />
                <span>
                  {{ curPage.backgroundColor }}
                </span>
              </div>
              <div class="flex" style="margin-top: 2px">
                <span>背景图片:</span>
                <el-select v-model="curPage.backgroundImage" size="small" :disabled="!curPageId" placeholder="请选择">
                  <el-option v-for="(item, key) in pageBgImages" :key="key" :label="item" :value="item"></el-option>
                </el-select>
              </div>
              <el-input
                v-model="newPageName"
                :disabled="!currentPrinter"
                size="small"
                style="margin-top: 4px; margin-bottom: 4px"
                placeholder="请输入页面名称"
                clearable
              />

              <div class="flex" style="justify-content: space-between">
                <el-button type="primary" :icon="Plus" size="small" @click="addPage" :disabled="!newPageName || currentPrinter == null"
                  >添加
                </el-button>
                <el-button type="primary" :icon="Edit" size="small" @click="editPageName" :disabled="!newPageName || !curPageId">更名 </el-button>
                <el-button type="danger" :icon="Delete" size="small" style="margin-left: 4px" @click="delPage" :disabled="!curPageId"
                  >删除
                </el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item :key="2" title="组件" name="2">
              <div class="el-left-collapse-box component-box">
                <select-tag
                  style="width: 100%; height: 20px"
                  v-for="child in tags"
                  :key="child.id"
                  :tagTitle="child.title"
                  :tagIcon="child.icon"
                  :draggable="curPageId ? true : false"
                  :direction="curPageId ? 'left-to-right' : 'left-to-right  disabled-tag'"
                  @dragstart="dragstart($event, { groupId: child.groupId, ...child })"
                  @dragend="dragend"
                >
                </select-tag>
              </div>
            </el-collapse-item>
            <el-collapse-item :key="3" title="快捷键" name="3">
              <div class="el-left-collapse-box">
                <div class="quick-box">
                  <div><el-button type="primary" size="small" :disabled="!moreSelect" @click="alignLeft">左对齐 </el-button></div>
                  <div><el-button type="primary" size="small" :disabled="!moreSelect" @click="alignTop">上对齐 </el-button></div>
                  <div><el-button type="primary" size="small" :disabled="!moreSelect" @click="alignRight">右对齐 </el-button></div>
                  <div><el-button type="primary" size="small" :disabled="!moreSelect" @click="alignBottom">下对齐 </el-button></div>
                </div>
                <div class="quick-box">
                  <div><el-button type="primary" size="small" :disabled="!moreSelect" @click="sameWidth">相同宽度 </el-button></div>
                  <div><el-button type="primary" size="small" :disabled="!moreSelect" @click="sameHeight">相同高度 </el-button></div>
                  <div><el-button type="primary" size="small" :disabled="!moreSelect" @click="sameFontSize">相同字体 </el-button></div>
                  <div><el-button type="primary" size="small" :disabled="!moreSelect" @click="sameFontCoor">相同颜色 </el-button></div>
                  <div><el-button type="primary" size="small" :disabled="!moreSelect" @click="sameBgColor">相同背景 </el-button></div>
                </div>
                <div class="quick-box">
                  <div><el-button type="primary" size="small" :disabled="!moreSelect" @click="sameWorkTime">统一工作时间 </el-button></div>
                  <div><el-button type="primary" size="small" :disabled="!moreSelect" @click="sameDisabledDay">统一无效日 </el-button></div>
                </div>
                <div class="quick-box">
                  <div><el-button type="primary" size="small" @click="selectAll(true)">全选 </el-button></div>
                  <div><el-button type="primary" size="small" @click="selectAll(false)">取消选择 </el-button></div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-aside>
      <el-main class="el-main">
        <div class="el-header">工作区</div>
        <div class="main-box">
          <el-empty v-if="!pages || pages.length === 0" description="没有页面，请先选择网点及取号机再创建页面"> </el-empty>

          <div v-else-if="pages.length > 0" :style="{ width: curPage.width + 20 + 'px', height: curPage.height + 20 + 'px' }">
            <vue-ruler-tool
              :content-layout="{ left: 0, top: 0 }"
              :is-scale-revise="false"
              :is-hot-key="false"
              :is-hooks="true"
              :parent="true"
              ref="ruler"
              :parent-w="curPage.width"
              :parent-h="curPage.height"
            >
              <div
                ref="refCanvas"
                class="canvas"
                @drop="drop"
                @dragover.prevent
                :style="{
                  width: curPage.width + 'px',
                  height: curPage.height + 'px',
                  backgroundColor: curPage.backgroundColor,
                  backgroundImage: `url(${curPage.bgImageUrl})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 100%'
                }"
                @click="onCanvasClick"
              >
                <VueDrag
                  v-for="item in curPage.components"
                  v-model="item.selected"
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
                  :parentH="768"
                  :parentW="1024"
                  :color="item.color"
                  :backgroundColor="item.backgroundColor"
                  :fontSize="item.fontSize"
                  :fontFamily="item.fontFamily"
                  :bindVal="item.bindVal"
                  :checkable="true"
                  @activated="onActivateEv"
                  @resize="onResize"
                  @changePosition="onChangePosition"
                  @click.stop="onDragClick()"
                  @selected="onSelected"
                >
                </VueDrag>
              </div>
            </vue-ruler-tool>
          </div>
        </div>
      </el-main>
      <el-aside class="el-aside-right">
        <div class="el-header">参数</div>
        <div class="tag-box">
          <table class="table-arg">
            <tr>
              <td style="min-width: 70px">标签名称</td>
              <td>{{ curComponent.elName }}</td>
            </tr>
            <tr>
              <td>左边距</td>
              <td><el-input-number v-model="curComponent.left" :min="0" :max="1024" size="small" :disabled="!componentAvailable[0]" /></td>
            </tr>
            <tr>
              <td>上边距</td>
              <td><el-input-number v-model="curComponent.top" :min="0" :max="1024" size="small" :disabled="!componentAvailable[1]" /></td>
            </tr>
            <tr>
              <td>宽度</td>
              <td><el-input-number v-model="curComponent.width" :min="0" :max="1024" size="small" :disabled="!componentAvailable[2]" /></td>
            </tr>
            <tr>
              <td>高度</td>
              <td><el-input-number v-model="curComponent.height" :min="0" :max="1024" size="small" :disabled="!componentAvailable[3]" /></td>
            </tr>
            <tr>
              <td>字体大小</td>
              <td>
                <el-input-number v-model="curComponent.fontSize" :min="0" :max="512" size="small" :disabled="!componentAvailable[4]" />
              </td>
            </tr>
            <tr>
              <td>文字颜色</td>
              <td>
                <div class="flex">
                  <el-color-picker size="small" :disabled="!componentAvailable[5]" v-model="curComponent.color" />
                  <span>
                    {{ curComponent.color }}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>背景颜色</td>
              <td>
                <div class="flex">
                  <el-color-picker size="small" show-alpha :disabled="!componentAvailable[6]" v-model="curComponent.backgroundColor" />
                  <span>
                    {{ curComponent.backgroundColor }}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>背景图片</td>
              <td>
                <el-select v-model="curComponent.bindLabel" size="small" :disabled="!componentAvailable[7]" placeholder="请选择">
                  <el-option v-for="(item, key) in btnBgImages" :key="key" :label="item" :value="item"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>文字内容</td>
              <td>
                <el-input
                  v-model="curComponent.defaultText"
                  size="small"
                  placeholder="请输入文字"
                  type="textarea"
                  rows="3"
                  :disabled="!componentAvailable[8]"
                />
              </td>
            </tr>
            <tr>
              <td>取号按键</td>
              <td>
                <el-select v-model="curComponent.button" :disabled="!componentAvailable[9]" size="small" placeholder="请选择">
                  <el-option v-for="item in queButtons" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </td>
            </tr>

            <tr>
              <td>等候人数</td>
              <td>
                <el-select
                  v-model="curComponent.waitof"
                  :disabled="!componentAvailable[10]"
                  size="small"
                  multiple
                  collapse-tags
                  collapse-tags-tooltipplaceholder="请选择"
                >
                  <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>工作时间</td>
              <td>
                <el-time-select
                  :disabled="!componentAvailable[11]"
                  size="small"
                  v-model="curComponent.startTime"
                  :max-time="curComponent.endTime"
                  placeholder="开始时间"
                  start="06:30"
                  step="00:15"
                  end="23:30"
                />
                <el-time-select
                  :disabled="!componentAvailable[12]"
                  size="small"
                  v-model="curComponent.endTime"
                  :min-time="curComponent.startTime"
                  placeholder="结束时间"
                  start="06:30"
                  step="00:15"
                  end="23:30"
                />
              </td>
            </tr>
            <tr>
              <td>无效日</td>
              <td>
                <el-select
                  v-model="curComponent.disabledDay"
                  :disabled="!componentAvailable[13]"
                  size="small"
                  multiple
                  collapse-tags
                  collapse-tags-tooltipplaceholder="请选择"
                >
                  <el-option v-for="item in disabledDay" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>跳转页面</td>
              <td>
                <el-select v-model="curComponent.jumpto" :disabled="!componentAvailable[14]" size="small" placeholder="请选择">
                  <el-option
                    v-for="item in pages.filter((p) => p.id !== curPage.id)"
                    :key="item.id"
                    :label="item.elName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>绑定参数</td>
              <td>
                <el-input v-model="curComponent.parName" size="small" placeholder="请输入文字" :disabled="!componentAvailable[15]" />
              </td>
            </tr>
            <tr>
              <td>参数规则</td>
              <td>
                <el-input
                  v-model="curComponent.parRuler"
                  size="small"
                  type="textarea"
                  rows="2"
                  placeholder="请输入文字"
                  :disabled="!componentAvailable[16]"
                />
              </td>
            </tr>
          </table>
          <el-divider />
          <el-button type="danger" style="width: 100%" :disabled="!curComponent.id" @click="delCurTag">删除当前组件</el-button>
        </div>
      </el-aside>
    </el-container>
  </PageContainer>
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
  margin-bottom: 1px;
  span {
    display: flex;
    justify-content: right;
    margin-right: 5px;
    white-space: nowrap;
    // width: 120px;
    color: #72767b;
    // font-size: small;
  }
}

.el-container {
  height: 680px;
  border: 2px solid #eee;
  .el-aside-left {
    padding: 1px;
    border-right: 2px solid #eee;
    text-align: center;
    width: 210px;
    overflow: auto;
  }
  .el-aside-right {
    padding: 1px;
    border-left: 2px solid #eee;
    text-align: center;
    width: 240px;
    overflow: auto;
  }
  .el-main {
    padding: 1px;
    text-align: center;
    overflow: auto;
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
    height: 635px;
    position: relative;
    overflow: auto;
    // padding-top: 5px;
  }
  .main-box {
    width: 100%;
    height: 635px;
    overflow: auto;

    // border: 1px solid rgb(157, 31, 31);
  }
  .el-left-collapse-box {
    width: 100%;
    margin-top: 4px;
    text-align: center;
    border-top: solid 1px #d9d7d7;
    padding: 5px 0px;
  }

  .component-box {
    // height: 240px;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: left;
    text-align: center;
  }
  .quick-box {
    // width: 90%;
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    padding: 10px, 2px;
    border-bottom: solid thin rgb(239, 234, 234);
    // border-radius: 8px;
    div {
      margin: 4px 2px;
    }
  }
  .canvas {
    width: 100%;
    height: 600px;
    position: relative;
    // background-image: linear-gradient(to right, rgb(233, 233, 233) 1px, transparent 1px, transparent 10px),
    //   linear-gradient(to bottom, rgb(233, 233, 233) 1px, transparent 1px, transparent 10px);
    // background-size: 10px 10px;
  }
}
</style>
