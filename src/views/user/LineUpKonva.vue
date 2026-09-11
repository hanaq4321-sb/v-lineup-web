<script setup>
import Player, { Events } from 'xgplayer'
import 'xgplayer/dist/index.min.css'
import { useFFmpeg } from '@/utils/ffmpeg'
import { usePreloadInfoStore } from '@/store/preload-info'
import { getSkillContentService, updateSkillContentVideoService } from '@/api/skill-content'
// 获取技能信息service
import {
  getThrowSkillService,
  getThrowSkillCollectService,
  getThrowSkillCountsService,
  getLineSkillService,
  getLineSkillCollectService,
  getLineSkillCountsService,
  getThrowGroundSkillService,
  getThrowGroundSkillCollectService,
  getThrowGroundSkillCountsService,
  getControlSkillService,
  getControlSkillCollectService,
  getControlSkillCountsService,
} from '@/api/skill-type'
import { ifCollectService, addCollectService, deleteCollectService } from '@/api/collect-like'
import { nextTick, ref, onBeforeMount, onMounted, reactive, shallowReactive, onBeforeUnmount, computed, watch } from 'vue'
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
  Upload,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Konva from 'konva'
import { ltp } from '../../utils/lineToPath'
import {
  controlConfig,
  rotateControlCircle,
  dragLineBothEnd,
  rotateControlImg,
  ControlRotate,
  controlHover,
  controlLeave,
} from '@/styles/js/skill-editor'
import { mapDraggable, controlMapDraggable, handleWheel, mapZoomButton, mapRotate, resetMap, sideRotate } from '@/styles/js/map-adjust'
import RotateRight from '~icons/ix/rotate-90-right'
import RotateLeft from '~icons/ix/rotate-90-left'
import settingBar from './public/settingBar.vue'
import Like from '~icons/mdi/like-outline'
import LikeFilled from '~icons/mdi/like'
import { useAgentSelectStore, useSettingBarStore, useTokenStore } from '@/store/user'
import { storeToRefs } from 'pinia'

//#region 地图、特工、技能信息
const { progress, compressVideo } = useFFmpeg()
const selectStore = useAgentSelectStore()
const settingStore = useSettingBarStore()
const tokenStokre = useTokenStore()
const preloadInfo = usePreloadInfoStore()
const { mapValue, agentValue, agentLabel, skillIndex } = storeToRefs(selectStore)
const { pointNameVisible, skillBallVisible, lightCurtainVisible, skillIconVisible } = storeToRefs(settingStore)
const { agentDetail, skillDetail, attackBarrierArray, defendBarrierArray, textArray, skillBallArray } = storeToRefs(preloadInfo)
const { mapInfo, skillData, agentInfo } = preloadInfo
const skillType = ref('controlStraight')
//#endregion

//#region 画布

//#region 画布属性
const containerRef = ref()
const mapContainerRef = ref()
const stageRef = ref()
const stageConfig = ref({
  x: 0,
  y: 0,
  draggable: true,
  //TODO 禁止拖动选项
})
const mapContainerGroupCfg = ref({
  width: 1000,
  height: 1000,
  offsetX: 500,
  offsetY: 500,
  name: 'mapContainerGroup',
})
const mapImgGroupCfg = ref({
  width: 1000,
  height: 1000,
  draggable: false,
  stroke: 'red',
  strokeWidth: 2,
  name: 'mapImgGroup',
})
let [map] = useImage(`map/detail/${mapValue.value}.png`)
const mapImageConfig = ref({
  width: 1000,
  height: 1000,
  image: map,
  name: 'mapImage',
})
const skillGroupConfig = ref({
  // 固定画布大小，调整scale适应屏幕。若不固定大小，根据mounted获取会造成在不同桌面缩放比例下，创建的组件大小不同,方便匹配组件大小。
  width: 1000,
  height: 1000,
  draggable: false,
  name: 'mapGroup',
  stroke: 'red',
  strokeWidth: 2,
})
//#endregion

//#region 窗口尺寸监听
const observer = new ResizeObserver(() => {
  // 画布尺寸随地图窗口变化，并非整个页面，这样折叠侧边栏时也能触发
  const stage = stageRef.value.getNode()
  stage.width(mapContainerRef.value.clientWidth)
  stage.height(mapContainerRef.value.clientHeight)
  // 中间地图group随窗口缩放scale,尺寸不变化。
  const group = stage.findOne('.mapContainerGroup')
  let scaleY = mapContainerRef.value.clientHeight / group.height()
  group.scale({ x: scaleY, y: scaleY })
  group.position({ x: mapContainerRef.value.clientWidth / 2, y: mapContainerRef.value.clientHeight / 2 })
  stage.batchDraw()
})
const hover = ref(null)
onBeforeMount(async () => {
  // NOTE 要先use(pinia)后才能使用，而正常导入js文件优先级非常高，会先于app.use。故这里使用延迟动态导入
  // NOTE 钩子函数中await并阻碍整体的渲染，只会影响钩子函数内部的顺序，故使用v-if等待加载完成后再渲染
  const { throwHover, throwUnHover, lineHover, lineUnHover, throwGroundHover, throwGroundUnHover, controlHover, controlUnHover } =
    await import('@/styles/js/skill-hover')
  hover.value = { throwHover, throwUnHover, lineHover, lineUnHover, throwGroundHover, throwGroundUnHover, controlHover, controlUnHover }
})
onMounted(async () => {
  observer.observe(mapContainerRef.value)
  const stage = stageRef.value.getNode()
  const mapPoints = stage.find('#point')
  // TODO 统一适用
  mapPoints.forEach((e) => {
    // 文字以中心为原点，并修正原点改变后的偏移量
    e.position({ x: e.position().x + e.width() / 2, y: e.position().y + e.height() / 2 })
    e.offset({ x: e.width() / 2, y: e.height() / 2 })
  })
})
onBeforeUnmount(() => {
  // NOTE 在组件销毁时应该销毁监听器，否则页面重新加载时会导致上一个监听器获取不到还未加载完的界面
  observer.disconnect()
})
//#endregion

//#endregion

//#region 技能绘制

//#region 更改图片
let skillImg = useImage(`agent/${agentValue.value}/${agentValue.value}_3.webp`)[0]
let agentImg = useImage(`agent/${agentValue.value}/${agentValue.value}.webp`)[0]
let skillDetailImg = useImage(`agent/${agentValue.value}/${agentValue.value}_3_detail.png`)[0]
const changeImg = (index) => {
  skillImg = useImage(`agent/${agentValue.value}/${agentValue.value}_${index}.webp`)[0]
  agentImg = useImage(`agent/${agentValue.value}/${agentValue.value}.webp`)[0]
  skillDetailImg = useImage(`agent/${agentValue.value}/${agentValue.value}_${index}_detail.png`)[0]
  // TODO 切换英雄重置技能选择
}
//#endregion

//#region 抛掷落地技能
const throwGroundIconCfg = ref({
  width: 46.06 * 2,
  height: 46.06 * 2,
  offset: { x: 46.06, y: 46.06 },
  cornerRadius: 46.06,
  scale: { x: 0.6, y: 0.6 },
  image: skillImg,
})
const throwGroundRealCfg = ref({
  width: 46.06 * 2,
  height: 46.06 * 2,
  offset: { x: 46.06 + 1, y: 46.06 },
  cornerRadius: 46.06,
  opacity: 0.9,
  image: skillDetailImg,
})
const throwGroundCircleCfg = ref({
  radius: 46.06,
  fill: 'rgba(235, 217, 47,0.2)',
  stroke: '#ebd92f',
  strokeWidth: 4,
})
const throwGroundAgentCfg = ref({
  x: 500,
  y: 700,
  width: 40,
  height: 40,
  offset: { x: 20, y: 20 },
  fill: '#000',
  cornerRadius: 5,
  image: agentImg,
  draggable: true,
  name: 'throwGroundAgent',
})
//#endregion

//#region 曲线技能
const controlAnchorList = ref([])
const pointList = []
let lineType = ''
const curveConfig = ref({
  stroke: '#6c7dff',
  strokeWidth: 4,
  lineCap: 'round',
  tension: 0.5,
  name: 'skillCurve',
})
const editMenuVisible = ref(false)

