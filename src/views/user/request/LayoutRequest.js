import { userRegisterServie } from '@/api/user'
import { ElMessage } from 'element-plus'

export const register = async (username, password, email) => {
  let result = await userRegisterServie(username, password, email)
  if (result.code == 0) {
    ElMessage.success('注册成功')
  }
}
