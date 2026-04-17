<script setup>
import { ref, onMounted, reactive, shallowReactive, onBeforeUnmount, computed, watch } from 'vue'
import { useImage } from 'vue-konva'
import {
  Star,
  StarFilled,
  Check,
  Compass,
  RefreshRight,
  Plus,
  Minus,
  DArrowLeft,
  DArrowRight,
  Tools,
  CloseBold,
  UploadFilled,
  ZoomIn,
  Delete,
  Edit,
  User,
  Hide,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Konva from 'konva'
import { ltp } from '../../utils/lineToPath'

//#region 地图和特工信息
const mapValue = ref('breeze')
const maps = [
  {
    label: '幽邃地窟',
    value: 'abyss',
  },
  {
    label: '亚海悬城',
    value: 'ascent',
  },
  {
    label: '源工重镇',
    value: 'bind',
  },
  {
    label: '微风岛屿',
    value: 'breeze',
  },
  {
    label: '盐海矿镇',
    value: 'corrode',
  },
  {
    label: '裂变峡谷',
    value: 'fracture',
  },
  {
    label: '隐世修所',
    value: 'haven',
  },
  {
    label: '森寒冬港',
    value: 'icebox',
  },
  {
    label: '莲花古城',
    value: 'lotus',
  },
  {
    label: '深海明珠',
    value: 'pearl',
  },
  {
    label: '霓虹町',
    value: 'split',
  },
  {
    label: '日落之城',
    value: 'sunset',
  },
]
const agentValue = ref('clove')
const agentLabel = ref('暮蝶')
const agents = [
  {
    label: '亚星卓',
    value: 'astra',
  },
  {
    label: '铁壁',
    value: 'breach',
  },
  {
    label: '壹决',
    value: 'brimstone',
  },
  {
    label: '尚博勒',
    value: 'chamber',
  },
  {
    label: '暮蝶',
    value: 'clove',
  },
  {
    label: '零',
    value: 'cypher',
  },
  {
    label: '钢索',
    value: 'deadlock',
  },
  {
    label: '黑梦',
    value: 'fade',
  },
  {
    label: '盖可',
    value: 'gekko',
  },
  {
    label: '海神',
    value: 'harbor',
  },
  {
    label: '壹决',
    value: 'iso',
  },
  {
    label: '捷风',
    value: 'jett',
  },
  {
    label: 'K/O',
    value: 'kayo',
  },
  {
    label: '迷核',
    value: 'miks',
  },
  {
    label: '奇乐',
    value: 'killjoy',
  },
  {
    label: '霓虹',
    value: 'neon',
  },
  {
    label: '幽影',
    value: 'omen',
  },
  {
    label: '不死鸟',
    value: 'phoenix',
  },
  {
    label: '雷兹',
    value: 'raze',
  },
  {
    label: '芮娜',
    value: 'reyna',
  },
  {
    label: '贤者',
    value: 'sage',
  },
  {
    label: '斯凯',
    value: 'skye',
  },
  {
    label: '猎枭',
    value: 'sova',
  },
  {
    label: '钛狐',
    value: 'tejo',
  },
  {
    label: '禁灭',
    value: 'veto',
  },
  {
    label: '蝰蛇',
    value: 'viper',
  },
  {
    label: '维斯',
    value: 'vyse',
  },
  {
    label: '幻棱',
    value: 'waylay',
  },
  {
    label: '夜露',
    value: 'yoru',
  },
]
const skillSelectIconList = ref([
  `/src/assets/agent/${agentValue.value}/${agentValue.value}_1.webp`,
  `/src/assets/agent/${agentValue.value}/${agentValue.value}_2.webp`,
  `/src/assets/agent/${agentValue.value}/${agentValue.value}_3.webp`,
  `/src/assets/agent/${agentValue.value}/${agentValue.value}_4.webp`,
])
const skillSelectAgent = ref(`/src/assets/agent/${agentValue.value}/${agentValue.value}.webp`)
const skillInfo = [
  {
    agent: 'sova',
    index: 1,
    type: 'control',
  },
  {
    agent: 'sova',
    index: 2,
    type: 'throw',
  },
  {
    agent: 'sova',
    index: 3,
    type: 'throw',
  },
  {
    agent: 'sova',
    index: 4,
    type: 'line',
  },
  {
    agent: 'harbor',
    index: 1,
    type: 'throw',
  },
  {
    agent: 'harbor',
    index: 2,
    type: 'curve',
  },
  {
    agent: 'harbor',
    index: 3,
    type: 'throw',
  },
  {
    agent: 'harbor',
    index: 4,
    type: 'line',
  },
  {
    agent: 'viper',
    index: 1,
    type: 'throw',
  },
  {
    agent: 'viper',
    index: 2,
    type: 'throw',
  },
  {
    agent: 'viper',
    index: 3,
    type: 'line',
  },
  {
    agent: 'viper',
    index: 4,
    type: 'polygon',
  },
  {
    agent: 'fade',
    index: 1,
    type: 'control',
  },
  {
    agent: 'fade',
    index: 2,
    type: 'throw',
  },
  {
    agent: 'fade',
    index: 3,
    type: 'throw',
  },
  {
    agent: 'fade',
    index: 4,
    type: 'line',
  },
  {
    agent: 'clove',
    index: 1,
    type: 'others',
  },
  {
    agent: 'clove',
    index: 2,
    type: 'throw',
  },
  {
    agent: 'clove',
    index: 3,
    type: 'circle',
  },
  {
    agent: 'clove',
    index: 4,
    type: 'others',
  },
  {
    agent: 'astra',
    index: 1,
    type: 'circle',
  },
  {
    agent: 'astra',
    index: 2,
    type: 'circle',
  },
  {
    agent: 'astra',
    index: 3,
    type: 'circle',
  },
  {
    agent: 'astra',
    index: 4,
    type: 'line',
  },
]
const skillType = ref('circle')
//#endregion

//#region 画布

//#region 画布属性
const getImageUrl = (url) => {
  return new URL(url, import.meta.url).href
}
const containerRef = ref()
const mapContainerRef = ref()
const stageRef = ref()
const stageConfig = ref({
  x: 0,
  y: 0,
})
const groupConfig = ref({
  x: 0,
  y: 0,
  // 固定画布大小，调整scale适应屏幕。若不固定大小，根据mounted获取会造成在不同桌面缩放比例下，创建的组件大小不同。
  width: 1000,
  height: 1000,
  offsetX: 500,
  offsetY: 500,
  draggable: false,
  scaleX: 1,
  scaleY: 1,
  name: 'mapGroup',
  stroke: 'red',
  strokeWidth: 2,
})
let [map] = useImage(getImageUrl(`../../assets/map/detail/${mapValue.value}.png`))
const mapImageConfig = ref({
  x: 0,
  y: 0,
  width: 1000,
  height: 1000,
  image: map,
  name: 'mapImage',
})
//#endregion

//#region 窗口尺寸监听
const observer = new ResizeObserver(() => {
  // 画布尺寸随窗口变化
  const stage = stageRef.value.getNode()
  stage.width(mapContainerRef.value.clientWidth)
  stage.height(mapContainerRef.value.clientHeight)
  // 中间地图group随窗口缩放,尺寸不变化。
  // NOTE scale可以使内部所有组件一起缩放，并且相对位置不变
  const group = stage.findOne('.mapGroup')
  let scaleY = mapContainerRef.value.clientHeight / group.height()
  group.scale({ x: scaleY, y: scaleY })
  group.position({ x: mapContainerRef.value.clientWidth / 2, y: mapContainerRef.value.clientHeight / 2 })
  stage.batchDraw()
})
onMounted(() => {
  observer.observe(containerRef.value)
  const stage = stageRef.value.getNode()
  const group = stage.findOne('.mapGroup')
  const circle = stage.findOne('.skillCircleStroke')
  // circle.fill('red')
})
onBeforeUnmount(() => {
  // NOTE 在组件销毁时应该销毁监听器，否则页面重新加载时会导致上一个监听器获取不到还未加载完的界面
  observer.disconnect()
})
//#endregion

//#endregion

//#region 技能绘制

//#region 更改图片
const [skillImg] = useImage(getImageUrl(`../../assets/agent/${agentValue.value}/${agentValue.value}_3.webp`))
const [agentImg] = useImage(getImageUrl(`../../assets/agent/${agentValue.value}/${agentValue.value}.webp`))
const changeImg = (index) => {
  const type = skillType.value
  let [skillImg] = useImage(getImageUrl(`../../assets/agent/${agentValue.value}/${agentValue.value}_${index}.webp`))
  let [agentImg] = useImage(getImageUrl(`../../assets/agent/${agentValue.value}/${agentValue.value}.webp`))
  if (type == 'throw') {
    throwSkillIconConfig.value.image = skillImg
    throwAgentIconConfig.value.image = agentImg
  }
  if (type == 'control') {
    controlImgConfig.value.image = skillImg
  }
  if (type == 'circle') {
    console.log(skillImg)
    circleStrokeConfig.value.fillPatternImage = skillImg
  }
}
//#endregion

//#region 抛掷技能
const groupThrowIconConfig = ref({
  x: 500,
  y: 300,
  draggable: true,
  name: 'groupThrowIcon',
})
const throwSkillRangeConfig = ref({
  // 接入数据库数据
  radius: 30 * 7,
  fill: 'rgba(0,255,255,0.1)',
  stroke: '#00FFFF',
  strokeWidth: 5,
  name: 'skillThrowRange',
})
const throwSkillIconConfig = ref({
  offsetX: 15,
  offsetY: 15,
  width: 30,
  height: 30,
  cornerRadius: 15,
  image: skillImg,
})
const throwSkillCenterConfig = ref({
  radius: 6,
  fill: '#fff',
})
const throwAgentIconConfig = ref({
  x: 500,
  y: 700,
  width: 40,
  height: 40,
  offsetX: 20,
  offsetY: 20,
  cornerRadius: 5,
  fill: '#00FFFF',
  image: agentImg,
  draggable: true,
  name: 'skillThrowAgentIcon',
})
const throwLineConfig = ref({
  stroke: '#00FFFF',
  strokeWidth: 5,
  lineCap: 'round',
  name: 'skillThrowLine',
  points: [500, 300, 500, 700],
})
const dragIcon = () => {
  const stage = stageRef.value.getNode()
  const line = stage.findOne('.skillThrowLine')
  const agent = stage.findOne('.skillThrowAgentIcon')
  const groupIcon = stage.findOne('.groupThrowIcon')
  line.points([groupIcon.position().x, groupIcon.position().y, agent.position().x, agent.position().y])
}
//#endregion

//#region 曲线技能
const curveControlList = ref([])
const pointList = []
const curveConfig = ref({
  stroke: '#6c7dff',
  strokeWidth: 4,
  lineCap: 'round',
  tension: 0.5,
  name: 'skillCurve',
})
const curveClick = (e) => {
  // NOTE konva访问常规事件属性要加evt
  if (skillType.value != 'curve' || e.evt.button == 2) return
  const stage = stageRef.value.getNode()
  const group = stage.findOne('.mapGroup')
  const curve = stage.findOne('.skillCurve')
  pointList.push(group.getRelativePointerPosition().x, group.getRelativePointerPosition().y)
  // NOTE line.points会被传入的points数组的更新，从而触发自动更新。即只需绑定一次，后面只操作points数组即可
  curve.points(pointList)
  curveControlList.value.push({
    x: group.getRelativePointerPosition().x,
    y: group.getRelativePointerPosition().y,
    fill: '#fff',
    stroke: '#000',
    strokeWidth: 2,
    radius: 6,
    name: crypto.randomUUID(),
    draggable: true,
  })
}
const curveControlDrag = (name) => {
  const index = curveControlList.value.findIndex((e) => e.name == name)
  const stage = stageRef.value.getNode()
  const circle = stage.findOne(`.${name}`)
  pointList.splice(index * 2, 2, circle.position().x, circle.position().y)
  // FIXME 加了tension后的曲线，无法主动更新，需手动更新。polygon没加，所以不需要
  if (skillType.value == 'curve') {
    const curve = stage.findOne('.skillCurve')
    curve.points(pointList)
  }
  if (skillType.value == 'control') {
    const curve = stage.findOne('.skillControlLine')
    curve.points(pointList)
  }
}
// 右键菜单
const editMenuVisible = ref(false)
const deleteVisible = ref(false)
const insertVisible = ref(false)
const menuPosition = ref({ x: 0, y: 0 })
let tempIndex = 0
const curveMenu = (e) => {
  editMenuVisible.value = true
  deleteVisible.value = false
  insertVisible.value = true
  menuPosition.value = { x: e.evt.clientX + 4, y: e.evt.clientY + 4 }
}
const insertControl = () => {
  editMenuVisible.value = false
  const stage = stageRef.value.getNode()
  const group = stage.findOne('.mapGroup')
  const x = group.getRelativePointerPosition().x,
    y = group.getRelativePointerPosition().y
  let i = 0
  for (i = 0; i < pointList.length; i = i + 2) {
    if (
      ((x > pointList[i] && x < pointList[i + 2]) || (x < pointList[i] && x > pointList[i + 2])) &&
      ((y > pointList[i + 1] && y < pointList[i + 3]) || (y < pointList[i + 1] && y > pointList[i + 3]))
    ) {
      break
    }
  }
  pointList.splice(i + 2, 0, x, y)
  curveControlList.value.splice(i / 2 + 1, 0, {
    x: x,
    y: y,
    fill: '#ff4655',
    radius: 6,
    name: Date.now().toString(),
    draggable: true,
  })
}
const curveControlMenu = (name, e) => {
  editMenuVisible.value = true
  deleteVisible.value = true
  insertVisible.value = false
  menuPosition.value = { x: e.evt.clientX + 4, y: e.evt.clientY + 4 }
  tempIndex = curveControlList.value.findIndex((e) => e.name == name)
}
const deleteControl = () => {
  editMenuVisible.value = false
  curveControlList.value.splice(tempIndex, 1)
  pointList.splice(tempIndex * 2, 2)
}
//#endregion

//#region 多边形技能
const polygonConfig = ref({
  stroke: '#6c7dff',
  strokeWidth: 5,
  lineJoin: 'bevel',
  fill: 'rgba(0, 0, 0, 0.3)',
  closed: true,
  // draggable: true,
  name: 'skillPolygon',
})
const polygonClick = (e) => {
  //复用曲线技能的controlList和pointList
  if (skillType.value != 'polygon' || e.evt.button == 2) return
  const stage = stageRef.value.getNode()
  const group = stage.findOne('.mapGroup')
  const polygon = stage.findOne('.skillPolygon')
  pointList.push(group.getRelativePointerPosition().x, group.getRelativePointerPosition().y)
  polygon.points(pointList)
  curveControlList.value.push({
    x: group.getRelativePointerPosition().x,
    y: group.getRelativePointerPosition().y,
    fill: '#fff',
    stroke: '#000',
    strokeWidth: 2,
    radius: 6,
    name: crypto.randomUUID(),
    draggable: true,
  })
}
const polygonMove = () => {
  const stage = stageRef.value.getNode()
  const group = stage.findOne('.mapGroup')
  const polygon = stage.findOne('.skillPolygon')
  console.log(polygon.position())
}
//#endregion

//#region 直线技能
const lineWidth = 140,
  lineLength = 280
const lineConfig = ref({
  x: 100,
  y: 200,
  points: [0, 0, lineLength, 0],
  stroke: 'rgba(255,0,0,0.7)',
  strokeWidth: lineWidth,
  draggable: true,
  name: 'skillLine',
})
const lineStartControl = ref({
  x: 100,
  y: 200,
  fill: '#fff',
  stroke: '#000',
  strokeWidth: 2,
  width: 10,
  height: 10,
  offsetX: 5,
  offsetY: 5,
  rotation: 45,
  name: 'lineStartControl',
})
const lineEndControl = ref({
  x: 100 + lineLength,
  y: 200,
  fill: '#fff',
  stroke: '#000',
  strokeWidth: 2,
  radius: 6,
  name: 'lineEndControl',
})
let cos = 1,
  sin = 0
const lineMove = (e) => {
  const stage = stageRef.value.getNode()
  const line = stage.findOne('.skillLine')
  const startControl = stage.findOne('.lineStartControl')
  const endControl = stage.findOne('.lineEndControl')
  // line的拖动只改变x，y，不改变points
  startControl.position({ x: line.position().x, y: line.position().y })
  endControl.position({ x: lineLength * cos + line.position().x, y: lineLength * sin + line.position().y })
}
const lecMoveStart = (event) => {
  const e = event.evt
  const el = e.currentTarget
  el.addEventListener('mousemove', lecMove)
  el.addEventListener('mouseup', lecMoveEnd)

  function lecMove() {
    const stage = stageRef.value.getNode()
    const group = stage.findOne('.mapGroup')
    const line = stage.findOne('.skillLine')
    const startControl = stage.findOne('.lineStartControl')
    const endControl = stage.findOne('.lineEndControl')
    const startPosition = { x: startControl.position().x, y: startControl.position().y }
    // NOTE 要根据最近的有定位的父级元素获取相对定位才是准的。group如果不定义x,y，则没有定位，故会越过这一层。
    const relativePosition = { x: group.getRelativePointerPosition().x, y: group.getRelativePointerPosition().y }
    const c = Math.sqrt((relativePosition.x - startPosition.x) ** 2 + (relativePosition.y - startPosition.y) ** 2)
    const a = relativePosition.x - startPosition.x
    const b = relativePosition.y - startPosition.y
    cos = a / c
    sin = b / c
    let angle = (Math.acos(cos) * 180) / Math.PI
    if (relativePosition.y < startPosition.y) {
      angle = -angle
    }
    line.rotation(angle)
    const endPosition = { x: lineLength * cos + line.position().x, y: lineLength * sin + line.position().y }
    endControl.position(endPosition)
  }

  function lecMoveEnd() {
    el.removeEventListener('mousemove', lecMove)
    el.removeEventListener('mouseup', lecMoveEnd)
  }
}
//#endregion

//#region 控制技能
const [fadeImg] = useImage(getImageUrl('/src/assets/agent/fade/fade_1.webp'))
const groupControlIconConfig = ref({
  x: 200,
  y: 200,
  draggable: true,
  name: 'groupControlIcon',
})
const controlStrokeConfig = ref({
  radius: 20,
  fill: '#000',
  stroke: '#23ffd0',
  strokeWidth: 2,
  name: 'skillControlStroke',
})
const controlImgConfig = ref({
  image: fadeImg,
  width: 30,
  height: 30,
  offsetX: 15,
  offsetY: 15,
  name: 'skillControlImg',
})
const controlLineConfig = ref({
  stroke: '#6c7dff',
  strokeWidth: 4,
  lineCap: 'round',
  tension: 0.4,
  name: 'skillControlLine',
})
const controlClick = (e) => {
  if (skillType.value != 'control' || e.evt.button == 2) return
  if (curveControlList.value.length == 0) {
    // 如果是第一次点击，则将技能图片的位置加入数组
    const groupControlIcon = stageRef.value.getNode().findOne('.groupControlIcon')
    curveControlList.value = [
      {
        ...groupControlIcon.position(),
        fill: '#fff',
        stroke: '#000',
        strokeWidth: 2,
        radius: 6,
        name: crypto.randomUUID(),
        draggable: true,
      },
    ]
    pointList.splice(0, 0, groupControlIcon.position().x, groupControlIcon.position().y)
  }
  const stage = stageRef.value.getNode()
  const group = stage.findOne('.mapGroup')
  const curve = stage.findOne('.skillControlLine')
  pointList.push(group.getRelativePointerPosition().x, group.getRelativePointerPosition().y)
  curve.points(pointList)
  curveControlList.value.push({
    x: group.getRelativePointerPosition().x,
    y: group.getRelativePointerPosition().y,
    fill: '#fff',
    stroke: '#000',
    strokeWidth: 2,
    radius: 6,
    name: crypto.randomUUID(),
    draggable: true,
  })
}
const controlIconDrag = () => {
  const stage = stageRef.value.getNode()
  const groupIcon = stage.findOne('.groupControlIcon')
  const line = stage.findOne('.skillControlLine')
  pointList.splice(0, 2, groupIcon.position().x, groupIcon.position().y)
  line.points(pointList)
  curveControlList.value[0].x = groupIcon.position().x
  curveControlList.value[0].y = groupIcon.position().y
}
let anima
const controlAnimaBuild = () => {
  const stage = stageRef.value.getNode()
  const layer = stage.findOne('Layer')
  const controlIcon = layer.findOne('.groupControlIcon')
  const line = layer.findOne('.skillControlLine')
  const path = ltp(line, 30)
  const pathLength = path.getLength()
  anima = new Konva.Animation((frame) => {
    let process = (frame.time % 3000) / 3000
    const point = path.getPointAtLength(process * pathLength)
    controlIcon.position(point)
  }, layer)
}
const controlAnimaStart = () => {
  anima.start()
}
const controlAnimaEnd = () => {
  anima.stop()
}
//#endregion

//#region 圆形技能
const circleStrokeConfig = ref({
  radius: 400,
  stroke: '#fff',
  strokeWidth: '5',
  shadowColor: '#e18ae5',
  shadowBlur: 5,
  shadowOpacity: 1,
  fillPatternImage: skillImg,
  fillPatternOffset: { x: 270, y: 270 },
  fillPatternScale: { x: 0.19, y: 0.19 },
  fillPatternRepeat: 'no-repeat',
  name: 'skillCircleStroke',
  // fill: 'red',
})
const circleCenterConfig = ref({
  radius: 3,
  fill: '#cdffff',
})
//#endregion

//#endregion

//#region 地图和技能选择
// 地图选择
// NOTE 直接在src中写可以使用上下级相对路径，但传入属性时只能从src传入
const selectWrapperImg = ref(`url(/src/assets/map/cover/${mapValue.value}.png)`)
const mapChange = () => {
  let [map1] = useImage(getImageUrl(`../../assets/map/detail/${mapValue.value}.png`))
  mapImageConfig.value.image = map1
  selectWrapperImg.value = `url(/src/assets/map/cover/${mapValue.value}.png)`
}
// 技能选择
const agentSelect = (label) => {
  agentLabel.value = label
  skillSelectIconList.value = [
    `/src/assets/agent/${agentValue.value}/${agentValue.value}_1.webp`,
    `/src/assets/agent/${agentValue.value}/${agentValue.value}_2.webp`,
    `/src/assets/agent/${agentValue.value}/${agentValue.value}_3.webp`,
    `/src/assets/agent/${agentValue.value}/${agentValue.value}_4.webp`,
  ]
  skillSelectAgent.value = `/src/assets/agent/${agentValue.value}/${agentValue.value}.webp`
}
let lastIndex = -1
const skillClick = (index) => {
  if (index == lastIndex) return
  lastIndex = index
  // 通过特工名字和技能代号确定技能类型
  skillType.value = skillInfo.find((skill) => skill.agent == agentValue.value && skill.index == index).type
  console.log(skillType.value)
  // line过点清空
  if (skillType.value == 'curve' || skillType.value == 'polygon' || skillType.value == 'control') {
    curveControlList.value.splice(0, curveControlList.value.length)
    pointList.splice(0, pointList.length)
    console.log(curveControlList.value)
  }
  // 更换载入图片
  changeImg(index)
}
//#endregion

//#region 设置栏
// 设置栏收起动画
const settingBarVisible = ref(false)
const settingBarSwitchOn = () => {
  const box = document.querySelector('.setting-bar')
  if (box.classList.contains('setting-bar-anime-fold')) {
    box.classList.remove('setting-bar-anime-fold')
  }
  box.classList.add('setting-bar-anime-unfold')
}
const settingBarSwitchOff = () => {
  const box = document.querySelector('.setting-bar')
  box.classList.remove('setting-bar-anime-unfold')
  box.classList.add('setting-bar-anime-fold')
}
// 开关按钮
const pointNameVisible = ref(false),
  skillBallVisible = ref(false),
  lightCurtainVisible = ref(false),
  controlAnchorVisible = ref(true),
  skillIconVisible = ref(false)
const controlAnchorVisibleClick = () => {
  const stage = stageRef.value.getNode()
  const type = skillType.value.charAt(0).toUpperCase() + skillType.value.slice(1, skillType.value.length)
  const group = stage.findOne(`.group${type}`)
  const circle = group.find('Circle')
  if (controlAnchorVisible.value) {
    circle.forEach((control) => {
      control.visible(true)
    })
  } else {
    circle.forEach((control) => {
      control.visible(false)
    })
  }
}
// 特工偏好列表
const settingBarAgentClick = (e, agent) => {
  let dom = document.getElementsByClassName('agent-img')
  for (let i = 0; i < dom.length; i++) {
    dom[i].style.backgroundColor = '#363636'
  }
  e.currentTarget.style.backgroundColor = '#96ef7b'
}
//#endregion

//#region 道具信息表单
const editInfoDialogVisible = ref(false)
const toleranceOptions = ref(['高', '中', '低'])
const postureOptions = ref(['站立', '下蹲', '跳投', '跑投', '跑跳投', '其他'])
const postureOthers = ref()
const sovaStrengthMarks = shallowReactive({
  // NOTE shallowReactive: 浅层响应式，只将对象的第一层属性转换为响应式
  1: '力度1',
  2: '力度2',
  3: '力度3',
  4: '力度4',
})
const form = reactive({
  // NOTE reactive只接受对象作为参数，访问的时候不用.value
  title: '',
  description: '',
  tolerance: '',
  strength: 1,
  rebound: 0,
  posture: '',
})
const ruleFormRef = ref()
const rules = reactive({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 30, message: '长度不超过30', trigger: 'blur' },
  ],
})
// 文件列表，选中图片后name和url会添加到这里
const fileList = ref([
  {
    name: '1.jpg',
    url: 'https://tse3.mm.bing.net/th/id/OIP.8ncjEMhKev8s7a8_5aB2MwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    name: '1.jpg',
    url: 'https://tse3.mm.bing.net/th/id/OIP.8ncjEMhKev8s7a8_5aB2MwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    name: '1.jpg',
    url: 'https://tse3.mm.bing.net/th/id/OIP.8ncjEMhKev8s7a8_5aB2MwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
])
// 图片预览
const fillPreviewVisible = ref(false)
const fillPreviewUrl = ref([])
const fillPreviewIndex = ref()
// 文件按钮
const filePreview = (file) => {
  fillPreviewUrl.value = []
  fileList.value.forEach((element) => {
    fillPreviewUrl.value.push(element.url)
  })
  fillPreviewIndex.value = file.index
  fillPreviewVisible.value = true
}
const fileRemove = (file) => {
  fileList.value.splice(file.index, 1)
}
const fillEditIndex = ref(0)
const fileEditVisible = ref(false)
const fileEdit = (file) => {
  fillEditIndex.value = file.index
  fileEditVisible.value = true
}
// 文件限制
const beforeUpload = (file) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  const whiteList = ['png', 'jpg', 'webp', 'jpeg']
  if (whiteList.indexOf(fileSuffix) == -1) {
    ElMessage.error('上传文件只能是图片格式')
    return false
  }
  if (file.size / 1024 / 1024 > 10) {
    ElMessage.error('上传文件大小不能超过10MB')
    return false
  }
}
const exceedLimit = () => {
  ElMessage.error('最多上传6张图片')
}
// 表单提交
const uploadRef = ref()
const submit = async (form) => {
  if (!form) return
  if (fileList.value.length == 0) {
    ElMessage.error('请上传点位示意图')
    return false
  }
  await form.validate((valid, fields) => {
    if (valid) {
      uploadRef.value.submit()
    } else {
      console.log(fields)
    }
  })
}
//#endregion
</script>

