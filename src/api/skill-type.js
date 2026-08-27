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

// throwGround
export const saveThrowGroundSkill = (throwSkillJson) => {
  return request.post('/throwGroundSkill', throwSkillJson)
}
export const getThrowGroundSkillService = (mapId, agentId, skillIndex, side) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex, side: side })
  return request.get('/throwGroundSkill', { params: params })
}
export const getThrowGroundSkillCollectService = (mapId, agentId, skillIndex, side) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex, side: side })
  return request.get('/throwGroundSkillCollect', { params: params })
}
export const getThrowGroundSkillCountsService = (mapId, agentId, skillIndex) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex })
  return request.get('/throwGroundSKillCounts', { params: params })
}

// line
export const saveLineSkill = (lineSkillJson) => {
  return request.post('/lineSkill', lineSkillJson)
}
export const getLineSkillService = (mapId, agentId, skillIndex, side) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex, side: side })
  return request.get('/lineSkill', { params: params })
}
export const getLineSkillCollectService = (mapId, agentId, skillIndex, side) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex, side: side })
  return request.get('/lineSkillCollect', { params: params })
}
export const getLineSkillCountsService = (mapId, agentId, skillIndex) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex })
  return request.get('/lineSkillCounts', { params: params })
}

// control
export const saveControlSkill = (controlSkillJson) => {
  return request.post('/controlSkill', controlSkillJson)
}
export const getControlSkillService = (mapId, agentId, skillIndex, side) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex, side: side })
  return request.get('/controlSkill', { params: params })
}
export const getControlSkillCollectService = (mapId, agentId, skillIndex, side) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex, side: side })
  return request.get('/controlSkillCollect', { params: params })
}
export const getControlSkillCountsService = (mapId, agentId, skillIndex) => {
  const params = new URLSearchParams({ mapId: mapId, agentId: agentId, skillIndex: skillIndex })
  return request.get('/controlSkillCounts', { params: params })
}
