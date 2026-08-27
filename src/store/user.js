import { defineStore } from 'pinia'
import { ref } from 'vue'
// 控制登录dialog
export const useLoginDialogStore = defineStore('loginDialog', () => {
  const loginDialogVisible = ref(false)
  return { loginDialogVisible }
})
// 保存设置栏状态
let favoriteAgent = ref('sova')
export const useSettingBarStore = defineStore(
  'settingBar',
  () => {
    const pointNameVisible = ref(false),
      skillBallVisible = ref(false),
      lightCurtainVisible = ref(false),
      controlAnchorVisible = ref(false),
      skillIconVisible = ref(false),
      mapDraggable = ref(true),
      settingBarVisible = ref(false),
      favoriteAgent = ref('sova')
    return {
      pointNameVisible,
      skillBallVisible,
      lightCurtainVisible,
      controlAnchorVisible,
      controlAnchorVisible,
      skillIconVisible,
      mapDraggable,
      settingBarVisible,
      favoriteAgent,
    }
  },
  {
    persist: true,
  },
)
// 不同页面间共享当前地图、特工的选中状态
export const useAgentSelectStore = defineStore(
  'agentSelect',
  () => {
    // 外部通过toref或.可以直接引用修改
    // 暴露的状态都应该用 ref 或 reactive 包裹
    const mapValue = ref('breeze')
    const agentValue = ref('sova')
    const agentLabel = ref('猎枭')
    const skillIndex = ref(3)
    // 图片
    const currentAgent = ref()
    const skillImg = ref()
    const agentImg = ref()
    return { mapValue, agentValue, agentLabel, skillIndex, currentAgent, skillImg, agentImg }
  },
  {
    persist: true,
  },
)
// Token
export const useTokenStore = defineStore(
  'token',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    return { token, setToken, removeToken }
  },
  {
    persist: true,
  },
)
