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

// 技能图标

// 控制点的hover样式
let click = false
let hover = false
let controlHoverSingle = 0
function mousedown() {
  click = true
}
function mouseup(circle, e) {
  console.log(1)
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

// 控制旋转
export const ControlRotate = (event, stageRef, groupName) => {
  const e = event.evt.currentTarget
  e.addEventListener('mousemove', rectMoveStart)
  e.addEventListener('mouseup', rectMoveEnd)
  function rectMoveStart(e) {
    // 这个e是正常evernt，相当于上面的event.evt
    // NOTE 阻止冒泡，防止触发父组件的drag事件
    e.stopPropagation()
    const stage = stageRef.getNode()
    const mapGroup = stage.findOne('.mapGroup')
    const placeGroup = stage.findOne(groupName)
    const pointerPosition = mapGroup.getRelativePointerPosition()
    const centerPosition = placeGroup.position()
    const a = pointerPosition.x - centerPosition.x
    const c = Math.sqrt((pointerPosition.x - centerPosition.x) ** 2 + (pointerPosition.y - centerPosition.y) ** 2)
    let cos = a / c
    let angle = (Math.acos(cos) / Math.PI) * 180
    if (pointerPosition.y < centerPosition.y) {
      angle = -angle
    }
    placeGroup.rotation(angle)
  }
  function rectMoveEnd() {
    e.removeEventListener('mousemove', rectMoveStart)
    e.removeEventListener('mouseup', rectMoveEnd)
  }
}

// 拖拽线的两端
export const dragLineBothEnd = (stageRef, line_, end1, end2) => {
  const stage = stageRef.getNode()
  const line = stage.findOne(line_)
  const groupIcon = stage.findOne(end1)
  const agent = stage.findOne(end2)
  line.points([groupIcon.position().x, groupIcon.position().y, agent.position().x, agent.position().y])
}
