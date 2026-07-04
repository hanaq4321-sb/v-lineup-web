import request from '@/utils/request'

export const saveSkillContent = (contentForm) => {
  return request.post('/skillContent', contentForm)
}

export const getSkillContentService = (uuid) => {
  return request.get('/skillContent?uuid=' + uuid)
}

export const updateSkillContentVideoService = (uuid, videoFile) => {
  const formData = new FormData()
  formData.append('video', videoFile)
  return request.post('/skillContent/video?uuid=' + uuid, formData)
}
