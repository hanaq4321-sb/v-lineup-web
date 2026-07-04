import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 特工信息
export const usePreloadInfoStore = defineStore(
  'agentInfo',
  () => {
    // NOTE const数组可以增删改、不能直接赋值
    // 特工信息和技能数据
    let agentInfo = []
    let skillData = []
    let mapInfo = []
    // 当前特工信息和技能数据
    const agentDetail = ref(null)
    const skillDetail = ref(null)
    // 地图名称信息
    const attackBarrierArray = ref([])
    const defendBarrierArray = ref([])
    const textArray = ref([])
    const skillBallArray = ref([])
    return { agentInfo, skillData, mapInfo, agentDetail, skillDetail, attackBarrierArray, defendBarrierArray, textArray, skillBallArray }
  },
  {
    persist: true,
  },
)
