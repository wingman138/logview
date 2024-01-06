import { dayjs } from 'element-plus'
export const formatTime = (time) => dayjs(time).format('YYYY年MM月DD日')
export const timeAdd = (time, day, hour, minute, second) =>
  dayjs(time)
    .add(day, 'day')
    .add(hour, 'hour')
    .add(minute, 'minute')
    .add(second, 'second')
    .format('YYYY-MM-DD HH:mm:ss')
