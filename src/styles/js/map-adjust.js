import { ref } from 'vue'
import { useSettingBarStore } from '@/store/user'

export const mapDraggable = ref(true)
export const controlMapDraggable = (stageRef) => {
  const setStore = useSettingBarStore()
  const stage = stageRef.getNode()
  stage.draggable(setStore.mapDraggable)
}

// 滚轮缩放
export const handleWheel = (e, stageRef) => {
  // 代表没有阻止任何事件
  // e.evt.preventDefault()
  const stage = stageRef.getNode()
  // 以x为基准，保证比例不变
  const oldScale = stage.scaleX()
  const pointer = stage.getPointerPosition()

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  }

  // 如何缩放？放大？还是缩小？
  let direction = e.evt.deltaY > 0 ? -1 : 1

  // 在触控板上缩放时，e.evt.ctrlKey 为 true
  if (e.evt.ctrlKey) {
    direction = direction
  }

  const scaleBy = 1.1
  const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy
  if (newScale > 3 && direction > 0) return
  else if (newScale < 0.5 && direction < 0) return

  stage.scale({ x: newScale, y: newScale })

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  }
  stage.position(newPos)
}
// 地图调整按钮组
export const mapZoomButton = (s, stageRef) => {
  const stage = stageRef.getNode()
  const oldScale = stage.scaleX()
  const scaleBy = 1.1
  const newScale = s > 0 ? oldScale * scaleBy : oldScale / scaleBy
  if (newScale > 3 && s > 0) return
  else if (newScale < 0.5 && s < 0) return
  const newPos = {
    // FIXME 优化
    x: stage.position().x - (stage.width() * (newScale - oldScale)) / 2,
    y: stage.position().y - (stage.height() * (newScale - oldScale)) / 2,
  }
  console.log(stage.position())
  stage.scale({ x: newScale, y: newScale })
  stage.position(newPos)
}
let degree = 0
export const mapRotate = (d, stageRef) => {
  degree += d
  const stage = stageRef.getNode()
  const mapContainerGroup = stage.findOne('.mapContainerGroup')
  mapContainerGroup.to({ rotation: degree })
  const skillGroup = stage.findOne('.mapGroup')
  // const skillIcon = skillGroup.find('Image')
  const skillIcon = skillGroup.find('#r-img')
  skillIcon.forEach((icon) => {
    icon.to({ rotation: -degree })
  })
  const mapPoint = stage.find('#point')
  if (mapPoint != []) {
    mapPoint.forEach((icon) => {
      icon.to({ rotation: -degree })
    })
  }
}
export const resetMap = (stageRef) => {
  // NOTE stage的scale是为了实现滚轮缩放，stage适应屏幕通过修改config实现，group的scale是为了适应不同屏幕。在此要分别重置stage的偏移和group的drag
  const stage = stageRef.getNode()
  // 拖动和缩放通过stage的draggable、scale实现
  stage.position({ x: 0, y: 0 })
  stage.scale({ x: 1, y: 1 })
  const mapContainerGroup = stage.findOne('.mapContainerGroup') // 直接大写按类型、.按name、#按id。name和id为config中的
  degree = 0
  mapContainerGroup.rotation(degree)
  const skillGroup = stage.findOne('.mapGroup')
  const skillIcon = skillGroup.find('#r-img')
  skillIcon.forEach((icon) => {
    icon.rotation(degree)
  })
  const mapPoint = stage.find('#point')
  if (mapPoint != []) {
    mapPoint.forEach((icon) => {
      icon.rotation(degree)
    })
  }
}
export const sideRotate = (d, stageRef) => {
  degree = d
  const stage = stageRef.getNode()
  const mapContainerGroup = stage.findOne('.mapContainerGroup')
  mapContainerGroup.rotation(degree)
  const skillGroup = stage.findOne('.mapGroup')
  const skillIcon = skillGroup.find('#r-img')
  skillIcon.forEach((icon) => {
    icon.rotation(-degree)
  })
  const mapPoint = stage.find('#point')
  if (mapPoint != []) {
    mapPoint.forEach((icon) => {
      icon.rotation(-degree)
    })
  }
}
