import request from '@/utils/request'

export const getSkillDataService = () => {
  return request.get('/skillData')
}
