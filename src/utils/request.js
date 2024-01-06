import axios from 'axios'
// import { useUserStore } from '@/stores'
// import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://localhost:3200'
// const baseURL = 'http://localhost:8080'
const instance = axios.create({
  baseURL,
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    // const userStore = useUserStore()
    // if (userStore.token) {
    //   config.headers.Authorization = userStore.token
    // }
    return config
  },
  (err) => Promise.reject(err)
)
instance.interceptors.response.use(
  (res) => {
    // console.log(res)
    if (res.data.state === 0) {
      return Promise.resolve(res)
    }
    ElMessage({ message: res.data?.data || '服务异常', type: 'error' })
    return Promise.reject(res.data)
  },
  (err) => {
    ElMessage({
      message: err.response?.data.data || '服务异常',
      type: 'error'
    })
    if (err.response?.status === 401) {
      router.push('/')
    }
    return Promise.reject(err)
  }
)
export default instance
export { baseURL }
