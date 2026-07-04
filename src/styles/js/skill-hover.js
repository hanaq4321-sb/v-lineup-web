import pinia from '@/store/store'
import { usePreloadInfoStore } from '@/store/preload-info'
import { storeToRefs } from 'pinia'
import { ElEmpty } from 'element-plus'

const preloadStore = usePreloadInfoStore(pinia)
const { skillDetail, agentDetail } = storeToRefs(preloadStore)

const throwHover = (e) => {
  const groupNode = e.currentTarget
  const line = groupNode.findOne('#line')
  const stroke = groupNode.findOne('#stroke')
  const background = groupNode.findOne('#background')
  // 防止遮盖其他结点的hover
  groupNode.zIndex(-1)
  line.stroke('orange')
  line.visible(true)
  stroke.stroke('orange')
  stroke.radius(skillDetail.value.r * 7)
  stroke.fill(`rgb(` + agentDetail.value.color + `,0.2)`)
  background.fill('orange')
  background.visible(true)
}
const throwUnHover = (e) => {
  const groupNode = e.currentTarget
  const line = groupNode.findOne('#line')
  const stroke = groupNode.findOne('#stroke')
  const background = groupNode.findOne('#background')
  groupNode.zIndex(0)
  line.stroke('rgb(27, 144, 255,0.9)')
  line.visible(false)
  stroke.stroke('rgb(27, 144, 255,0.9)')
  stroke.radius('17')
  stroke.fill('rgb(0, 0, 0, 0.7)')
  background.fill('rgb(27, 144, 255,0.9)')
  background.visible(false)
}

export { throwHover, throwUnHover }
