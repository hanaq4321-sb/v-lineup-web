import { defineStore } from 'pinia'
import { computed } from 'vue'

// 特工信息
export const usePreloadInfoStore = defineStore(
  'agentInfo',
  () => {
    // NOTE const数组可以增删改、不能直接赋值
    let agentInfo = []
    let skillData = []
    return { agentInfo, skillData }
  },
  {
    persist: true,
  },
)
