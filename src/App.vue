<script setup>
import Layout from './views/Layout.vue'
import { getAgentInfo } from './api/agent.js'
import { getSkillDataService } from './api/skill-data.js'
import { getMapListService } from './api/map.js'
import { usePreloadInfoStore } from './store/preload-info.js'
import { useAgentSelectStore, useSettingBarStore } from './store/user.js'
import { storeToRefs } from 'pinia'
import { computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useImage } from 'vue-konva'
import { getService } from './api/map-editor.js'

// 禁止滚轮缩放
window.addEventListener(
  'mousewheel',
  function (event) {
    if (event.ctrlKey === true || event.metaKey) {
      event.preventDefault()
    }
  },
  { passive: false },
)
// 预加载数据
const preloadInfoStore = usePreloadInfoStore()
const selectStore = useAgentSelectStore()
const settingStore = useSettingBarStore()
const { attackBarrierArray, defendBarrierArray, textArray, skillBallArray } = storeToRefs(preloadInfoStore)
const { mapValue, agentValue, agentLabel, skillIndex } = storeToRefs(selectStore)
const { pointNameVisible, skillBallVisible, lightCurtainVisible } = storeToRefs(settingStore)

const preloadAgentInfo = async () => {
  const result = await getAgentInfo()
  if (result.code == 0) {
    preloadInfoStore.agentInfo = result.data
    let agentInfo = preloadInfoStore.agentInfo
    // NOTE computed检测ref返回ref，普通数据返回普通？
    preloadInfoStore.agentDetail = computed(() => agentInfo.find((e) => e.id == agentValue.value))
  } else {
    console.log(result.msg)
    ElMessage.error('数据加载异常')
  }
}
const preloadSkillData = async () => {
  const result = await getSkillDataService()
  if (result.code == 0) {
    preloadInfoStore.skillData = result.data
    let skillData = preloadInfoStore.skillData
    preloadInfoStore.skillDetail = computed(() => skillData.find((e) => e.agentId == agentValue.value && e.skillIndex == skillIndex.value))
  } else {
    console.log(result.msg)
    ElMessage.error('数据加载异常')
  }
}
const preloadMapInfo = async () => {
  const result = await getMapListService()
  if (result.code == 0) {
    preloadInfoStore.mapInfo = result.data
  } else {
    console.log(result.msg)
    ElMessage.error('数据加载异常')
  }
}
let [skillBallImg] = useImage('image/icon/skillBall.png')
// 监听加载地图地名数据
watch(
  [mapValue, pointNameVisible, skillBallVisible, lightCurtainVisible],
  async () => {
    // NOTE 不能连等，会导致对象相同
    // TODO 优化
    attackBarrierArray.value = []
    defendBarrierArray.value = []
    textArray.value = []
    skillBallArray.value = []
    if (pointNameVisible.value == true || skillBallVisible.value == true || lightCurtainVisible.value == true) {
      const result = await getService(selectStore.mapValue)
      if (result.code == 0) {
        const pointList = result.data.pointList
        const barrierList = result.data.barrierList
        const skillBallList = result.data.skillBallList
        pointList.forEach((e) => {
          textArray.value.push({
            ...e,
            fontSize: 18,
            fontStyle: 'bold',
            fill: '#fff',
            fontFamily: 'Microsoft JhengHei',
            id: 'point',
            name: e.uuid,
          })
        })
        barrierList.forEach((e) => {
          if (e.side == 1) {
            attackBarrierArray.value.push({
              ...e,
              width: 70,
              height: 13,
              fill: 'rgba(253,68,83,0.8)',
              id: 'attackBarrier',
              name: e.uuid,
            })
          } else {
            defendBarrierArray.value.push({
              ...e,
              width: 70,
              height: 13,
              fill: 'rgba(102,229,218,0.8)',
              id: 'defendBarrier',
              name: e.uuid,
            })
          }
        })
        skillBallList.forEach((e) => {
          skillBallArray.value.push({
            ...e,
            width: 18,
            height: 18,
            offset: { x: 9, y: 9 },
            cornerRadius: 9,
            image: skillBallImg,
            id: 'skillBall',
            name: e.uuid,
          })
        })
      } else {
        console.log(result.msg)
        ElMessage.error('获取地图编辑信息失败')
      }
    }
  },
  {
    immediate: true,
  },
)
watch(
  agentValue,
  () => {
    selectStore.currentAgent = `agent/${agentValue.value}/${agentValue.value}.webp`
    console.log(preloadInfoStore.agentDetail)
    // skillSelectIconList.value = [
    //   `agent/${agentValue.value}/${agentValue.value}_1.webp`,
    //   `agent/${agentValue.value}/${agentValue.value}_2.webp`,
    //   `agent/${agentValue.value}/${agentValue.value}_3.webp`,
    //   `agent/${agentValue.value}/${agentValue.value}_4.webp`,
    // ]
    // selectStore.skillImg = useImage(`agent/${agentValue.value}/${agentValue.value}_3.webp`)[0]
    // selectStore.agentImg = useImage(`agent/${agentValue.value}/${agentValue.value}.webp`)[0]
  },
  {
    immediate: true,
  },
)
// 使用router钩子在渲染页面之前加载好数据，生命周期钩子await不生效
const router = useRouter()
let isFirstVisit = true
router.beforeEach(async (to, from, next) => {
  if (isFirstVisit) {
    await preloadAgentInfo()
    await preloadSkillData()
    await preloadMapInfo()
    isFirstVisit = false
    console.log('数据预加载')
  }
  next()
})
// 将喜爱特工同步到当前选中特工
onMounted(() => {
  selectStore.agentValue = settingStore.favoriteAgent
})
</script>

<template>
  <Layout />
</template>

<style>
body {
  margin: 0px;
}
</style>
