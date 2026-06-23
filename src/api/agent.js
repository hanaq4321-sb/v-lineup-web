import request from '@/utils/request'

export const getAgentInfo = () => {
  return request.get('/agent')
}
