<script setup>
import VueDragResize from './vue-drag-resize/vue-drag-resize.vue'
import { ref, defineProps, computed } from 'vue'
const boxShaddow = ref('boxPlain')

const item = ref({
  text: 'hello world',
  link: '',
  key: '',
  image: { src: '', fit: 'fill' },
  options: []
})
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  parentW: {
    type: Number,
    required: true
  },
  parentH: {
    type: Number,
    required: true
  },
  minH: {
    type: Number,
    required: false
  },
  minW: {
    type: Number,
    required: false
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  left: {
    type: Number,
    required: true
  },
  top: {
    type: Number,
    required: true
  },
  draggable: {
    type: Boolean,
    required: false
  },
  resizable: {
    type: Boolean,
    required: false
  },
  checkable: {
    type: Boolean,
    required: false,
    default: false
  },
  elType: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: false
  },
  id: {
    type: String,
    required: true
  },
  fontSize: {
    type: Number,
    required: false
  },
  fontFamily: {
    type: String,
    required: false,
    default: '宋体'
  },
  color: {
    type: String,
    required: false
  },
  backgroundColor: {
    type: String,
    required: false
  },
  backgroundImage: {
    type: String,
    required: false
  },
  defaultText: {
    type: String,
    required: false,
    default: ''
  },
  bindVal: {
    type: String,
    required: false,
    default: ''
  },
  modelValue: {
    type: Boolean,
    required: false,
    default: false
  }
})
// const selected = ref(props.value)
const style = computed(() => {
  return {
    'font-size': props.fontSize + 'px',
    'font-family': props.fontFamily,
    color: props.color,
    'background-color': props.backgroundColor,
    'background-image': `url(${props.bindVal})`,
    //不重复平铺背景图像
    'background-repeat': 'no-repeat',
    //  居中显示背景图像
    // 'background-position': 'center',
    // 将背景图像调整到完全覆盖容器大小
    'background-size': '100% 100%'
  }
})

item.value = props.data
// console.log(item.value)
const resize = (newRect) => {
  emit('resize', newRect, props.id)
  //   console.log(newRect)
}
const changePosition = (newRect) => {
  emit('changePosition', newRect, props.id)
  //   console.log(newRect)}
}
const activated = (id) => {
  boxShaddow.value = 'boxShaddow'
  emit('activated', id)
}
const deactivated = () => {
  boxShaddow.value = 'boxPlain'
  // emit('deactivated', key.value)
}
const changed = (event) => {
  console.log(event.target.checked)
  emit('selected', event.target.checked, props.id)
}
// :contentClass="boxShaddow"
const emit = defineEmits(['activated', 'deactivated', 'resize', 'selected', 'changePosition'])
</script>

<template>
  <VueDragResize
    :key="id"
    :isActive="active"
    :w="width"
    :h="height"
    :x="left"
    :y="top"
    :parent="true"
    :minw="minW"
    :minh="minH"
    :parentW="parentW"
    :isDraggable="draggable"
    :isResizable="resizable"
    :parentH="parentH"
    :snapToGrid="false"
    :stickSize="8"
    :parentLimitation="true"
    @resizestop="resize"
    @dragstop="changePosition($event, index)"
    @activated="activated(id)"
    @deactivated="deactivated"
  >
    <div class="mainD" :style="style" :draggable="false">
      <input type="checkbox" v-if="checkable" class="checkbox" :checked="modelValue" @change="changed" />
      <div v-if="elType === 'text'">{{ defaultText }}</div>
      <el-image v-else-if="elType === 'image'" :draggable="false" style="width: 100%; height: 100%" :src="bindVal" fit="fill" alt="请选择图片" />
      <el-link v-else-if="elType === 'link'" :href="item.link" type="primary" disabled>{{ defaultText }} </el-link>
      <el-select v-else-if="elType === 'select'" placeholder="请选择">
        <el-option v-for="item in item.options" :key="item.value" :label="defaultText" :value="item.value" />
      </el-select>
      <slot v-else></slot>
    </div>
  </VueDragResize>
</template>
<style lang="scss" scoped>
.mainD {
  // background-color: gray;
  width: 100%;
  height: 100%;
  position: relative;
  cursor: move;
  color: black;
  .boxShaddow {
    box-shadow: 0 0 0 1px #ff4040;
  }
  .boxPlain {
    box-shadow: none;
  }
  div {
    word-wrap: break-word;
    text-align: left;
    // border: solid 1px #ff4040;
    width: '100%';
    background-color: rgba(255, 255, 255, 0);
    // display: inline-block;
  }
  .checkbox {
    position: absolute;
    top: 0;
    left: 0;
    width: 12px;
    height: 12px;
    cursor: pointer;
    opacity: 0.5;
    border-radius: 2px;
    border: thin solid gray;
    z-index: 9999;
  }
}
.el-link {
  margin-right: 8px;
}
.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}
</style>
