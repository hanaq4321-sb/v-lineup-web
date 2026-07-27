import request from '@/utils/request'
// throw
export const saveThrowSkill = (throwSkillJson) => {
  return request.post('/throwSkill', throwSkillJson)
}

export const getThrowSkillService = (mapId, agentId, skillIndex, side) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex, side: side })
  return request.get('/throwSkill', { params: params })
}

export const getThrowSkillCollectService = (mapId, agentId, skillIndex, side) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex, side: side })
  return request.get('/throwSkillCollect', { params: params })
}

export const getThrowSkillCountsService = (mapId, agentId, skillIndex) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex })
  return request.get('/throwSKillCounts', { params: params })
}
