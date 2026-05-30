import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingBarStore = defineStore(
  'settingBar',
  () => {
    const pointNameVisible = ref(false),
      skillBallVisible = ref(false),
      lightCurtainVisible = ref(false),
      controlAnchorVisible = ref(false),
      skillIconVisible = ref(false),
      mapDraggable = ref(true)
    return { pointNameVisible, skillBallVisible, lightCurtainVisible, controlAnchorVisible, controlAnchorVisible, skillIconVisible, mapDraggable }
  },
  {
    persist: true,
  },
)

export const useAgentSelectStore = defineStore('agentSelct', () => {
  const mapValue = ref('breeze')
  const agentValue = ref('sova')
  const agentLabel = ref('猎枭')
  let skillIndex = 3
  return { mapValue, agentValue, agentLabel, skillIndex }
})