<template>
  <div class="container" ref="containerRef">
    <!-- 选择 -->
    <div class="select-aside">
      <!-- 地图选择 -->
      <el-select
        class="map-select"
        v-model="mapValue"
        :show-arrow="false"
        :offset="7"
        popper-class="map-select-dropdown"
        @change="mapChange"
        id="selectId"
      >
        <el-option v-for="map in maps" :key="map.value" :label="map.label" :value="map.value">
          <div style="position: relative">
            <!-- TODO width非固定值 -->
            <img :src="getImageUrl(`../../assets/map/cover/${map.value}.png`)" style="width: 257px; height: auto; object-fit: cover" />
            <span class="large-text" style="position: absolute; left: 20px">{{ map.label }}</span>
          </div>
        </el-option>
      </el-select>
      <br />
      <!-- 英雄选择 -->
      <div>
        <p class="label-text">选择英雄</p>
        <el-select class="agent-select" v-model="agentValue" :show-arrow="false" :offset="7" popper-class="agent-select-dropdown">
          <el-option
            v-for="agent in agents"
            :key="agent.value"
            :label="agent.label"
            :value="agent.value"
            @click="agentSelect(agent.label)"
          ></el-option>
        </el-select>
      </div>
      <br />
      <div class="row">
        <img class="agent-icon" :src="skillSelectAgent" />
        <span class="agent-name"
          ><strong>{{ agentLabel }}</strong></span
        >
      </div>
      <br />
      <!-- 技能选择 -->
      <div class="row-space">
        <div class="skills">
          <img class="skill-icon" :src="skillSelectIconList[0]" @click="skillClick(1)" />
        </div>
        <div class="skills">
          <img class="skill-icon" :src="skillSelectIconList[1]" @click="skillClick(2)" />
        </div>
        <div class="skills">
          <img class="skill-icon" :src="skillSelectIconList[2]" @click="skillClick(3)" />
        </div>
        <div class="skills">
          <img class="skill-icon" :src="skillSelectIconList[3]" @click="skillClick(4)" />
        </div>
      </div>
      <br /><br />
      <!-- 收藏点位 -->
      <el-button class="show-collect" color="#363636" @click="editInfoDialogVisible = true">
        <template #default>
          上传<el-icon class="el-icon--right"><Star /></el-icon>
        </template>
      </el-button>
    </div>
    <!-- 画布 -->
    <div class="map-container" ref="mapContainerRef" @contextmenu.prevent>
      <v-stage ref="stageRef" :config="stageConfig">
        <v-layer>
          <v-group :config="groupConfig" @click="(curveClick($event), polygonClick($event), controlClick($event))">
            <!-- 背景地图 -->
            <v-image :config="mapImageConfig" />
            <!-- throw型 -->
            <v-group :config="{ name: 'groupThrow' }" v-if="skillType == 'throw'">
              <!-- 连线 -->
              <v-line :config="throwLineConfig" />
              <!-- 特工图标 -->
              <v-image :config="throwAgentIconConfig" @dragmove="dragIcon" />
              <v-group :config="groupThrowIconConfig" @dragmove="dragIcon">
                <!-- 技能范围 -->
                <v-circle :config="throwSkillRangeConfig" />
                <!-- 技能图标 -->
                <v-image :config="throwSkillIconConfig" v-if="skillIconVisible" />
                <!-- 技能中心点 -->
                <v-circle :config="throwSkillCenterConfig" v-else />
              </v-group>
            </v-group>
            <!-- curve型 -->
            <v-group :config="{ name: 'groupCurve' }" v-if="skillType == 'curve'">
              <v-line :config="curveConfig" @contextmenu="curveMenu($event)" />
              <v-circle
                v-if="controlAnchorVisible"
                v-for="circle in curveControlList"
                :config="circle"
                @dragmove="curveControlDrag(circle.name)"
                @contextmenu="curveControlMenu(circle.name, $event)"
              />
              <!-- 右键菜单 -->
              <div
                v-if="editMenuVisible"
                :style="{
                  position: 'absolute',
                  left: menuPosition.x + 'px',
                  top: menuPosition.y + 'px',
                  width: '60px',
                  backgroundColor: '#1a1a1a',
                  boxShadow: '0 0 5px grey',
                  zIndex: 99,
                }"
              >
                <button
                  v-if="insertVisible"
                  :style="{ width: '100%', backgroundColor: '#363636', border: 'none', margin: 0, padding: '10px', cursor: 'pointer' }"
                  @mouseover="(e) => (e.target.style.backgroundColor = '#686767')"
                  @mouseout="(e) => (e.target.style.backgroundColor = '#363636')"
                  @click="insertControl"
                >
                  插入
                </button>
                <button
                  v-if="deleteVisible"
                  :style="{ width: '100%', backgroundColor: '#363636', border: 'none', margin: 0, padding: '10px', cursor: 'pointer' }"
                  @mouseover="(e) => (e.target.style.backgroundColor = '#686767')"
                  @mouseout="(e) => (e.target.style.backgroundColor = '#363636')"
                  @click="deleteControl"
                >
                  删除
                </button>
                <button
                  :style="{ width: '100%', backgroundColor: '#363636', border: 'none', margin: 0, padding: '10px', cursor: 'pointer' }"
                  @mouseover="(e) => (e.target.style.backgroundColor = '#686767')"
                  @mouseout="(e) => (e.target.style.backgroundColor = '#363636')"
                  @click="editMenuVisible = false"
                >
                  取消
                </button>
              </div>
            </v-group>
            <!-- polygon型 -->
            <v-group :config="{ name: 'groupPolygon' }" v-if="skillType == 'polygon'">
              <v-line :config="polygonConfig" @dragmove="polygonMove" @contextmenu="curveMenu($event)" />
              <v-circle
                v-if="controlAnchorVisible"
                v-for="circle in curveControlList"
                :config="circle"
                @dragmove="curveControlDrag(circle.name)"
                @contextmenu="curveControlMenu(circle.name, $event)"
              />
              <!-- 右键菜单 -->
              <div
                v-if="editMenuVisible"
                :style="{
                  position: 'absolute',
                  left: menuPosition.x + 'px',
                  top: menuPosition.y + 'px',
                  width: '60px',
                  backgroundColor: '#1a1a1a',
                  boxShadow: '0 0 5px grey',
                  zIndex: 99,
                }"
              >
                <button
                  v-if="insertVisible"
                  :style="{ width: '100%', backgroundColor: '#363636', border: 'none', margin: 0, padding: '10px', cursor: 'pointer' }"
                  @mouseover="(e) => (e.target.style.backgroundColor = '#686767')"
                  @mouseout="(e) => (e.target.style.backgroundColor = '#363636')"
                  @click="insertControl"
                >
                  插入
                </button>
                <button
                  v-if="deleteVisible"
                  :style="{ width: '100%', backgroundColor: '#363636', border: 'none', margin: 0, padding: '10px', cursor: 'pointer' }"
                  @mouseover="(e) => (e.target.style.backgroundColor = '#686767')"
                  @mouseout="(e) => (e.target.style.backgroundColor = '#363636')"
                  @click="deleteControl"
                >
                  删除
                </button>
                <button
                  :style="{ width: '100%', backgroundColor: '#363636', border: 'none', margin: 0, padding: '10px', cursor: 'pointer' }"
                  @mouseover="(e) => (e.target.style.backgroundColor = '#686767')"
                  @mouseout="(e) => (e.target.style.backgroundColor = '#363636')"
                  @click="editMenuVisible = false"
                >
                  取消
                </button>
              </div>
            </v-group>
            <!-- line型 -->
            <v-group :config="{ name: 'groupLine' }" v-if="skillType == 'line'">
              <v-line :config="lineConfig" @dragmove="lineMove" />
              <v-rect :config="lineStartControl" />
              <v-circle :config="lineEndControl" @mousedown="lecMoveStart" />
            </v-group>
            <!-- control型 -->
            <v-group :config="{ name: 'groupControl' }" v-if="skillType == 'control'">
              <el-button type="success" @click="controlAnimaBuild">创建</el-button>
              <el-button type="danger" @click="controlAnimaStart">启动</el-button>
              <el-button type="info" @click="controlAnimaEnd">停止</el-button>
              <v-line :config="controlLineConfig" @contextmenu="curveMenu($event)" />
              <v-circle
                v-for="circle in curveControlList"
                :config="circle"
                @dragmove="curveControlDrag(circle.name)"
                @contextmenu="curveControlMenu(circle.name, $event)"
              />
              <v-group :config="groupControlIconConfig" @dragmove="controlIconDrag()">
                <v-circle :config="controlStrokeConfig" />
                <v-image :config="controlImgConfig" />
              </v-group>
            </v-group>
            <!-- circle型 -->
            <v-group :config="{ name: 'groupCircle', x: 300, y: 400, draggable: true }" v-if="skillType == 'circle'">
              <v-circle :config="circleStrokeConfig" />
              <v-circle :config="circleCenterConfig" />
            </v-group>
          </v-group>
        </v-layer>
      </v-stage>
    </div>
    <!-- 道具信息表单 -->
    <el-dialog class="lineup-dialog" v-model="editInfoDialogVisible" width="50%" title="A厅探测箭" :show-close="false">
      <template #header="{ close }">
        <div style="display: flex; justify-content: space-between">
          <div class="large-text">A大前压箭</div>
          <!-- TODO 让文字和ICON平齐，更好的方法 -->
          <div style="display: flex; align-items: center; line-height: 20px">
            <div class="large-text">反馈</div>
            <el-icon size="20" style="color: #fff; margin-left: 20px" @click="close"><CloseBold /></el-icon>
          </div>
        </div>
      </template>
      <div class="lineup-dialog-main" style="max-width: 600px">
        <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="auto" label-position="left" size="large" style="margin-bottom: 40px">
          <el-form-item label="标题" prop="title">
            <el-input class="dark" v-model="form.title" placeholder="如“A大防前压箭”"></el-input>
          </el-form-item>
          <el-form-item label="道具描述" class="default-text">
            <el-input class="dark" v-model="form.description" placeholder="如“开局射，帮助队友抢A大”"></el-input>
          </el-form-item>
          <el-form-item label="容错率">
            <el-segmented v-model="form.tolerance" :options="toleranceOptions" />
          </el-form-item>
          <el-form-item label="出手方式">
            <el-segmented v-model="form.posture" :options="postureOptions" />
            <el-input v-model="postureOthers" v-if="form.posture == '其他'" placeholder="请补充其他出手方式"></el-input>
          </el-form-item>
          <el-form-item label="蓄力反弹" class="slider-demo-block" style="margin-bottom: 40px">
            <div class="flex-center" style="width: 100%">
              <el-slider v-model="form.strength" :marks="sovaStrengthMarks" step="mark" :min="1" :max="4" />
              <el-input-number v-model="form.rebound" :min="0" :max="2" style="width: 250px">
                <template #suffix>
                  <span>反弹</span>
                </template>
              </el-input-number>
            </div>
          </el-form-item>
          <el-form-item label="点位图片">
            <div>拖拽文件或者点击上传，大小不超过10MB。点击编辑按钮可为图片添加标注。</div>
            <el-upload
              action="#"
              ref="uploadRef"
              list-type="picture-card"
              :auto-upload="false"
              v-model:file-list="fileList"
              drag
              multiple
              :limit="6"
              :on-exceed="exceedLimit"
              :before-upload="beforeUpload"
            >
              <el-icon><Plus /></el-icon>
              <!-- NOTE 插槽作用域，解决通信问题 -->
              <template #file="file">
                <img class="el-upload-list__item-thumbnail" :src="file.file.url" />
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview">
                    <i class="el-icon el-icon--zoom-in" @click="fileEdit(file)"> <Edit /></i>
                  </span>
                  <span class="el-upload-list__item-preview">
                    <i class="el-icon el-icon--zoom-in" @click="filePreview(file)"> <ZoomIn /></i>
                  </span>
                  <span class="el-upload-list__item-delete" @click="fileRemove(file)">
                    <i class="el-icon el-icon--zoom-in"> <Delete /></i>
                  </span>
                </span>
              </template>
            </el-upload>
            <el-input v-if="fileEditVisible" v-model="fileList[fillEditIndex].tips" placeholder="为图片添加说明"></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="success" @click="submit(ruleFormRef)" style="width: 100%">上传</el-button>
          </el-form-item>
        </el-form>
        <el-image-viewer
          v-if="fillPreviewVisible"
          @close="fillPreviewVisible = false"
          :url-list="fillPreviewUrl"
          :zoom-rate="1.2"
          :max-scale="2"
          :min-scale="0.5"
          :initial-index="fillPreviewIndex"
          show-progress
        />
      </div>
    </el-dialog>
    <!-- 设置 -->
    <div class="setting-bar">
      <div class="setting-bar-container">
        <div class="flex-center" style="line-height: 25px">
          <el-icon :size="25" color="#fff"><Tools /></el-icon>
          &nbsp;
          <span class="title-text">设置</span>
        </div>
        <!-- NOTE 两个行级元素垂直对齐才会生效 -->
        <div class="flex-center">
          <div class="large-text">点位报点</div>
          <el-switch size="large" class="setting-switch" v-model="pointNameVisible" />
        </div>
        <div class="flex-center">
          <div class="large-text">终极宝珠</div>
          <el-switch size="large" class="setting-switch" v-model="skillBallVisible" />
        </div>
        <div class="flex-center">
          <div class="large-text">出生光幕</div>
          <el-switch size="large" class="setting-switch" v-model="lightCurtainVisible" />
        </div>
        <div class="flex-center">
          <div class="large-text">控制锚点</div>
          <el-switch size="large" class="setting-switch" v-model="controlAnchorVisible" @click="controlAnchorVisibleClick" />
        </div>
        <div class="flex-center">
          <div class="large-text">技能图标</div>
          <el-switch size="large" class="setting-switch" v-model="skillIconVisible" @click="controlAnchorVisibleClick" />
        </div>
        <p class="label-text">特工偏好</p>
        <div class="agent-img-container">
          <img
            class="agent-img"
            :src="getImageUrl(`../../assets/agent/${item.value}/${item.value}.webp`)"
            v-for="(item, index) in agents"
            :key="index"
            @click="settingBarAgentClick($event, item.value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-content: center;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid red;
  background: url('../../assets/bg.webp');
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.map-container {
  height: 100%;
  width: 100%;
  min-width: 650px;
  overflow: hidden;
}