// 右键菜单
const editInsertVisible = ref(true)
const menuPosition = ref({ x: 0, y: 0 })
let rightTargetIndex = 0
const rightMenu = (name, e) => {
  menuPosition.value = { x: e.evt.clientX + 4, y: e.evt.clientY + 4 }
  rightTargetIndex = controlAnchorList.value.findIndex((e) => e.name == name)
  if (rightTargetIndex == 0) editInsertVisible.value = false
  else editInsertVisible.value = true
  editMenuVisible.value = true
}
const insertControlAnchor = () => {
  editMenuVisible.value = false
  const stage = stageRef.value.getNode()
  const line = stage.findOne(`${lineType}`)
  const point1 = controlAnchorList.value[rightTargetIndex - 1]
  const point2 = controlAnchorList.value[rightTargetIndex]
  const newPoint = { x: (point2.x + point1.x) / 2, y: (point2.y + point1.y) / 2 }
  controlAnchorList.value.splice(rightTargetIndex, 0, {
    x: newPoint.x,
    y: newPoint.y,
    fill: '#fff',
    stroke: '#000',
    strokeWidth: 2,
    radius: 6,
    name: crypto.randomUUID(),
    draggable: true,
  })
  pointList.splice(rightTargetIndex * 2, 0, newPoint.x, newPoint.y)
  line.points(pointList)
}
const deleteControlAnchor = () => {
  editMenuVisible.value = false
  controlAnchorList.value.splice(rightTargetIndex, 1)
  pointList.splice(rightTargetIndex * 2, 2)
  const stage = stageRef.value.getNode()
  const line = stage.findOne(`${lineType}`)
  line.points(pointList)
}
//#endregion

//#region 多边形技能
const polygonConfig = ref({
  stroke: '#6c7dff',
  strokeWidth: 5,
  lineJoin: 'bevel',
  fill: 'rgba(0, 0, 0, 0.3)',
  closed: true,
  lineJoin: 'bevel',
  name: 'skillPolygon',
})
//#endregion

//#endregion

