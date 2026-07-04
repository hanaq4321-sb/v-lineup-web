import request from '@/utils/request'

export const getMapListService = () => {
  return request.get('/map')
}
