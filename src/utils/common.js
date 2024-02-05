import { formatTimeDef } from '@/utils/format'
import { picGetService } from '@/api/queue'
import { useQueueStore } from '@/stores'
export const queueStore = useQueueStore()
export const defaultLogo =
  'data:image/bmp;base64,Qk0eBQAAAAAAAD4AAAAoAAAAoQAAADQAAAABAAEAAAAAAOAEAAASCwAAEgsAAAAAAAAAAAAAAAAAAP///wD//////////////////////////4AAAAD//////////////////////////4AAAAD//////////////////////////4AAAAD//////////////////////////4AAAAD//////////////////////////4AAAAD//////////////////////////4AAAAD//////////////////////////4AAAAD/////x////////////////////4AAAAD////AAf///////////////////4AAAAD///+AAH///////////////////4AAAAD///+AAH7//////////////////4AAAAD///gAAD///////////////////4AAAAD///wAfw+//////////////////4AAAAD///gP/4Of/////////////////4AAAAD///gf/8HP/////////////////4AAAAD///B///Dv/////////////////4AAAAD//+B///j3/////////////////4AAAAD//4D///5//////////////////4AAAAD//4D///87/////////////////4AAAAD//4H///+Z/////////////////4AAAAD9/8P////c/////////////////4AAAADh///////H/////////////////4AAAADh/w/////j/////////////////4AAAADh/wH////wv////////////////4AAAADj/gH////4v////////////////4AAAAD//gA////8n////////////////4AAAAD//hgf///+T////////////////4AAAAD//xwP////T////////////////4AAAAD//z8H////z////////////////4AAAAD//z/j////7////////////////4AAAAD//x/x////x////////////////4AAAAD//x/87///x////////////////4AAAAD/vx/+c///5////////////////4AAAAD/vx/+M///5////////////////4AAAAD/vx//Of//5////////////////4AAAAD/vx//nf///////////////////4AAAAD/3x//3P///////////////////4AAAAD//5///P///////////////////4AAAAD/79//8H///////////////////4AAAAD/5///8H///////////////////4AAAAD/4///8H///////////////////4AAAAD/8P//8P///////////////////4AAAAD/+P//8f///////////////////4AAAAD//H//+f///////////////////4AAAAD//g//8f///////////////////4AAAAD//wP/8f///////////////////4AAAAD//4D/4////////////////////4AAAAD//+AAB////////////////////4AAAAD///AAH////////////////////4AAAAD///4AP////////////////////4AAAAD///8Af////////////////////4AAAAD////B/////////////////////4AAAAA='
export const channelList = [
  {
    label: '所有',
    value: -1
  },
  {
    label: '营销系统',
    value: 0
  },
  {
    label: '电子档案',
    value: 1
  },
  {
    label: '排队系统',
    value: 2
  },
  {
    label: '评价系统',
    value: 3
  },
  {
    label: '桌面Pad',
    value: 4
  },
  {
    label: '道欣',
    value: 5
  },
  {
    label: '数据库缓存',
    value: 10
  }
]
export const operationList = [
  {
    label: '所有',
    value: 0
  },
  {
    label: '告知单',
    value: 1
  },
  {
    label: '账单',
    value: 2
  },
  {
    label: '通知单',
    value: 3
  },
  {
    label: '临时通知',
    value: 6
  },
  {
    label: '密码修改重置',
    value: 8
  },
  {
    label: '报价',
    value: 127
  },
  {
    label: '获取签名',
    value: 7
  },
  {
    label: '请评价',
    value: 10
  },
  {
    label: '排队号码',
    value: 11
  },
  {
    label: '排队登录',
    value: 12
  },
  {
    label: '排队注销',
    value: 13
  }
]