//#region 控制技能
const groupControlIconConfig = ref({
  x: 200,
  y: 200,
  draggable: true,
  name: 'groupControlIcon',
})
const controlStrokeConfig = ref({
  radius: 20,
  fill: 'rgba(0,0,0,0.8)',
  stroke: '#23ffd0',
  strokeWidth: 2,
  name: 'skillControlStroke',
})
const controlImgConfig = ref({
  image: skillImg,
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
  name: 'skillControl',
})
const controlSkillIconDrag = () => {
  const stage = stageRef.value.getNode()
  const groupIcon = stage.findOne('.groupControlIcon')
  const line = stage.findOne(`${lineType}`)
  pointList[0] = groupIcon.position().x
  pointList[1] = groupIcon.position().y
  controlAnchorList.value[0] = { x: groupIcon.position().x, y: groupIcon.position().y }
  line.points(pointList)
}
let anima
const controlAnimaBuild = () => {
  const stage = stageRef.value.getNode()
  const layer = stage.findOne('Layer')
  const controlIcon = layer.findOne('.groupControlIcon')
  const line = layer.findOne('.skillControl')
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

//#region 控制直线技能
const controlStraightLineConfig = ref({
  stroke: '#6c7dff',
  strokeWidth: 4,
  lineCap: 'round',
  lineJoin: 'bevel',
  name: 'skillControlStraight',
})
//#endregion

//#region 圆形技能
const circleStrokeConfig = ref({
  radius: 28,
  stroke: '#fff',
  // NOTE strokeWidth是内外都扩展，内部2px，外部2px
  strokeWidth: 4,
  shadowColor: '#e18ae5',
  shadowBlur: 4,
  shadowOpacity: 1,
})
const circleShadeConfig = ref({
  radius: 28,
  fill: 'rgba(225,138,229,0.1)',
})
const [clove] = useImage('agent/clove/clove_3_detail.png')
const circleImgConfig = ref({
  // 半径加2
  width: (28 + 2) * 2,
  height: (28 + 2) * 2,
  offset: { x: 28 + 2, y: 28 + 2 },
  cornerRadius: 28 + 2,
  image: clove,
  opacity: 0.9,
})
const circleCenterConfig = ref({
  radius: 3,
  fill: '#fff',
})
//#endregion

//#region 放置技能
// TODO 设置一个公共的圆形或方形技能图片
const placeType = ref('rect')
const placeIconCircleCfg = ref({
  radius: 15,
  stroke: '#fff',
  strokeWidth: 1,
  fill: '#000',
  id: 'iconCircle',
})
const placeImgCfg = ref({
  width: 30,
  height: 30,
  offset: { x: 15, y: 15 },
  cornerRadius: 15,
  scale: { x: 0.8, y: 0.8 },
  image: skillImg,
})
// 矩形
const placeRectCfg = ref({
  width: 63,
  height: 56,
  offsetY: 28,
  stroke: '#64bfff',
  fill: 'rgba(100, 191, 255,0.1)',
  strokeWidth: 2,
})
const groupPlaceRectRotateControl = ref({
  x: 63 + 20,
})
// 圆形
const placeCircleCfg = ref({
  radius: 126,
  fill: 'rgba(255, 143, 36,0.1)',
  stroke: '#ff8f24',
  strokeWidth: 2,
})
// 扇形
const sectorX = Math.cos((50 / 180) * Math.PI) * 70
const sectorY = Math.sin((50 / 180) * Math.PI) * 70
const placeSectorPath = ref({
  data: `M 0,0 L ${sectorX},${-sectorY} M 0,0 L ${sectorX},${sectorY}`,
  stroke: '#fff',
  strokeWidth: 2,
})
const placeSectorWedge = ref({
  angle: 100,
  radius: 70,
  rotation: -50,
  fillLinearGradientStartPoint: { x: 0, y: 0 },
  fillLinearGradientEndPoint: { x: 70, y: 70 },
  fillLinearGradientColorStops: [0, 'rgba(247, 222, 49,0.8)', 1, 'rgba(247, 222, 49,0)'],
})
const groupPlaceSectorRotateControl = ref({
  x: 70 + 20,
})
// 直线
const placeStraightStartControl = ref({
  x: -52.5,
  radius: 7,
  fill: '#fff',
  stroke: '#000',
  strokeWidth: 2,
})
const placeStraightEndControl = ref({
  x: 52.5,
  radius: 7,
  fill: '#fff',
  stroke: '#000',
  strokeWidth: 2,
})
const placeStraightLine = ref({
  points: [-52.5, 0, 52.5, 0],
  stroke: '#93d5ff',
  strokeWidth: 4,
  name: 'placeStraightLine',
})
const placeStriaghtControlMove = (event, index) => {
  const node = event.currentTarget
  const e = event.evt.currentTarget
  e.addEventListener('mousemove', moveStart)
  e.addEventListener('mouseup', moveEnd)
  const stage = stageRef.value.getNode()
  const groupPlace = stage.findOne('.groupPlace')
  const line = stage.findOne('.placeStraightLine')
  const pointList = line.points()
  const groupPlaceIcon = stage.findOne('.groupPlaceIcon')
  function moveStart(e) {
    e.stopPropagation()
    const anotherIndex = 1 - index
    const anotherPosition = { x: pointList[anotherIndex * 2], y: pointList[anotherIndex * 2 + 1] }
    const pointerPosition = groupPlace.getRelativePointerPosition()
    let d = Math.sqrt((pointerPosition.x - anotherPosition.x) ** 2 + (pointerPosition.y - anotherPosition.y) ** 2)
    console.log(d)
    // 超出最大距离的限制，类似旋转
    if (d > 105) {
      const r = 105 / d
      const x = (pointerPosition.x - anotherPosition.x) * r + anotherPosition.x
      const y = (pointerPosition.y - anotherPosition.y) * r + anotherPosition.y
      node.position({ x: x, y: y })
      pointList.splice(index * 2, 2, x, y)
    } else {
      node.position(pointerPosition)
      pointList.splice(index * 2, 2, pointerPosition.x, pointerPosition.y)
    }
    line.points(pointList)
    groupPlaceIcon.position({ x: (pointList[2] + pointList[0]) / 2, y: (pointList[3] + pointList[1]) / 2 })
  }
  function moveEnd() {
    e.removeEventListener('mousemove', moveStart)
    e.removeEventListener('mouseup', moveEnd)
  }
}
// 十字
const crossX = 70 * Math.cos(Math.PI / 4)
const [yaoTouIcon] = useImage('image/icon/rotate.png')
const groupPlaceCrossControl = ref({
  x: crossX + 40,
})
const placeCrossControl1 = ref({
  x: -crossX,
  y: -crossX,
  ...controlConfig,
})
const placeCrossControl2 = ref({
  x: crossX,
  y: -crossX,
  ...controlConfig,
})
const placeCrossControl3 = ref({
  x: crossX,
  y: crossX,
  ...controlConfig,
})
const placeCrossControl4 = ref({
  x: -crossX,
  y: crossX,
  ...controlConfig,
})
const placeCrossLine1 = ref({
  points: [-crossX, -crossX, crossX, crossX],
  stroke: '#93d5ff',
  strokeWidth: 4,
  name: 'placeStraightLine1',
})
const placeCrossLine2 = ref({
  points: [crossX, -crossX, -crossX, crossX],
  stroke: '#93d5ff',
  strokeWidth: 4,
  name: 'placeStraightLine2',
})
let crossOccupy = [false, false, false, false]
let crossSumOccupy = false
const placeControlAdjustLength = (event, index) => {
  const e = event.evt.currentTarget
  const node = event.currentTarget
  e.addEventListener('mousemove', moveStart)
  e.addEventListener('mouseup', moveEnd)
  const stage = stageRef.value.getNode()
  const placeGroup = stage.findOne('.groupPlace')
  const line1 = stage.findOne('.placeStraightLine1')
  const line2 = stage.findOne('.placeStraightLine2')
  const pointList1 = line1.points()
  const pointList2 = line2.points()
  const groupIcon = stage.findOne('.groupPlaceIcon')
  function moveStart(e) {
    e.stopPropagation()
    // 仅限45度，x=y
    const x = placeGroup.getRelativePointerPosition().x
    let d = 0
    // 计算每条棱的长度
    if (node.position().x >= 0) {
      d = x / Math.cos(Math.PI / 4)
    } else {
      d = -x / Math.cos(Math.PI / 4)
    }
    // 给每个点绑定是否占用
    crossOccupy[index] = false
    for (let i = 0; i < crossOccupy.length; i++) {
      if (crossOccupy[i] == true) {
        crossSumOccupy = true
        break // forEach无法使用break
      } else crossSumOccupy = false
    }
    if (d < 15) {
      crossOccupy[index] = true
      groupIcon.zIndex(0)
      for (let i = 0; i < crossOccupy.length; i++) {
        if (crossOccupy[i] == true) {
          crossSumOccupy = true
          break
        } else crossSumOccupy = false
      }
    } else if (groupIcon.zIndex() == 0 && crossSumOccupy == false) {
      groupIcon.zIndex(1)
    }
    if (d <= 0 || d > 70) return
    // 旋转并不会影响位置的变化。因为旋转只是在原有位置的情况下改变角度，类似先定位再旋转
    if (index == 0 || index == 2) {
      node.position({ x: x, y: x })
      pointList1.splice(index, 2, x, x)
      line1.points(pointList1)
    } else {
      node.position({ x: x, y: -x })
      pointList2.splice(index - 1, 2, x, -x)
      line2.points(pointList2)
    }
  }
  function moveEnd() {
    e.removeEventListener('mousemove', moveStart)
    e.removeEventListener('mouseup', moveEnd)
  }
}
//#endregion

//#region 其他技能
const othersCircleCfg = ref({
  radius: 16,
  fill: 'rgba(0,0,0,0.8)',
  stroke: 'rgba(255,255,255,0.8)',
  strokeWidth: 1,
})
const othersImgCfg = ref({
  width: 32,
  height: 32,
  offset: { x: 16, y: 16 },
  image: skillImg,
  scale: { x: 0.8, y: 0.8 },
})
//#endregion

//#region 双直线技能
const doubleLine1 = ref({
  width: 150,
  height: 3,
  y: 10,
  offsetY: 1.5,
  stroke: '#83ffe3',
  strokeWidth: 5,
  name: 'skillDoubleRect1',
})
const doubleLine2 = ref({
  width: 150,
  height: 3,
  y: -10,
  offsetY: 1.5,
  stroke: '#83ffe3',
  strokeWidth: 5,
  name: 'skillDoubleRect2',
})
const doubleLineControlCfg = ref({
  ...controlConfig,
  x: 150,
  name: 'skillDoubleLineControl',
})
const dragDoubleLine = (el) => {
  const e = el.evt.currentTarget
  e.addEventListener('mousemove', moveStart)
  e.addEventListener('mouseup', moveEnd)
  function moveStart(e) {
    // BUG 拖动过快会导致阻止失败从而触发父组件的拖动
    e.stopPropagation()
    const stage = stageRef.value.getNode()
    // 父group定位后，其子元素的相对定位会义父组件的定位位置当做原点0
    const parentGroup = stage.findOne('.groupDoubleLine')
    const group = stage.findOne('.doubleLineGroup')
    const rect1 = stage.findOne('.skillDoubleRect1')
    const rect2 = stage.findOne('.skillDoubleRect2')
    const control = stage.findOne('.skillDoubleLineControl')
    const position = parentGroup.getRelativePointerPosition()
    const d = Math.sqrt(position.x ** 2 + position.y ** 2)
    let length = d
    const a = position.x
    let cos = a / d
    if (d > 300) {
      const scale = 300 / d
      position.x = position.x * scale
      position.y = position.y * scale
      length = 300
    } else if (d < 30) {
      const scale = 30 / d
      position.x = position.x * scale
      position.y = position.y * scale
      length = 30
    }
    let angle = (Math.acos(cos) / Math.PI) * 180
    if (position.y < 0) {
      angle = -angle
    }
    // NOTE 尽量避免操作config属性，会导致再加载时配置文件数据不对，操作Node对象
    rect1.width(length)
    rect2.width(length)
    group.rotation(angle)
    control.position(position)
    // TODO 把控制点存在一张外联表里
  }
  function moveEnd() {
    e.removeEventListener('mousemove', moveStart)
    e.removeEventListener('mouseup', moveEnd)
  }
}

//#endregion

//#endregion

//#region 设置栏
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
//#endregion

//#region 地图描点展示
const lineupDialogVisible = ref(false)
const dialogContent = ref(null)
const isLineUpPreview = ref(false)
const lineUpPreviewIndex = ref(0)
const currentTooltip = ref()
let uuid = null
const showLineUpPreview = (index) => {
  lineUpPreviewIndex.value = index
  isLineUpPreview.value = true
}
const commentInput = ref()
const isCollect = ref(false),
  isLike = ref(false)
const activeName = ref()
const extraName = ref(),
  extraVisible = ref(false)
const showContent = async (e) => {
  const groupNode = e.currentTarget
  uuid = groupNode.id()
  const result = await getSkillContentService(uuid)
  if (result.code == 0) {
    lineupDialogVisible.value = true
    const content = result.data
    dialogContent.value = {
      description: content.description,
      extra: content.extra,
      like: content.like,
      collect: content.collect,
      pictureList: content.picture,
      previewList: [],
      posture: content.posture,
      side: content.side,
      skillName: content.skillName,
      title: content.title,
      tolerance: content.tolerance,
      video: content.video,
      updateTime: content.updateTime,
    }
    content.picture.forEach((e) => {
      dialogContent.value.previewList.push(e.url)
    })
    console.log(dialogContent.value.previewList)
    isAlreadyCollect()
  } else {
    console.log(result.msg)
    ElMessage.error('获取技能内容失败')
  }
  extraVisible.value = false
  extraName.value = null
  if (['雷击箭', '寻敌箭'].indexOf(skillDetail.value.skillName) != -1) {
    extraName.value = '蓄力反弹'
    extraVisible.value = true
  }
}
const isAlreadyCollect = async () => {
  if (tokenStokre.token) {
    const result = await ifCollectService(tokenStokre.token, uuid)
    if (result.code == 0) {
      isCollect.value = result.data
    } else {
      console.log('收藏验证失败')
    }
  } else {
    isCollect.value = false
  }
}
const collectClick = async () => {
  const { loginDetection } = await import('@/styles/js/public')
  const isLogin = loginDetection()
  if (!isLogin) return
  let result = null
  if (isCollect.value) {
    result = await deleteCollectService(tokenStokre.token, uuid)
    if (result.code == 0) {
      ElMessage.success('已取消收藏')
      isCollect.value = !isCollect.value
      dialogContent.value.collect -= 1
    } else {
      console.log(result.msg)
      ElMessage.error('取消收藏失败')
    }
  } else {
    result = await addCollectService(tokenStokre.token, uuid)
    if (result.code == 0) {
      ElMessage.success('已收藏')
      isCollect.value = !isCollect.value
      dialogContent.value.collect += 1
    } else {
      console.log(result.msg)
      ElMessage.error('收藏失败')
    }
  }
}
const likeClick = async () => {
  const { loginDetection } = await import('@/styles/js/public')
  const isLogin = loginDetection()
  if (!isLogin) return
  isLike.value = !isLike.value
}
// 视频
let player = null
const videoPlayerRef = ref()
const percentageVisible = ref(false)
const initPlayer = () => {
  console.log(dialogContent.value.video)
  if (dialogContent.value.video != null) {
    player = new Player({
      el: videoPlayerRef.value,
      url: dialogContent.value.video,
      marginControls: false,
      autoplay: false,
      fluid: true,
    })
    vedioPause()
  }
}
const vedioPause = () => {
  let shouldPaused = false
  player.on(Events.SEEKED, () => {
    if (player.paused) {
      player.pause()
      shouldPaused = true
    }
  })
  player.on(Events.PLAY, () => {
    if (shouldPaused) {
      player.pause()
      shouldPaused = false
    }
  })
}
const destroyPlayer = () => {
  if (player) {
    // BUG 暂停后声音继续播放
    player.pause()
    player.destroy(true)
    player = null
    vedioUploadPreview.value = false
    fileVedio.value = []
    percentageVisible.value = false
  }
}
const fileVedio = ref([])
const vedioUploadPreview = ref(false)
const startTime = ref(0)
const endTime = ref(0)
const vedioPreview = (file) => {
  const url = URL.createObjectURL(file.raw)
  vedioUploadPreview.value = true
  player = new Player({
    el: videoPlayerRef.value,
    url: url,
    autoplay: false,
    marginControls: true,
  })
  setTimeout(() => {
    endTime.value = player.duration.toFixed(2)
  }, 50)
  vedioPause()
}
const vedioPreviewRemove = () => {
  vedioUploadPreview.value = false
}
const vedioExceed = () => {
  ElMessage.error('只能上传一个视频')
}
const getStartTime = () => {
  startTime.value = player.currentTime.toFixed(2)
}
const getEndTime = () => {
  endTime.value = player.currentTime.toFixed(2)
}
const vedioLimit = (file) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  const whiteList = ['mp4']
  if (whiteList.indexOf(fileSuffix) == -1) {
    ElMessage.error('视频仅支持MP4格式')
    return false
  } else if (file.size / 1024 / 1024 > 100) {
    ElMessage.error('上传视频大小不能超过100MB')
    return false
  }
}
const submitVideo = async () => {
  if (fileVedio.value.length != 0) {
    const vedioRaw = fileVedio.value[0].raw
    vedioLimit(vedioRaw)
    ElMessage.info('视频转码中')
    console.log(vedioRaw)
    percentageVisible.value = true
    let file = await compressVideo(vedioRaw, startTime.value, endTime.value)
    ElMessage.info('转码完成')
    const result = await updateSkillContentVideoService(uuid, file)
    if (result.code == 0) {
      ElMessage.success('上传成功')
      lineupDialogVisible.value = false
    } else {
      console.log(result.msg)
      ElMessage.error('上传失败')
    }
    console.log(file)
  } else {
    ElMessage.warning('请先上传视频')
  }
}
//#endregion

