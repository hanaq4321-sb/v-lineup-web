import { ref, onMounted, reactive, shallowReactive, onBeforeUnmount, computed, watch } from 'vue'
// 控制点config
import { useImage } from 'vue-konva'
export const controlConfig = {
  radius: 7,
  fill: 'rgba(255,255,255,0.8)',
  stroke: '#000',
  strokeWidth: 1,
} // 拖动control
const [yaoTouIcon] = useImage('image/icon/rotate.png')
export const rotateControlImg = ref({
  width: 26,
  height: 26,
  offset: { x: 13, y: 13 },
  scale: { x: 0.8, y: 0.8 },
  image: yaoTouIcon,
}) // 旋转control
export const rotateControlCircle = ref({
  radius: 13,
  fill: 'rgba(255,255,255,0.8)',
  stroke: '#000',
  strokeWidth: 1,
})

// 控制点的hover样式
let click = false
let hover = false
let controlHoverSingle = 0
function mousedown() {
  click = true
}
function mouseup(circle, e) {
  click = false
  if (hover) return // 鼠标松开后仍在点内，保持选中颜色
  circle.to({ duration: 0.1, fill: 'rgba(255,255,255,0.8)' })
  e.removeEventListener('mousedown', mousedown)
  e.removeEventListener('mouseup', mouseup)
  controlHoverSingle = 0
}
export const controlHover = (event) => {
  if (controlHoverSingle == 1) return // 确保每次只选中一个点
  controlHoverSingle = 1
  hover = true
  let circle = event.currentTarget
  if (circle.getType() == 'Group') {
    circle = circle.findOne('Circle')
  }
  circle.to({ duration: 0.1, fill: 'rgba(255, 143, 36,1)' })
  const e = event.evt.currentTarget
  e.addEventListener('mousedown', mousedown)
  e.addEventListener('mouseup', mouseup.bind(null, circle, e)) // 利用bind传参
}
export const controlLeave = (event) => {
  hover = false
  if (click) return
  let circle = event.currentTarget
  if (circle.getType() == 'Group') {
    circle = circle.findOne('Circle')
  }
  circle.to({ duration: 0.1, fill: 'rgba(255,255,255,0.8)' })
  const e = event.evt.currentTarget
  e.removeEventListener('mousedown', mousedown)
  e.removeEventListener('mouseup', mouseup)
  controlHoverSingle = 0
}
