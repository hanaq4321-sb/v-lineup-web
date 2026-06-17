import request from '@/utils/request'
// NOTE URLSearchParams post直接跟在后面form-data形式，get用{params：xx}的params形式
export const userRegisterServie = (username, password, email) => {
  const params = new URLSearchParams({ username: username, password: password, email: email })
  return request.post('/user/register', params)
}

export const loginService = (username, password) => {
  const params = new URLSearchParams({ username: username, password: password })
  return request.get('/user/login', { params: params })
}

export const getUserInfoService = (username) => {
  return request.get('/user/info?username=' + username)
}

export const getUserCountByEmailService = (email) => {
  const params = new URLSearchParams({ email: email })
  return request.get('/user/count', { params: params })
}