//#region 收藏
const ifSwitchCollect = ref(false)
const showCollect = async () => {
  const { loginDetection } = await import('@/styles/js/public')
  const isLogin = loginDetection()
  if (!isLogin) return
  ifSwitchCollect.value = !ifSwitchCollect.value
  if (ifSwitchCollect.value) {
    getSkillCollectLocation()
  } else {
    getSkillLocation()
  }
}
//#endregion

//#region 地图和技能选择
// 地图选择
// NOTE 直接在src中写可以使用上下级相对路径，但传入属性时只能从src传入
const selectWrapperImg = computed(() => `url(map/cover/${mapValue.value}.png)`)
let [map1] = useImage(computed(() => `map/detail/${mapValue.value}.png`))
watch(map1, (newValue) => {
  mapImageConfig.value.image = newValue
})
// 技能选择边框样式
const ifSkillIconDetail = ref([false, false, true, false])
const skillIcon = 'skill-icon'
const skillIconClick = 'skill-icon-click'
// 技能选择
let lastIndex = -1,
  lastAgent = ''
const skillLocationList = ref([])
const skillCounts = ref(0)
const skillClick = async (index) => {
  // 防止重复选中
  if (index == lastIndex && agentValue.value == lastAgent) return
  lastIndex = index
  lastAgent = agentValue.value
  // 通过特工名字和技能代号确定技能类型。skillIndex从1开始标注技能顺序
  skillType.value = skillData.find((skill) => skill.agentId == agentValue.value && skill.skillIndex == index).skillType
  // line过点清空
  if (['curve', 'polygon', 'control', 'controlStraight'].includes(skillType.value)) {
    controlAnchorList.value.splice(0, controlAnchorList.value.length)
    pointList.splice(0, pointList.length)
    console.log(controlAnchorList.value)
    if (skillType.value == 'control' || skillType.value == 'controlStraight') {
      // 控制类技能先把默认技能图标的位置加入到line的渲染坐标和控制点列表中中。
      pointList.push(200, 200)
      controlAnchorList.value.push({
        x: 200,
        y: 200,
        fill: '#fff',
        stroke: '#000',
        strokeWidth: 2,
        radius: 6,
        name: crypto.randomUUID(),
        draggable: true,
      })
    }
    switch (skillType.value) {
      case 'curve':
        lineType = '.skillCurve'
        break
      case 'polygon':
        lineType = '.skillPolygon'
        break
      case 'control':
        lineType = '.skillControl'
        break
      case 'controlStraight':
        lineType = '.skillControlStraight'
        break
      default:
        lineType = ''
        break
    }
  }
  // 更换载入图片
  changeImg(index)
  skillIndex.value = index
  console.log('type:' + skillType.value, 'map:' + mapValue.value, 'agent:' + agentValue.value, 'index:' + index)
  // 获取位置信息
  getSkillLocation()
  ifSwitchCollect.value = false
  // TODO 考虑在前端缓存还是后端
  skillLocationList.value = null
  // 选中提示
  ifSkillIconDetail.value.forEach((item, index, array) => {
    array[index] = false
  })
  ifSkillIconDetail.value[index - 1] = true
  console.log(ifSkillIconDetail.value)
}
// 阵营选择
const sideSelect = ref('所有')
const sideSelectChange = () => {
  switch (sideSelect.value) {
    case '所有':
      sideRotate(0, stageRef.value)
      break
    case '进攻方':
      sideRotate(0, stageRef.value)
      break
    case '防守方':
      sideRotate(180, stageRef.value)
      break
  }
  if (ifSwitchCollect.value) {
    getSkillCollectLocation()
  } else {
    getSkillLocation()
  }
}
// 拉取技能位置信息
const getSkillLocation = async () => {
  let result = null,
    counts = null
  switch (skillType.value) {
    case 'throw':
      result = await getThrowSkillService(mapValue.value, agentValue.value, lastIndex, sideSelect.value)
      counts = await getThrowSkillCountsService(mapValue.value, agentValue.value, lastIndex)
      break
    case 'throwGround':
      result = await getThrowGroundSkillService(mapValue.value, agentValue.value, lastIndex, sideSelect.value)
      counts = await getThrowGroundSkillCountsService(mapValue.value, agentValue.value, lastIndex)
      break
    case 'line':
      result = await getLineSkillService(mapValue.value, agentValue.value, lastIndex, sideSelect.value)
      counts = await getLineSkillCountsService(mapValue.value, agentValue.value, lastIndex)
      break
    case 'control':
      result = await getControlSkillService(mapValue.value, agentValue.value, lastIndex, sideSelect.value)
      counts = await getControlSkillCountsService(mapValue.value, agentValue.value, lastIndex)
      break
    default:
      break
  }
  if (result.code == 0 && counts.code == 0) {
    skillLocationList.value = result.data
    skillCounts.value = counts.data
  } else {
    ElMessage.error('获取技能位置信息失败')
    console.log(result.msg, counts.code)
  }
}
const getSkillCollectLocation = async () => {
  let result = null
  switch (skillType.value) {
    case 'throw':
      result = await getThrowSkillCollectService(mapValue.value, agentValue.value, lastIndex, sideSelect.value)
      break
    case 'throwGround':
      result = await getThrowGroundSkillCollectService(mapValue.value, agentValue.value, lastIndex, sideSelect.value)
      break
    case 'line':
      result = await getLineSkillCollectService(mapValue.value, agentValue.value, lastIndex, sideSelect.value)
      break
    case 'control':
      result = await getControlSkillCollectService(mapValue.value, agentValue.value, lastIndex, sideSelect.value)
      break
    default:
      break
  }
  if (result.code == 0) {
    skillLocationList.value = result.data
  } else {
    ElMessage.error('获取收藏技能位置信息失败')
    console.log(result.msg)
  }
}
// 开局默认执行一次，传入用户选定的英雄技能，否则line无法重置
skillClick(skillIndex.value)
// const agentSelect = (label) => {
//   agentLabel.value = label
//   skillClick(skillIndex.value)
// }
//#endregion
</script>

