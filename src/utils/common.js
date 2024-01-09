const channelMap = {
  0: '营销系统',
  1: '电子档案',
  2: '排队系统',
  3: '评价系统',
  4: '桌面Pad',
  5: '道欣',
  10: '数据库缓存'
}
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
const operationMap = {
  0: '所有',
  1: '告知单',
  2: '账单',
  3: '通知单',
  6: '临时通知',
  8: '密码修改重置',
  127: '报价',
  7: '获取签名',
  10: '请评价',
  11: '排队号码',
  12: '排队登录',
  13: '排队注销'
}
export const convertChannel = (val) => {
  return channelMap[val] ? channelMap[val] : '---'
}
export const convertOperation = (val) => {
  return operationMap[val] ? operationMap[val] : '---'
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
