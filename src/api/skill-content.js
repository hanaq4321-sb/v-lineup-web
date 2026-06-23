import request from '@/utils/request'

export const saveSkillContent = (contentForm) => {
  return request.post('/skillContent', contentForm)
}
