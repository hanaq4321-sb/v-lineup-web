import request from '@/utils/request'

export const ifCollectService = (token, uuid) => {
  const params = new URLSearchParams({ token: token, uuid: uuid })
  return request.get('/collect_like/collect', { params: params })
}

export const addCollectService = (token, uuid) => {
  const params = new URLSearchParams({ token: token, uuid: uuid })
  return request.post('/collect_like/collect', params)
}

//NOTE Delete要和get一样用params跟数据
export const deleteCollectService = (token, uuid) => {
  const params = new URLSearchParams({ token: token, uuid: uuid })
  return request.delete('/collect_like/collect', { params: params })
}
