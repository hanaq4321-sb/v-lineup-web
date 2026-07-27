import { useTokenStore } from '@/store/user'
import { useLoginDialogStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const tokenStore = useTokenStore()
const loginDialogVisible = useLoginDialogStore()

export const loginDetection = () => {
  console.log(tokenStore.token)
  if (tokenStore.token == '') {
    ElMessage.warning('请先登录')
    loginDialogVisible.loginDialogVisible = true
    return false
  }
  return true
}
