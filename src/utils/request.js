import axios from 'axios'
import { useTokenStore, useLoginDialogStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const baseURL = '/api'
const instance = axios.create({ baseURL })

// 为请求添加token授权
instance.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore()
    if (tokenStore.token) {
      config.headers.Authorization = tokenStore.token
    }
    return config
  },
  (err) => {
    console.log(err)
    return Promise.reject(err)
  },
)
// 处理响应结果
instance.interceptors.response.use(
  (result) => {
    return result.data
  },
  // 服务异常比如服务器宕机会返回err，请求发送后后端处理的逻辑错误会在result.data.err中返回
  (err) => {
    if (err.response.status == 401) {
      ElMessage.warning('请先登录')
      const loginDialogStore = useLoginDialogStore()
      // NOTE pina中用方法访问和修改都不需要.value，使用storeToRefs转化后需要
      loginDialogStore.loginDialogVisible = true
    } else {
      ElMessage.error('服务异常')
      console.log(err)
      return Promise.reject(err)
    }
  },
)

export default instance
