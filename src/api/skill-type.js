import request from '@/utils/request'

export const saveThrowSkill = (throwSkillJson) => {
  request.post('/throwSkill', throwSkillJson)
}

export const getThrowSkill = (mapId, agentId, skillIndex) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex })
  request.post('/throwSkill', { params: params })
}