export const convertChannel = (val) => {
  let channel = channelList.find((item) => item.value === val)
  return channel ? channel.label : '---'
}
export const convertOperation = (val) => {
  // return operationMap[val] ? operationMap[val] : '---'
  let op = operationList.find((item) => item.value === val)
  return op ? op.label : '---'
}
export const convertDirection = (val) => {
  switch (val) {
    case 0:
      return '输入'
    case 1:
      return '输出'
    default:
      return '---'
  }
}

export const priorityBaseList = [
  {
    label: '从一个号票键中选择一个客户',
    value: 0
  },
  {
    label: '以层次选择最高值',
    value: 1
  },
  {
    label: '号票键大于X',
    value: 2
  },
  {
    label: '从一个类别中选择一个客户',
    value: 3
  },
  {
    label: '类别大于X',
    value: 4
  },
  {
    label: '号票键X大于号票键Y',
    value: 5
  }
]
export const convertPriorityBase = (val) => priorityBaseList.find((item) => item.value === val)

export const priorityCompareList = [
  {
    label: '等候客户',
    value: 0
  },
  {
    label: '实际等候时间',
    value: 1
  }
]
export const guid = () => {
  let g = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
  // console.log(g)
  return g
}
export const convertPriorityCompare = (val) => priorityCompareList.find((item) => item.value === val)
export const getDeviceDPI = () => {
  var dpi = 96 // 默认值 96dpi
  if (window.screen && window.screen.deviceXDPI && window.screen.logicalXDPI) {
    dpi = (window.screen.deviceXDPI / window.screen.logicalXDPI) * dpi
  } else if (window.devicePixelRatio) {
    dpi = dpi * window.devicePixelRatio
  }

  return dpi
}
export const pxToMm = (pixel, dpi) => {
  return (pixel / dpi) * 25.4 //根据dpi计算并返回对应的毫米值
}
export const mmToPx = (mm, dpi) => {
  return parseInt((mm * dpi) / 25.4) //根据dpi计算像素值
}
export const ptToPx = (pt, dpi) => {
  return parseInt((pt * dpi) / 72) //根据dpi计算像素值
}
export const pxToPt = (px, dpi) => {
  return parseFloat((px * 72) / dpi).toFixed(1) //根据dpi计算像素值
}
export const textSize = (fontSize, fontFamily, text) => {
  let span = document.createElement('span')
  let result = {}
  result.width = span.offsetWidth
  result.height = span.offsetHeight
  span.style.visibility = 'hidden'
  span.style.fontSize = fontSize + 'px'
  span.style.fontFamily = fontFamily
  span.style.display = 'inline-block'
  document.body.appendChild(span)
  if (typeof span.textContent != 'undefined') {
    span.textContent = text
  } else {
    span.innerText = text
  }
  result.width = parseInt(window.getComputedStyle(span).width) - result.width
  result.height = parseInt(window.getComputedStyle(span).height) - result.height
  return result
}
/**
 * 生成号票数据
 * @param {number}  x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} fontSize
 * @param {String} fontName
 * @param {String} typ
 * @param {String} title
 * @param {String} functionCode
 * @param {String} txt
 * @param {String} groupId
 * @param {String} alias
 * @returns
 */
export const genTicketData = (x, y, w, h, fontSize, fontName, typ, title, functionCode, txt, groupId, alias, bindVal, bindLabel) => {
  let data = {
    id: guid(),
    width: w,
    height: h,
    top: parseInt(y),
    left: parseInt(x),
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
    fontSize: parseInt(fontSize),
    fontFamily: fontName,
    active: false,
    elType: typ,
    elName: title,
    functionCode: functionCode,
    defaultText: txt,
    bindLabel: bindLabel,
    bindVal: bindVal,
    groupId: groupId,
    alias: alias,
    item: { text: txt }
  }
  return data
}

export const base64DataURLToImageData = (base64DataURL) => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      if (!context) {
        reject(new Error('context is null'))
        return
      }
      context.drawImage(img, 0, 0)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      resolve(imageData)
    }

    img.onerror = (error) => {
      reject(error)
    }

    img.src = base64DataURL
  })
}