.select-aside {
  height: 100%;
  min-width: 300px;
  padding: 10px 20px;
  box-sizing: border-box;
  border-right: 1px solid #363636;
  background-color: #1a1a1a;
  // box-shadow: 1px 0px 1px 0px rgba(0, 0, 0, 0.5);

  .row {
    display: flex;
    align-items: center;
  }

  .row-space {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .agent-icon {
    width: 50px;
    height: 50px;
    // border: 1px solid #fff;
    border-radius: 10%;
  }

  .agent-name {
    color: #fff;
    font-size: 45px;
    margin-left: 10px;
  }

  .skills {
    position: relative;

    .skill-icon {
      width: 50px;
      border-radius: 50%;
      border: 2px solid #fff;
    }

    .skill-icon:hover {
      width: 50px;
      border-radius: 50%;
      border: 2px solid #fff;
      background-color: #686767;
    }
  }

  .show-collect {
    width: 100%;
    height: 40px;
    font-size: 20px;
    // --el-button-bg-color: #363636;
    --el-button-border-color: rgba(0, 0, 0, 0);
  }
}

.setting-bar {
  height: 100%;
  min-width: 300px;
  border-left: 1px solid #363636;
  background-color: #1a1a1a;
  overflow: scroll;

  .setting-bar-container {
    margin-left: 20px;
    margin-top: 5px;
    margin-right: 5px;
    // 父元素不是flex，可以通过设置固定宽度使其不会被压缩
    width: 275px;

    div {
      margin-top: 10px;
    }

    .setting-switch {
      margin-left: 15px;
      --el-switch-off-color: #363636;
    }

    .agent-img-container {
      margin-left: -5px;
    }

    .agent-img {
      width: 63px;
      background-color: #363636;
      border-radius: 5px;
      margin-left: 5px;
    }

    // NOTE !important>style>css伪类>id>class，js修改style会导致style高过css伪类，从而使hover消失
    .agent-img:hover {
      background-color: #96ef7b !important;
    }
  }
}

.setting-bar::-webkit-scrollbar {
  display: none;
}

.lineup-dialog {
  .lineup-dialog-main {
    max-height: calc(90vh - 20px);
    overflow: scroll;
  }
  .lineup-dialog-main::-webkit-scrollbar {
    display: none;
  }

  .slider-demo-block {
    max-width: 600px;
    display: flex;
    align-items: center;
  }

  .slider-demo-block .el-slider {
    margin-top: 0;
    margin-left: 12px;
    margin-right: 30px;
  }

  .slider-demo-block + .slider-demo-block {
    // margin-top: 20px;
  }
}
</style>
<style lang="scss">
.map-select {
  .el-select__wrapper {
    min-height: 100px;
    height: 100px;
    background-image: v-bind(selectWrapperImg);
    background-repeat: no-repeat;
    background-size: cover;
    font-size: 27px;
    font-weight: bold;
    line-height: 27px;
  }

  .el-select__placeholder {
    color: #fff;
  }
}
.map-select-dropdown {
  --el-popper-bg-color-light: #1a1a1a !important;
  --el-border-color-light: rgba(0, 0, 0, 0);

  .el-select-dropdown__wrap {
    max-height: 540px;
  }

  .el-select-dropdown__list {
    padding: 0 0;
  }

  .el-select-dropdown__item {
    height: 100px;
    margin-top: 10px;
    border-radius: 4px;
    padding: 0 0;
    // background-image: url('../../assets/map/cover/bind.png');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .el-select-dropdown__item:first-child {
    margin-top: 0px;
  }

  .el-select-dropdown__item.is-hovering {
    background-color: rgba(0, 0, 0, 0);
  }
}

.agent-select {
  --el-text-color-regular: #fff;
  --el-text-color-placeholder: #fff;
  .el-select__wrapper {
    background-color: #1a1a1a;
  }
}

.agent-select-dropdown {
  --el-popper-bg-color-light: #1a1a1a !important;
  color: #fff;

  .el-select-dropdown__item.is-hovering {
    background-color: #363636;
  }
}

.lineup-dialog {
  min-width: 1000px;
  margin: 0 auto !important;
  margin-top: 30px !important;
  max-height: 90vh;
  overflow: hidden;
  --el-dialog-bg-color: #1a1a1a !important;
}
</style>
