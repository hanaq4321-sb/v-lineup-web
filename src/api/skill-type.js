import request from '@/utils/request'

export const saveThrowSkill = (throwSkillJson) => {
  return request.post('/throwSkill', throwSkillJson)
}

export const getThrowSkill = (mapId, agentId, skillIndex) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex })
  return request.get('/throwSkill', { params: params })
}
