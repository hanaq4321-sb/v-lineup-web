<script setup>
import Layout from './views/Layout.vue'
import { getAgentInfo } from './api/agent.js'
import { getSkillDataService } from './api/skill-data.js'
import { usePreloadInfoStore } from './store/preload-info.js'
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
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
// TODO 多线程？优化？每次都读？
onMounted(() => {
  preloadAgentInfo()
  preloadSkillData()
})
const preloadAgentInfo = async () => {
  const result = await getAgentInfo()
  if (result.code == 0) {
    preloadInfoStore.agentInfo = result.data
  } else {
    console.log(result.msg)
    ElMessage.error('数据加载异常')
  }
}
const preloadSkillData = async () => {
  const result = await getSkillDataService()
  if (result.code == 0) {
    preloadInfoStore.skillData = result.data
  } else {
    console.log(result.msg)
    ElMessage.error('数据加载异常')
  }
}
</script>

<template>
  <Layout />
</template>

<style>
body {
  margin: 0px;
}
</style>
