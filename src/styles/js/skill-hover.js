import { usePreloadInfoStore } from '@/store/preload-info'
import { storeToRefs } from 'pinia'
const preloadStore = usePreloadInfoStore()
const { skillDetail, agentDetail } = storeToRefs(preloadStore)
// throw
const throwHover = (e) => {
  const groupNode = e.currentTarget
  const line = groupNode.findOne('#line')
  const stroke = groupNode.findOne('#stroke')
  const background = groupNode.findOne('#background')
  // 防止遮盖其他结点的hover
  groupNode.zIndex(-10)
  line.stroke('orange')
  line.visible(true)
  stroke.stroke('orange')
  stroke.radius(skillDetail.value.r * 7)
  stroke.fill(`rgba( ${agentDetail.value.color} ,0.2)`)
  background.fill('orange')
  background.visible(true)
}
const throwUnHover = (e) => {
  const groupNode = e.currentTarget
  const line = groupNode.findOne('#line')
  const stroke = groupNode.findOne('#stroke')
  const background = groupNode.findOne('#background')
  groupNode.zIndex(0)
  line.stroke('rgba(27, 144, 255,0.9)')
  line.visible(false)
  stroke.stroke('rgba(27, 144, 255,0.9)')
  stroke.radius('17')
  stroke.fill('rgb(0, 0, 0, 0.7)')
  background.fill('rgba(27, 144, 255,0.9)')
  background.visible(false)
}
// line
const lineHover = (e) => {
  const groupNode = e.currentTarget
  const rect = groupNode.findOne('#rect')
  const circle = groupNode.findOne('#iconCircle')
  groupNode.zIndex(-10)
  rect.strokeWidth(3)
  rect.stroke('orange')
  circle.stroke('orange')
}
const lineUnHover = (e) => {
  const groupNode = e.currentTarget
  const rect = groupNode.findOne('#rect')
  const circle = groupNode.findOne('#iconCircle')
  groupNode.zIndex(0)
  rect.strokeWidth(0)
  rect.stroke('orange')
  circle.stroke('#fff')
}
export { throwHover, throwUnHover, lineHover, lineUnHover }
