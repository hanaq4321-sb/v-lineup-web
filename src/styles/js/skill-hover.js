import { usePreloadInfoStore } from '@/store/preload-info'
import { useSettingBarStore } from '@/store/user'
import { storeToRefs } from 'pinia'
const preloadStore = usePreloadInfoStore()
const { skillDetail, agentDetail } = storeToRefs(preloadStore)
const settingStore = useSettingBarStore()
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
// throwGround
const throwGroundHover = (e) => {
  const groupNode = e.currentTarget
  const line = groupNode.findOne('.throwGroundLine')
  const icon = groupNode.findOne('.throwGroundIcon')
  const agent = groupNode.findOne('.throwGroundAgent')
  groupNode.zIndex(-10)
  if (!settingStore.skillIconVisible) icon.strokeWidth(5)
  icon.stroke('orange')
  line.stroke('orange')
  agent.fill('orange')
}
const throwGroundUnHover = (e) => {
  const groupNode = e.currentTarget
  const line = groupNode.findOne('.throwGroundLine')
  const icon = groupNode.findOne('.throwGroundIcon')
  const agent = groupNode.findOne('.throwGroundAgent')
  groupNode.zIndex(0)
  if (!settingStore.skillIconVisible) icon.strokeWidth(0)
  icon.stroke('rgba(27, 144, 255,0.9)')
  line.stroke('rgba(27, 144, 255,0.9)')
  agent.fill('rgba(27, 144, 255,0.9)')
}
// TODO 地图禁止拖动时的放大缩小取消焦点，现在为失效状态
// line
const lineHover = (e) => {
  const groupNode = e.currentTarget
  const rect = groupNode.findOne('#rect')
  const circle = groupNode.findOne('#iconCircle')
  groupNode.zIndex(-10)
  rect.strokeWidth(3)
  rect.stroke('orange')
  circle.stroke('orange')
  circle.strokeWidth(2)
}
const lineUnHover = (e) => {
  const groupNode = e.currentTarget
  const rect = groupNode.findOne('#rect')
  const circle = groupNode.findOne('#iconCircle')
  groupNode.zIndex(0)
  rect.strokeWidth(0)
  rect.stroke('orange')
  circle.stroke('#fff')
  circle.strokeWidth(1)
}
// control
const controlHover = (e) => {
  const groupNode = e.currentTarget
  const line = groupNode.findOne('.skillControl')
  const circle = groupNode.findOne('.skillControlStroke')
  groupNode.zIndex(-10)
  line.stroke('orange')
  circle.stroke('orange')
  // circle.strokeWidth(2)
}
const controlUnHover = (e) => {
  const groupNode = e.currentTarget
  const line = groupNode.findOne('.skillControl')
  const circle = groupNode.findOne('.skillControlStroke')
  groupNode.zIndex(0)
  line.stroke('#6c7dff')
  circle.stroke('#23ffd0')
  // circle.strokeWidth(2)
}
export { throwHover, throwUnHover, lineHover, lineUnHover, throwGroundHover, throwGroundUnHover, controlHover, controlUnHover }