<template>
  <div class="container" ref="containerRef">
    <!-- 选择 -->
    <div class="select-aside">
      <!-- 地图选择 -->
      <el-select class="map-select-main" v-model="mapValue" :show-arrow="false" :offset="7" popper-class="map-select-dropdown" id="selectId">
        <el-option v-for="map in mapInfo" :key="map.id" :label="map.mapName" :value="map.id">
          <div style="position: relative">
            <img :src="`map/cover/${map.id}.png`" style="width: 257px; height: auto; object-fit: cover" />
            <span class="large-text" style="position: absolute; left: 20px">{{ map.mapName }}</span>
          </div>
        </el-option>
      </el-select>
      <br />
      <!-- 英雄选择 -->
      <div>
        <p class="label-text">选择英雄</p>
        <el-select class="agent-select" v-model="agentValue" :show-arrow="false" :offset="7" popper-class="agent-select-dropdown">
          <el-option
            v-for="agent in agentInfo"
            :key="agent.id"
            :label="agent.agentName"
            :value="agent.id"
            @click="skillClick(skillIndex)"
          ></el-option>
        </el-select>
      </div>
      <br />
      <div class="row">
        <img class="agent-icon" :src="selectStore.currentAgent" />
        <span class="agent-name"
          ><strong>{{ agentDetail.agentName }}</strong></span
        >
      </div>
      <br />
      <!-- 技能选择 -->
      <div class="row-space">
        <div class="skills">
          <img :class="ifSkillIconDetail[0] ? skillIconClick : skillIcon" :src="selectStore.skillSelectIconList[0]" @click="skillClick(1)" />
          <el-tag class="skill-icon-num" v-if="ifSkillIconDetail[0]" size="small" effect="dark" type="success" round>{{ skillCounts }}</el-tag>
          <el-icon class="skill-icon-check" v-if="ifSkillIconDetail[0]" color="green" size="15"><Check /></el-icon>
        </div>
        <div class="skills">
          <img :class="ifSkillIconDetail[1] ? skillIconClick : skillIcon" :src="selectStore.skillSelectIconList[1]" @click="skillClick(2)" />
          <el-tag class="skill-icon-num" v-if="ifSkillIconDetail[1]" size="small" effect="dark" type="success" round>{{ skillCounts }}</el-tag>
          <el-icon class="skill-icon-check" v-if="ifSkillIconDetail[1]" color="green" size="15"><Check /></el-icon>
        </div>
        <div class="skills">
          <img :class="ifSkillIconDetail[2] ? skillIconClick : skillIcon" :src="selectStore.skillSelectIconList[2]" @click="skillClick(3)" />
          <el-tag class="skill-icon-num" v-if="ifSkillIconDetail[2]" size="small" effect="dark" type="success" round>{{ skillCounts }}</el-tag>
          <el-icon class="skill-icon-check" v-if="ifSkillIconDetail[2]" color="green" size="15"><Check /></el-icon>
        </div>
        <div class="skills">
          <img :class="ifSkillIconDetail[3] ? skillIconClick : skillIcon" :src="selectStore.skillSelectIconList[3]" @click="skillClick(4)" />
          <el-tag class="skill-icon-num" v-if="ifSkillIconDetail[3]" size="small" effect="dark" type="success" round>{{ skillCounts }}</el-tag>
          <el-icon class="skill-icon-check" v-if="ifSkillIconDetail[3]" color="green" size="15"><Check /></el-icon>
        </div>
      </div>
      <!-- 阵营选择 -->
      <div>
        <p class="label-text">选择阵营</p>
        <el-radio-group class="camp-select" v-model="sideSelect" size="large" fill="#96ef7b" @change="sideSelectChange">
          <el-radio-button class="all" label="所有" value="所有"> </el-radio-button>
          <el-radio-button class="t" label="进攻方" value="进攻方"></el-radio-button>
          <el-radio-button class="ct" label="防守方" value="防守方"></el-radio-button>
        </el-radio-group>
      </div>
      <br /><br />
      <!-- 收藏点位 -->
      <el-button class="show-collect" :color="ifSwitchCollect ? '#96ef7b' : '#363636'" @click="showCollect">
        <template #default>
          收藏点位<el-icon class="el-icon--right"><Star /></el-icon>
        </template>
      </el-button>
      <!-- 备案 -->
      <el-link class="icp" href="https://beian.miit.gov.cn/" type="info" style="font-size: 14px" underline="never">鲁ICP备2026037394号-1</el-link>
    </div>
    <!-- 地图 -->
    <div class="map-container" ref="mapContainerRef" @contextmenu.prevent>
      <v-stage ref="stageRef" :config="stageConfig" @wheel="handleWheel($event, stageRef)">
        <v-layer>
          <v-group :config="mapContainerGroupCfg">
            <v-group :config="mapImgGroupCfg">
              <!-- 背景地图 -->
              <v-image :config="mapImageConfig" />
              <v-text :config="text" v-for="text in textArray" :key="text.name" v-if="pointNameVisible == true" />
              <v-image :config="skillBall" v-for="skillBall in skillBallArray" :key="skillBall.name" v-if="skillBallVisible == true" />
              <v-rect :config="barrier" v-for="barrier in attackBarrierArray" :key="barrier.name" v-if="lightCurtainVisible == true" />
              <v-rect :config="barrier" v-for="barrier in defendBarrierArray" :key="barrier.name" v-if="lightCurtainVisible == true" />
            </v-group>
            <div v-if="hover">
              <v-group :config="skillGroupConfig">
                <!-- throw型 -->
                <v-group
                  :config="{ name: 'groupThrow', id: skill.uuid }"
                  v-for="skill in skillLocationList"
                  :key="skill.uuid"
                  @mouseenter="hover.throwHover"
                  @mouseleave="hover.throwUnHover"
                  @mousedown="showContent"
                  v-if="skillType == 'throw'"
                >
                  <!-- 连线 -->
                  <v-line
                    :config="{
                      stroke: 'rgb(27, 144, 255,0.9)',
                      strokeWidth: 3,
                      lineCap: 'round',
                      id: 'line',
                      name: 'skillThrowLine',
                      points: [skill.agentIconX, skill.agentIconY, skill.skillIconX, skill.skillIconY],
                      visible: false,
                    }"
                    v-show="false"
                  />
                  <!-- 技能 -->
                  <v-group :config="{ x: skill.skillIconX, y: skill.skillIconY, name: 'groupThrowIcon' }">
                    <!-- 技能范围 -->
                    <v-circle
                      :config="{
                        radius: 17,
                        fill: 'rgb(0,0,0,0.7)',
                        stroke: 'rgb(27, 144, 255,0.8)',
                        strokeWidth: 3,
                        id: 'stroke',
                        name: 'skillThrowRange',
                      }"
                    />
                    <!-- 技能图标 -->
                    <v-image :config="{ offsetX: 14.5, offsetY: 14.5, width: 29, height: 29, cornerRadius: 14.5, image: skillImg, id: 'r-img' }" />
                  </v-group>
                  <!-- 特工图标 -->
                  <v-image
                    :config="{
                      x: skill.agentIconX,
                      y: skill.agentIconY,
                      width: 36,
                      height: 36,
                      offsetX: 18,
                      offsetY: 18,
                      cornerRadius: 5,
                      fill: 'rgb(27, 144, 255,0.9)',
                      image: agentImg,
                      id: 'background',
                      name: 'skillThrowAgentIcon',
                      visible: false,
                    }"
                    v-show="false"
                  />
                </v-group>
                <!-- throwGround型 -->
                <v-group
                  :config="{ name: 'groupThrowGround', id: skill.uuid }"
                  v-for="skill in skillLocationList"
                  :key="skill.uuid"
                  @mouseenter="hover.throwGroundHover"
                  @mouseleave="hover.throwGroundUnHover"
                  @mousedown="showContent"
                  v-if="skillType == 'throwGround'"
                >
                  <v-line
                    :config="{
                      points: [skill.agentIconX, skill.agentIconY, skill.skillIconX, skill.skillIconY],
                      stroke: 'rgba(27, 144, 255,0.9)',
                      strokeWidth: 3,
                      name: 'throwGroundLine',
                    }"
                  />
                  <v-group :config="{ name: 'groupThrowGroudIcon', x: skill.skillIconX, y: skill.skillIconY }">
                    <v-circle
                      :config="{
                        radius: skillDetail.r * 7,
                        // fill: 'rgba(27, 144, 255,0.2)',
                        fill: 'rgba(0,0,0,0.2)',
                        stroke: 'rgba(27, 144, 255,0.9)',
                        strokeWidth: 3,
                        name: 'throwGroundIcon',
                      }"
                      v-if="skillIconVisible"
                    />
                    <v-image
                      :config="{
                        width: skillDetail.r * 7 * 2,
                        height: skillDetail.r * 7 * 2,
                        offset: { x: skillDetail.r * 7, y: skillDetail.r * 7 },
                        cornerRadius: skillDetail.r * 7,
                        scale: { x: 0.6, y: 0.6 },
                        id: 'r-img',
                        image: skillImg,
                      }"
                      v-if="skillIconVisible"
                    />
                    <v-image
                      :config="{
                        width: skillDetail.r * 7 * 2,
                        height: skillDetail.r * 7 * 2,
                        offset: { x: skillDetail.r * 7, y: skillDetail.r * 7 },
                        cornerRadius: skillDetail.r * 7,
                        opacity: 0.8,
                        id: 'r-img',
                        name: 'throwGroundIcon',
                        image: skillDetailImg,
                      }"
                      v-if="!skillIconVisible"
                    />
                  </v-group>
                  <v-image
                    :config="{
                      x: skill.agentIconX,
                      y: skill.agentIconY,
                      width: 36,
                      height: 36,
                      offset: { x: 18, y: 18 },
                      fill: 'rgba(27, 144, 255,0.9)',
                      cornerRadius: 5,
                      image: agentImg,
                      id: 'r-img',
                      name: 'throwGroundAgent',
                    }"
                  />
                </v-group>
                <!-- curve型 -->
                <v-group :config="{ name: 'groupCurve' }" v-if="skillType == 'curve'">
                  <v-line :config="curveConfig" />
                  <v-circle
                    v-if="controlAnchorVisible"
                    v-for="circle in controlAnchorList"
                    :config="circle"
                    @dragmove="controlAnchorDrag(circle.name)"
                    @contextmenu="rightMenu(circle.name, $event)"
                  />
                </v-group>
                <!-- polygon型 -->
                <v-group :config="{ name: 'groupPolygon', draggable: true }" v-if="skillType == 'polygon'">
                  <v-line :config="polygonConfig" />
                  <v-circle
                    v-if="controlAnchorVisible"
                    v-for="circle in controlAnchorList"
                    :config="circle"
                    @dragmove="controlAnchorDrag(circle.name)"
                    @contextmenu="rightMenu(circle.name, $event)"
                  />
                </v-group>
                <!-- line型 -->
                <v-group
                  v-for="skill in skillLocationList"
                  :config="{ name: 'groupLine', x: skill.groupX, y: skill.groupY, rotation: skill.angle, id: skill.uuid }"
                  @mouseenter="hover.lineHover"
                  @mouseleave="hover.lineUnHover"
                  @mousedown="showContent"
                  v-if="skillType == 'line'"
                >
                  <v-rect
                    :config="{
                      width: skillDetail.width * 7,
                      height: skillDetail.height * 7,
                      fill: `rgba(${agentDetail.color},0.7)`,
                      offsetY: (skillDetail.height * 7) / 2,
                      id: 'rect',
                    }"
                  />
                  <v-group :config="{ name: 'groupLineIcon' }">
                    <v-circle :config="placeIconCircleCfg" />
                    <v-image
                      :config="{
                        width: 30,
                        height: 30,
                        offset: { x: 15, y: 15 },
                        cornerRadius: 15,
                        scale: { x: 0.8, y: 0.8 },
                        rotation: 90,
                        image: skillImg,
                      }"
                    />
                  </v-group>
                </v-group>
                <!-- control型 -->
                <v-group
                  v-for="skill in skillLocationList"
                  :config="{ name: 'groupControl', id: skill.uuid }"
                  @mouseenter="hover.controlHover"
                  @mouseleave="hover.controlUnHover"
                  @mousedown="showContent"
                  v-if="skillType == 'control'"
                >
                  <el-button type="success" @click="controlAnimaBuild">创建</el-button>
                  <el-button type="danger" @click="controlAnimaStart">启动</el-button>
                  <el-button type="info" @click="controlAnimaEnd">停止</el-button>
                  <v-line
                    :config="{ stroke: '#6c7dff', strokeWidth: 3, lineCap: 'round', tension: 0.4, name: 'skillControl', points: skill.pointList }"
                  />
                  <v-group :config="{ x: skill.skillIconX, y: skill.skillIconY, name: 'groupControlIcon' }" @dragmove="controlSkillIconDrag">
                    <v-circle :config="{ radius: 15, fill: 'rgba(0,0,0,0.8)', stroke: '#23ffd0', strokeWidth: 2, name: 'skillControlStroke' }" />
                    <v-image
                      :config="{
                        image: skillImg,
                        width: 30,
                        height: 30,
                        offsetX: 15,
                        offsetY: 15,
                        scale: { x: 0.8, y: 0.8 },
                        name: 'skillControlImg',
                      }"
                    />
                  </v-group>
                </v-group>
                <!-- controlStraight型-->
                <v-group :config="{ name: 'groupControlStraight' }" v-if="skillType == 'controlStraight'">
                  <v-line :config="controlStraightLineConfig" />
                  <v-circle
                    v-for="circle in controlAnchorList"
                    :config="circle"
                    @dragmove="controlAnchorDrag(circle.name)"
                    @contextmenu="rightMenu(circle.name, $event)"
                  />
                  <v-group :config="groupControlIconConfig" @dragmove="controlSkillIconDrag">
                    <v-circle :config="controlStrokeConfig" />
                    <v-image :config="controlImgConfig" />
                  </v-group>
                </v-group>
                <!-- circle型 -->
                <v-group :config="{ name: 'groupCircle', x: 300, y: 400, draggable: true }" v-if="skillType == 'circle'">
                  <v-circle :config="circleStrokeConfig" v-if="!skillIconVisible" />
                  <v-circle :config="circleShadeConfig" v-if="!skillIconVisible" />
                  <v-image :config="circleImgConfig" v-if="skillIconVisible" />
                  <v-circle :config="circleCenterConfig" v-if="!skillIconVisible" />
                </v-group>
                <!-- place型 -->
                <!-- NOTE placeType从v-for中读取 -->
                <v-group :config="{ name: 'groupPlace', x: 500, y: 500, draggable: true }" v-if="skillType == 'place'">
                  <v-group :config="{ name: 'groupPlaceRect' }" v-if="placeType == 'rect'">
                    <v-rect :config="placeRectCfg" />
                    <v-group
                      :config="groupPlaceRectRotateControl"
                      @mousedown="ControlRotate($event, stageRef, '.groupPlace')"
                      @mouseenter="controlHover"
                      @mouseleave="controlLeave"
                    >
                      <v-circle :config="rotateControlCircle" />
                      <v-image :config="rotateControlImg" />
                    </v-group>
                  </v-group>
                  <v-group :config="{ name: 'groupPlaceCircle' }" v-if="placeType == 'circle'">
                    <v-circle :config="placeCircleCfg" />
                  </v-group>
                  <v-group :config="{ name: 'groupPlaceSector' }" v-if="placeType == 'sector'">
                    <v-wedge :config="placeSectorWedge" />
                    <v-path :config="placeSectorPath" />
                    <v-group
                      :config="groupPlaceSectorRotateControl"
                      @mousedown="ControlRotate($event, stageRef, '.groupPlace')"
                      @mouseenter="controlHover"
                      @mouseleave="controlLeave"
                    >
                      <v-circle :config="rotateControlCircle" />
                      <v-image :config="rotateControlImg" />
                    </v-group>
                  </v-group>
                  <v-group :config="{ name: 'groupPlaceStraight' }" v-if="placeType == 'straight'">
                    <v-line :config="placeStraightLine" />
                    <v-circle :config="placeStraightStartControl" @mousedown="placeStriaghtControlMove($event, 0)" />
                    <v-circle :config="placeStraightEndControl" @mousedown="placeStriaghtControlMove($event, 1)" />
                  </v-group>
                  <v-group :config="{ name: 'groupPlaceCross' }" v-if="placeType == 'cross'">
                    <v-line :config="placeCrossLine1" />
                    <v-line :config="placeCrossLine2" />
                    <v-circle
                      :config="placeCrossControl1"
                      @mousedown="placeControlAdjustLength($event, 0)"
                      @mouseenter="controlHover"
                      @mouseleave="controlLeave"
                    />
                    <v-circle
                      :config="placeCrossControl2"
                      @mousedown="placeControlAdjustLength($event, 1)"
                      @mouseenter="controlHover"
                      @mouseleave="controlLeave"
                    />
                    <v-circle
                      :config="placeCrossControl3"
                      @mousedown="placeControlAdjustLength($event, 2)"
                      @mouseenter="controlHover"
                      @mouseleave="controlLeave"
                    />
                    <v-circle
                      :config="placeCrossControl4"
                      @mousedown="placeControlAdjustLength($event, 3)"
                      @mouseenter="controlHover"
                      @mouseleave="controlLeave"
                    />
                    <v-group
                      :config="groupPlaceCrossControl"
                      @mousedown="ControlRotate($event, stageRef, '.groupPlace')"
                      @mouseenter="controlHover"
                      @mouseleave="controlLeave"
                    >
                      <v-circle :config="rotateControlCircle" />
                      <v-image :config="rotateControlImg" />
                    </v-group>
                  </v-group>
                  <v-group :config="{ name: 'groupPlaceIcon' }">
                    <v-circle :config="placeIconCircleCfg" />
                    <v-image :config="placeImgCfg" />
                  </v-group>
                </v-group>
                <!-- others型 -->
                <v-group :config="{ name: 'groupOthers', x: 500, y: 500, draggable: true }" v-if="skillType == 'others'">
                  <v-circle :config="othersCircleCfg" />
                  <v-image :config="othersImgCfg" />
                </v-group>
                <!-- doubleLine型 -->
                <v-group :config="{ name: 'groupDoubleLine', x: 500, y: 500, draggable: true }" v-if="skillType == 'doubleLine'">
                  <v-group :config="{ name: 'doubleLineGroup' }">
                    <v-rect :config="doubleLine1" />
                    <v-rect :config="doubleLine2" />
                    <v-group :config="{ name: 'groupPlaceIcon' }">
                      <v-circle :config="placeIconCircleCfg" />
                      <v-image :config="placeImgCfg" />
                    </v-group>
                  </v-group>
                  <v-circle :config="doubleLineControlCfg" @mousedown="dragDoubleLine" />
                </v-group>
              </v-group>
            </div>
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
                v-if="editInsertVisible"
                :style="{ width: '100%', backgroundColor: '#363636', border: 'none', margin: 0, padding: '10px', cursor: 'pointer' }"
                @mouseover="(e) => (e.target.style.backgroundColor = '#686767')"
                @mouseout="(e) => (e.target.style.backgroundColor = '#363636')"
                @click="insertControlAnchor"
              >
                插入
              </button>
              <button
                :style="{ width: '100%', backgroundColor: '#363636', border: 'none', margin: 0, padding: '10px', cursor: 'pointer' }"
                @mouseover="(e) => (e.target.style.backgroundColor = '#686767')"
                @mouseout="(e) => (e.target.style.backgroundColor = '#363636')"
                @click="deleteControlAnchor"
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
        </v-layer>
      </v-stage>
      <div class="map-adjust-button">
        <el-button class="map-reset" @click="resetMap(stageRef)" color="#363636" :icon="RefreshRight" type="info" />
        <br />
        <el-button-group direction="vertical">
          <el-button class="map-reset" @click="mapRotate(90, stageRef)" color="#363636" :icon="RotateRight" type="info" />
          <el-button class="map-reset" @click="mapRotate(-90, stageRef)" color="#363636" :icon="RotateLeft" type="info" />
        </el-button-group>
        <br />
        <el-button-group direction="vertical">
          <el-button class="map-reset" @click="mapZoomButton(1, stageRef)" color="#363636" :icon="Plus" type="info" />
          <el-button class="map-reset" @click="mapZoomButton(-1, stageRef)" color="#363636" :icon="Minus" type="info" />
        </el-button-group>
      </div>
    </div>
    <!-- 技能信息展示 -->
    <el-dialog
      class="lineup-dialog-show"
      v-model="lineupDialogVisible"
      width="90%"
      title="A厅探测箭"
      :show-close="false"
      @open="initPlayer"
      @close="destroyPlayer"
    >
      <template #header="{ close }">
        <div style="display: flex; justify-content: space-between">
          <div class="large-text">{{ dialogContent.title }}</div>
          <div style="display: flex; align-items: center; line-height: 20px">
            <div class="large-text">反馈</div>
            <el-icon size="20" style="color: #fff; margin-left: 20px" @click="close"><CloseBold /></el-icon>
          </div>
        </div>
      </template>
      <el-row>
        <el-col class="lineup-dialog-main" :span="18">
          <el-tabs v-model="activeName" default-value="image" type="border-card">
            <el-tab-pane label="图片" name="image" style="min-height: 500px">
              <el-tooltip
                :content="picture.tips"
                :visible="picture.tips != '' && currentTooltip == picture.url"
                placement="right"
                v-for="(picture, index) in dialogContent.pictureList"
                :key="index"
                effect="customized"
              >
                <el-image
                  :src="picture.url"
                  fit="cover"
                  @click="showLineUpPreview(index)"
                  @mouseenter="currentTooltip = picture.url"
                  @mouseleave="currentTooltip = ''"
                ></el-image>
              </el-tooltip>
              <el-image-viewer
                v-if="isLineUpPreview"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.7"
                :url-list="dialogContent.previewList"
                :initial-index="lineUpPreviewIndex"
                @close="isLineUpPreview = false"
            /></el-tab-pane>
            <el-tab-pane label="视频" name="video">
              <div v-if="dialogContent.video != null">
                <div ref="videoPlayerRef"></div>
              </div>
              <div v-else style="justify-items: center">
                <div class="large-text" style="margin-top: 20px" v-show="vedioUploadPreview != true">该道具还未上传演示视频！</div>
                <div>
                  <el-upload
                    ref="videoUploadRef"
                    v-model:file-list="fileVedio"
                    :auto-upload="false"
                    :limit="1"
                    :on-change="vedioPreview"
                    :on-remove="vedioPreviewRemove"
                    :on-exceed="vedioExceed"
                  >
                    <el-button type="danger" style="margin-top: 40px" :icon="UploadFilled" v-show="vedioUploadPreview != true">点击上传</el-button>
                  </el-upload>
                </div>
                <div v-show="vedioUploadPreview == true" style="height: 500px; display: flex; flex-direction: column; justify-content: space-between">
                  <div ref="videoPlayerRef"></div>
                  <div style="width: 200px">
                    <el-button @click="getStartTime" size="default">获取开始时间</el-button>
                    <span class="default-text" style="margin-left: 15px">{{ startTime }}</span>
                  </div>
                  <div style="width: 200px">
                    <el-button @click="getEndTime" size="default">获取结束时间</el-button>
                    <span class="default-text" style="margin-left: 15px">{{ endTime }}</span>
                  </div>
                  <div v-if="percentageVisible == true">
                    <el-progress :stroke-width="26" :text-inside="true" :percentage="progress" striped>
                      <span>视频转码中... {{ progress }}%</span>
                    </el-progress>
                  </div>
                  <div style="width: 170px">
                    <el-button @click="submitVideo" size="default" type="success">上传视频</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col class="lineup-dialog-aside" :span="6">
          <p class="label-text" style="margin-top: 0">道具描述</p>
          <div class="description">{{ dialogContent.description }}</div>
          <tbody style="width: 100%">
            <tr>
              <td>
                <span class="label">出手方式</span>
                <span class="describe">{{ dialogContent.posture }}</span>
              </td>
            </tr>
            <tr v-if="extraVisible">
              <td>
                <span class="label">{{ extraName }}</span>
                <span class="describe">{{ dialogContent.extra }} </span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="label">容错率</span>
                <span class="describe">{{ dialogContent.tolerance }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="label">阵营</span>
                <span class="describe">{{ dialogContent.side }}</span>
              </td>
            </tr>
          </tbody>
          <br />
          <!-- NOTE 图标与文字平齐，el-icon和iconify相同大小 -->
          <div class="flex-center">
            <div class="flex-center default-text" v-if="!isCollect" @click="collectClick">
              <el-icon size="24">
                <Star />
              </el-icon>
              &nbsp;&nbsp;
              <span>{{ dialogContent.collect }}</span>
            </div>
            <div class="flex-center" style="font-size: 16px; color: #f2688f" v-else @click="collectClick">
              <el-icon size="24">
                <StarFilled />
              </el-icon>
              &nbsp;&nbsp;
              <span>{{ dialogContent.collect }}</span>
            </div>
            <div class="flex-center default-text" v-if="!isLike" @click="likeClick">
              <Like style="width: 24px; height: 24px; font-size: 24px; margin-left: 30px" />
              &nbsp;&nbsp;
              <span>{{ dialogContent.like }}</span>
            </div>
            <div class="flex-center" style="font-size: 16px; color: #27c6ff" v-else @click="likeClick">
              <LikeFilled style="width: 24px; height: 24px; font-size: 24px; margin-left: 30px" />
              &nbsp;&nbsp;
              <span>{{ dialogContent.like }}</span>
            </div>
          </div>
          <br />
          <div>
            <p class="label-text" style="margin-top: 5px; margin-bottom: 5px">更新时间：{{ dialogContent.updateTime }}</p>
            <!-- TODO 确认是否需要来源 -->
            <!-- <p class="label-text" style="margin-top: 5px; margin-bottom: 5px">
              来源：https://www.bilibili.com/video/BV1vRwYzrE9slabel-textlabel-textlabel-textlabel-textlabel-textlabel-text
            </p> -->
          </div>
          <!-- <div class="comment-input">
            <img src="../../assets/avatar.jpg" style="width: 40px; border-radius: 50%" />
            <el-input v-model="commentInput" maxlength="40" show-word-limit word-limit-position="outside" type="textarea"></el-input>
          </div> -->
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 设置 -->
    <settingBar :stage="stageRef" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background: url('../../assets/bg.webp');
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}
.select-aside {
  height: 100%;
  min-width: 300px;
  padding: 10px 20px;
  box-sizing: border-box;
  border-right: 1px solid #363636;
  background-color: #1a1a1a;
  position: relative;

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

    .skill-icon-click {
      width: 50px;
      border-radius: 50%;
      border: 2px solid #96ef7b;
    }

    .skill-icon-click:hover {
      width: 50px;
      border-radius: 50%;
      border: 2px solid #96ef7b;
      background-color: #686767;
    }

    .skill-icon-num {
      width: 20px;
      background-color: #96ef7b;
      color: black;
      font-family: 'SimHei';
      position: absolute;
      top: 40px;
      left: 17px;
    }

    .skill-icon-check {
      color: black;
      position: absolute;
      left: 39px;
      top: 0px;
      background-color: #96ef7b;
      border-radius: 50%;
    }
  }

  .show-collect {
    width: 100%;
    height: 40px;
    font-size: 20px;
    // --el-button-bg-color: #363636;
    --el-button-border-color: rgba(0, 0, 0, 0);
  }

  .icp {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
  }
}
.map-container {
  width: 100%;
  min-width: 650px;
  overflow: hidden;
  position: relative;

  .lineup-type-check {
    position: absolute;
    z-index: 999;
    margin: 10px 20px;
  }

  .map {
    position: relative;
    margin: 0 auto;
    border: 1px solid #fff;
    width: 100%;
    height: 100%;
    overflow: hidden;
    user-select: none;
    box-sizing: border-box;

    .lineup {
      position: relative;
    }

    .dot {
      width: 30px;
      height: 30px;
      background: url('../../assets/agent/sova/sova_1.webp') no-repeat center / cover;
      border-radius: 50%;
      border: 2px solid #96ef7b;
      position: absolute;
      z-index: 999;
      // 以中心点定位
      transform: translate(-50%, -50%);
      left: 250px;
      top: 250px;
    }

    .dot-range {
      position: absolute;
      z-index: 999;
    }

    .dot-agent {
      width: 30px;
      height: 30px;
      background: url('../../assets/agent/sova/sova.webp') no-repeat center / cover;
      background-color: #96ef7b;
      border-radius: 5px;
      position: absolute;
      z-index: 999;
      left: 350px;
      top: 350px;
      transform: translate(-50%, -50%);
    }

    .imgTest {
      width: 100%;
      height: 100%;
      user-select: none;
      // position: absolute;
      // z-index: 998;
      // left: 0px;
      // top: 0px;
    }
  }

  .map-adjust-button {
    width: 35px;
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 999;
    right: 15px;
    bottom: 15px;

    .el-button {
      width: 35px;
      height: 35px;
      font-size: 18px;
    }
  }
}

