import request from '@/utils/request'

export const insertOrUpdateMapService = (pointJson, barrierJson, skillBallJson) => {
  return request.post('/mapEditor', { pointJson: pointJson, barrierJson: barrierJson, skillBallJson: skillBallJson })
}

export const getService = (mapId) => {
  return request.get('/mapEditor?mapId=' + mapId)
}

export const deleteNodeService = (name, editType) => {
  const params = new URLSearchParams({ uuid: name, editType: editType })
  return request.delete('/mapEditor', { params: params, editType: editType })
}
