<script setup>
import { ref } from 'vue'
import { useSettingBarStore } from '@/store/user'
import { Tools, DArrowLeft, DArrowRight } from '@element-plus/icons-vue'
import { controlMapDraggable } from '@/styles/js/map-adjust'

// 绑定属性
const setStore = useSettingBarStore()
let stageRef = defineProps(['stage'])
// 开关动画
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
const settingBarAgentClick = (e, agent) => {
  let dom = document.getElementsByClassName('agent-img')
  for (let i = 0; i < dom.length; i++) {
    dom[i].style.backgroundColor = '#363636'
  }
  e.currentTarget.style.backgroundColor = '#96ef7b'
}
</script>
<template>
  <span class="setting-bar-switch" v-if="settingBarVisible" @click="(settingBarSwitchOff(), (settingBarVisible = false))"><DArrowRight /></span>
  <span class="setting-bar-switch" v-else @click="(settingBarSwitchOn(), (settingBarVisible = true))"><DArrowLeft /></span>
  <div class="setting-bar">
    <div class="setting-bar-container">
      <div class="flex-center" style="line-height: 25px">
        <el-icon :size="25" color="#fff"><Tools /></el-icon>
        &nbsp;
        <span class="title-text">设置</span>
      </div>
      <!-- NOTE flex-center两个行级元素垂直对齐才会生效 -->
      <div class="flex-center">
        <div class="large-text">点位报点</div>
        <el-switch size="large" class="setting-switch" v-model="setStore.pointNameVisible" />
      </div>
      <div class="flex-center">
        <div class="large-text">终极宝珠</div>
        <el-switch size="large" class="setting-switch" v-model="setStore.skillBallVisible" />
      </div>
      <div class="flex-center">
        <div class="large-text">出生光幕</div>
        <el-switch size="large" class="setting-switch" v-model="setStore.lightCurtainVisible" />
      </div>
      <div class="flex-center">
        <div class="large-text">控制锚点</div>
        <el-switch size="large" class="setting-switch" v-model="setStore.controlAnchorVisible" @click="controlAnchorVisibleClick" />
      </div>
      <div class="flex-center">
        <div class="large-text">技能图标</div>
        <el-switch size="large" class="setting-switch" v-model="setStore.skillIconVisible" @click="controlAnchorVisibleClick" />
      </div>
      <div class="flex-center">
        <div class="large-text">地图拖动</div>
        <el-switch size="large" class="setting-switch" v-model="setStore.mapDraggable" @click="controlMapDraggable(stageRef.stage)" />
      </div>
      <p class="label-text">特工偏好</p>
      <div class="agent-img-container">
        <img
          class="agent-img"
          :src="`agent/${item.value}/${item.value}.webp`"
          v-for="(item, index) in agents"
          :key="index"
          @click="settingBarAgentClick($event, item.value)"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.setting-bar-switch {
  display: flex;
  align-items: center;
  width: 16px;
  height: 70px;
  color: #fff;
  background-color: #1a1a1a;
  border: 1px solid #363636;
  border-right: none;
  border-radius: 50% 0 0 50%;
  position: relative;
  z-index: 999;
  right: 0;
  top: 45%;
}

.setting-bar-switch:hover {
  background-color: #363636;
}

.setting-bar {
  height: 100%;
  width: 0px;
  border-left: 1px solid #363636;
  background-color: #1a1a1a;
  position: relative;
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

.setting-bar-anime-fold {
  animation: setting-bar-fold 0.4s ease forwards;
}

.setting-bar-anime-unfold {
  animation: setting-bar-unfold 0.4s ease forwards;
}

@keyframes setting-bar-fold {
  from {
    min-width: 300px;
  }
  to {
    min-width: 0px;
  }
}

@keyframes setting-bar-unfold {
  from {
    min-width: 0;
  }
  to {
    min-width: 300px;
  }
}
</style>