.lineup-dialog-show {
  .progress .el-progress--line {
    margin-bottom: 15px;
    min-width: 100%;
  }

  .lineup-dialog-main {
    padding-right: 10px;
    border-right: 1px solid #363636;
    max-height: calc(90vh - 20px);
    overflow: scroll;
  }
  .lineup-dialog-main::-webkit-scrollbar {
    display: none;
  }
  .lineup-dialog-aside {
    padding-left: 10px;
    max-height: calc(90vh - 20px);
    overflow: scroll;

    .description {
      background-color: #363636;
      border-radius: 5px;
      color: #fff;
      font-size: 16px;
      padding: 10px 10px;
    }

    tr {
      height: 40px;
    }

    .label {
      color: #cacaca;
      font-size: 16px;
    }

    .describe {
      margin-left: 10px;
      color: #fff;
      font-size: 16px;
    }
  }
  .lineup-dialog-aside::-webkit-scrollbar {
    display: none;
  }
}
</style>

<style lang="scss">
/* 通过选择父组件的元素限定style的生效范围 */
.map-select-main {
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

.camp-select {
  // .el-radio-button__inner {
  //   color: #fff;
  //   background-color: #363636;
  //   // border-radius: 4px !important;
  // }

  // .all {
  //   .el-radio-button__inner:hover {
  //     color: #686767;
  //   }
  // }

  // .t {
  //   // margin: 0 4px;
  //   --el-radio-button-checked-text-color: #ff4655;
  //   .el-radio-button__inner:hover {
  //     color: #ff4655;
  //   }
  // }

  // .ct {
  //   --el-radio-button-checked-text-color: #66e5da;
  //   .el-radio-button__inner:hover {
  //     color: #66e5da;
  //   }
  // }

  .el-radio-button__inner {
    width: 86px;
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

.lineup-dialog-show {
  min-width: 1000px;
  margin: 0 auto !important;
  margin-top: 30px !important;
  max-height: 90vh;
  overflow: hidden;
  --el-dialog-bg-color: #1a1a1a !important;

  .comment-input {
    display: flex;
    align-items: start;

    .el-textarea {
      margin-left: 10px;
    }
    .el-textarea__inner {
      background-color: #363636;
      box-shadow: none;
    }
  }
}

.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  // background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
  background: linear-gradient(90deg, rgb(255, 165, 0), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  // background: linear-gradient(45deg, #b2e68d, #bce689);
  background: rgb(255, 165, 0);
  right: 0;
}
</style>