export const parseTicket = async (content, pw) => {
  const dpi = getDeviceDPI()

  let tickets = []

  // console.log(content)

  for (let i = 0; i < content.length; i++) {
    const s = content[i]
    var typ = s['tag']
    var fs = ptToPx(s['fontSize'], dpi)
    var fn = [s['fontName'], fs]
    var loca = [s['x'], s['y'], s['w'], s['h']]
    let txt = s['text'].trim()
    let sz = {}
    let tk = {}

    if (typ === 'TX') {
      if (loca[2] === 0 || loca[3] === 0) {
        sz = textSize(fn[1], fn[0], txt)
      } else {
        sz = { width: loca[2], height: loca[3] }
      }
      tk = genTicketData(loca[0], loca[1], sz.width, sz.height, fn[1], fn[0], 'text', '静态文字', 'text-info', txt, '1', 'TX', '', '')
      tickets.push(tk)
    } else if (typ === 'TS') {
      if (loca[2] === 0 || loca[3] === 0) {
        sz = textSize(fn[1], fn[0], txt)
      } else {
        sz = { width: loca[2], height: loca[3] }
      }
      tk = genTicketData(loca[0], loca[1], sz.width, sz.height, fn[1], fn[0], 'text', '自定义脚本', 'text-script', txt, '1', 'TS', '', '')
      tickets.push(tk)
    } else if (typ === 'TB') {
      if (loca[2] === 0 || loca[3] === 0) {
        sz = textSize(fn[1], fn[0], txt)
      } else {
        sz = { width: loca[2], height: loca[3] }
      }
      tk = genTicketData(loca[0], loca[1], sz.width, sz.height, fn[1], fn[0], 'text', '条码', 'text-barcode', txt, '1', 'TB', '', '')
      tickets.push(tk)
    } else if (typ === 'TQ') {
      if (loca[2] === 0 || loca[3] === 0) {
        sz = textSize(fn[1], fn[0], txt)
      } else {
        sz = { width: loca[2], height: loca[3] }
      }
      tk = genTicketData(loca[0], loca[1], sz.width, sz.height, fn[1], fn[0], 'text', '二维码', 'text-qr', txt, '1', 'TQ', '', '')
      tickets.push(tk)
    } else if (typ === 'IM') {
      let base64 = ''
      await picGetService(queueStore.branchId, txt, 3)
        .then((res) => {
          base64 = 'data:image/jpg;base64,' + res.data.data
        })
        .catch(() => {
          base64 = ''
        })
      if (base64 !== '') {
        if (loca[2] === 0 || loca[3] === 0) {
          await base64DataURLToImageData(base64)
            .then((imageData) => {
              // console.log(imageData.width, pw, loca[0])
              if (imageData.width > pw - 2 * loca[0]) {
                // console.log('图片宽度大于容器宽度')
                sz.width = pw - 2 * loca[0]
                sz.height = (sz.width / imageData.width) * imageData.height
              } else {
                sz.width = imageData.width
                sz.height = imageData.height
              }
              tk = genTicketData(loca[0], loca[1], sz.width, sz.height, fn[1], fn[0], 'image', '图片', 'static-picture', txt, '2', 'IM', base64, txt)
              tickets.push(tk)
            })
            .catch(() => {
              sz = { width: 0, height: 0 }
            })
        } else {
          tk = genTicketData(loca[0], loca[1], loca[2], loca[3], fn[1], fn[0], 'image', '图片', 'static-picture', txt, '2', 'IM', base64, txt)
          tickets.push(tk)
        }
      }
    } else if (typ === 'DA') {
      txt = formatTimeDef(new Date(), 'YYYY-MM-DD')
      if (loca[2] === 0 || loca[3] === 0) {
        sz = textSize(fn[1], fn[0], txt)
      } else {
        sz = { width: loca[2], height: loca[3] }
      }
      tk = genTicketData(loca[0], loca[1], sz.width, sz.height, fn[1], fn[0], 'text', '日期', 'static-date', txt, '2', 'DA', '', '')
      tickets.push(tk)
    } else if (typ === 'DT') {
      txt = formatTimeDef(new Date(), 'YYYY-MM-DD HH:mm:ss')
      if (loca[2] === 0 || loca[3] === 0) {
        sz = textSize(fn[1], fn[0], txt)
      } else {
        sz = { width: loca[2], height: loca[3] }
      }
      tk = genTicketData(loca[0], loca[1], sz.width, sz.height, fn[1], fn[0], 'text', '日期时间', 'static-datetime', txt, '2', 'DT', '', '')
      tickets.push(tk)
    } else if (typ === 'TM') {
      txt = formatTimeDef(new Date(), 'HH:mm:ss')
      if (loca[2] === 0 || loca[3] === 0) {
        sz = textSize(fn[1], fn[0], txt)
      } else {
        sz = { width: loca[2], height: loca[3] }
      }
      tk = genTicketData(loca[0], loca[1], sz.width, sz.height, fn[1], fn[0], 'text', '时间', 'static-time', txt, '2', 'TM', '', '')
      tickets.push(tk)
    } else if (typ === 'GQ') {
      //当前类别号码
      txt = '1234'
      if (loca[2] === 0 || loca[3] === 0) {
        sz = textSize(fn[1], fn[0], txt)
      } else {
        sz = { width: loca[2], height: loca[3] }
      }
      tk = genTicketData(loca[0], loca[1], sz.width, sz.height, fn[1], fn[0], 'text', '当前类别号码', 'function-cate-queueNo', txt, '2', 'GQ', '', '')
      tickets.push(tk)
    } else if (typ === 'GN') {
      //当前类别名称
      txt = '综合业务办理'
      if (loca[2] === 0 || loca[3] === 0) {
        sz = textSize(fn[1], fn[0], txt)
      } else {
        sz = { width: loca[2], height: loca[3] }
      }
      tk = genTicketData(loca[0], loca[1], sz.width, sz.height, fn[1], fn[0], 'text', '当前类别名称', 'function-category', txt, '2', 'GN', '', '')
      tickets.push(tk)
    } else if (typ === 'BN') {
      //当前按键名称
      txt = '综合业务办理(VIP)'
      if (loca[2] === 0 || loca[3] === 0) {
        sz = textSize(fn[1], fn[0], txt)
      } else {
        sz = { width: loca[2], height: loca[3] }
      }
      tk = genTicketData(loca[0], loca[1], sz.width, sz.height, fn[1], fn[0], 'text', '当前按键名称', 'function-button', txt, '2', 'BN', '', '')
      tickets.push(tk)
    } else if (typ === 'GU') {
      //当前类别等候人数
      txt = '0100'
      if (loca[2] === 0 || loca[3] === 0) {
        sz = textSize(fn[1], fn[0], txt)
      } else {
        sz = { width: loca[2], height: loca[3] }
      }
      tk = genTicketData(loca[0], loca[1], sz.width, sz.height, fn[1], fn[0], 'text', '当前业务等候人数', 'function-queue', txt, '2', 'GU', '', '')
      tickets.push(tk)
    } else if (typ === 'SM') {
      //求和

      if (loca[2] === 0 || loca[3] === 0) {
        sz = textSize(fn[1], fn[0], txt)
      } else {
        sz = { width: loca[2], height: loca[3] }
      }

      tk = genTicketData(
        loca[0],
        loca[1],
        sz.width,
        sz.height,
        fn[1],
        fn[0],
        'text',
        '多业务等候人数',
        'function-more-queue',
        '0200',
        '2',
        'SM',
        '',
        txt && txt.length > 0 ? txt.split(',').map((str) => Number(str)) : [1]
      )
      tickets.push(tk)
    }
  }

  return tickets
}
