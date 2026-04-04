//TODO 修改默认border,阵营
<script setup>
import { ref } from 'vue'
import { Star, StarFilled, Check, Compass, RefreshRight, Plus, Minus, DArrowLeft, DArrowRight, Tools, CloseBold } from '@element-plus/icons-vue'
import RotateRight from '~icons/ix/rotate-90-right'
import RotateLeft from '~icons/ix/rotate-90-left'
import Like from '~icons/mdi/like-outline'
import LikeFilled from '~icons/mdi/like'
//#region 地图选择
const mapValue = ref('深海明珠')
const maps = [
  {
    label: '深海明珠',
    value: '深海明珠',
  },
  {
    label: '霓虹町',
    value: '霓虹町',
  },
  {
    label: '亚海悬城',
    value: '亚海悬城',
  },
  {
    label: '亚海悬城',
    value: '亚海悬城',
  },
  {
    label: '亚海悬城',
    value: '亚海悬城',
  },
  {
    label: '亚海悬城',
    value: '亚海悬城',
  },
  {
    label: '亚海悬城',
    value: '亚海悬城',
  },
]
const agentValue = ref('猎枭')
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
const camp = ref('')
const skills = ref([
  { id: 1, url: '../../assets/agent/sova/sova_1.webp' },
  { id: 2, url: '../../assets/agent/sova/sova_2.webp' },
  { id: 3, url: '../../assets/agent/sova/sova_3.webp' },
  { id: 4, url: '../../assets/agent/sova/sova_4.webp' },
])
//#endregion
//#region 技能选择
const ifSkillIconDetail = ref([{ bool: false }, { bool: false }, { bool: true }, { bool: false }])
const skillIcon = 'skill-icon'
const skillIconClick = 'skill-icon-click'
const skillClick = (id, event) => {}
//#endregion
// 收藏
const ifSwitchCollect = ref(false)
//#region 图片点击位置获取与定位
const imgGetPosition = (event) => {
  // MouseEvent中的参数，offset给出相对父级元素的偏移
  let clickX = event.offsetX
  let clickY = event.offsetY
  // 将相对坐标转化为图片内的百分比坐标
  let width = dotRef.value.parentNode.clientWidth
  let height = dotRef.value.parentNode.clientHeight
  let percentX = clickX / width
  let percentY = clickY / height
  console.log('x:' + percentX + ' y:' + percentY)
  locate(percentX, percentY)
}
const dotRef = ref() // event.currentTarget = ref.value= document.get 都是dom对象 .  target是点击元素，currentTarget是绑定事件元素
const locate = (X, Y) => {
  // Vue3中通过ref.value的方式获取dom,dom能动态的操控这个元素
  dotRef.value.style.left = X * 100 + '%'
  dotRef.value.style.top = Y * 100 + '%'
}
//#endregion
//#region 地图缩放、拖动、旋转
let scale = 1,
  scaleOld = 1,
  degree = 0,
  deltaX = 0,
  deltaY = 0
let moveX = 0
let moveY = 0
let x = 0
let y = 0
// TODO 对两个不同位置缩放有误差
const mapZoom = (event) => {
  let width = event.currentTarget.clientWidth,
    height = event.currentTarget.clientHeight
  let d = event.deltaY < 0 ? 0.1 : -0.1
  let ratio = 1 + d
  let temp_scale = scale * ratio
  if ((temp_scale > 1 && temp_scale < 2) || (temp_scale >= 2 && event.deltaY > 0) || (temp_scale <= 1 && event.deltaY < 0)) {
    scale = temp_scale
    let rotateX = event.offsetX,
      rotateY = event.offsetY
    let reminder = degree % 360
    if (reminder == 90 || reminder == -270) {
      rotateX = height - event.offsetY
      rotateY = event.offsetX
    } else if (reminder == -90 || reminder == 270) {
      rotateX = event.offsetY
      rotateY = width - event.offsetX
    } else if (reminder == 180 || reminder == -180) {
      rotateX = width - event.offsetX
      rotateY = height - event.offsetY
    }
    let rect = event.currentTarget.getBoundingClientRect()
    const max = {
      x: (d * 630) / 2,
      y: (d * 630) / 2,
    }
    const mouseOffset = {
      x: rotateX,
      y: rotateY,
    }
    x -= (mouseOffset.x - x) * d - max.x
    y -= (mouseOffset.y - y) * d - max.y
    // transform:scale rotate不改变布局尺寸，如果仅放大图片，图片放大后点击的位置映射的是原尺寸位置。并且transform变换不会保存，所以每次变换需要将各种变换都设置
    event.currentTarget.style.transform = `translate3d(${x + moveX}px,${y + moveY}px,0) scale(${scale}) rotate(${degree}deg)`
    // event.target.parentNode.style.transformOrigin = `${x}px ${y}px`  因为要涉及到旋转后仍能正常缩放，而使用origin会导致元素以此为中心旋转
  }
}
const mapZoom1 = (event) => {
  // 浮点精度问题，会出现0.500~01
  let parentWidth = event.currentTarget.parentNode.clientWidth
  let parentHeight = event.currentTarget.parentNode.clientHeight
  let ratio = event.deltaY < 0 ? 0.1 : -0.1
  let temp_scale = scale * (ratio + 1)
  if ((temp_scale > 1 && temp_scale < 2) || (temp_scale >= 2 && event.deltaY > 0) || (temp_scale <= 1 && event.deltaY < 0)) {
    scale = temp_scale
    // scale = scale + event.deltaY * -0.001
    // 让获取到的坐标也旋转到对应位置。  transform仅改变视觉，比如点击图片左上角，顺指针90度后，点击图片右上角，获取到的仍是原来左上角的位置
    let rotateX = event.offsetX,
      rotateY = event.offsetY
    let reminder = degree % 360
    if (reminder == 90 || reminder == -270) {
      rotateX = parentHeight - event.offsetY
      rotateY = event.offsetX
    } else if (reminder == -90 || reminder == 270) {
      rotateX = event.offsetY
      rotateY = parentWidth - event.offsetX
    } else if (reminder == 180 || reminder == -180) {
      rotateX = parentWidth - event.offsetX
      rotateY = parentHeight - event.offsetY
    }
    // 计算缩放后的偏移量，用焦点离中心点的比例乘以图片缩放的尺寸的一半。
    let deltaX = (((rotateX / (dotRef.value.parentNode.clientWidth / 2) - 1) * dotRef.value.parentNode.clientWidth) / 2) * (scale - 1)
    let deltaY = (((rotateY / (dotRef.value.parentNode.clientHeight / 2) - 1) * dotRef.value.parentNode.clientHeight) / 2) * (scale - 1)
    // transform:scale rotate不改变布局尺寸，如果仅放大图片，图片放大后点击的位置映射的是原尺寸位置。并且transform变换不会保存，所以每次变换需要将各种变换都设置
    //NOTE 在右上角放大，地图向左下角偏移，此时在已经偏移的地图中另选一个点放大，因为offset不变，故delta不变，故整体将会以图片未向左下角偏移时放大
    let rect = event.currentTarget.getBoundingClientRect()
    let ratio = scale - scaleOld
    scaleOld = scale
    const max = {
      x: (ratio * rect.width) / 2,
      y: (ratio * rect.height) / 2,
    }
    const mouseOffset = {
      x: event.clientX - rect.x,
      y: event.clientY - rect.y,
    }
    x -= (mouseOffset.x - x) * ratio - max.x
    y -= (mouseOffset.y - y) * ratio - max.y
    event.currentTarget.parentNode.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale}) rotate(${degree}deg)`
    // event.currentTarget.parentNode.style.transform = `scale(${scale}) rotate(${degree}deg)`
    // event.target.parentNode.style.transformOrigin = `${x}px ${y}px`  因为要涉及到旋转后仍能正常缩放，而使用origin会导致元素以此为中心旋转
  }
}
let ifDragging = false
const startDrag = (event) => {
  ifDragging = true
  event.currentTarget.onmousemove = (e) => {
    if (!ifDragging) return
    moveX += e.movementX
    moveY += e.movementY
    e.currentTarget.style.transform = `translate(${x + moveX}px,${y + moveY}px) scale(${scale}) rotate(${degree}deg)`
  }
  // 整个页面的监听器
  document.onmouseup = () => {
    if (!ifDragging) return
    ifDragging = false
  }
}
const mapZoomButton = (s) => {
  if ((scale > 1 && scale < 2) || (scale >= 2 && s < 0) || (scale <= 1 && s > 0)) {
    scale += s
    document.getElementsByClassName('map')[0].style.transform = `translate(${x + moveX}px,${y + moveY}px) rotate(${degree}deg) scale(${scale})`
  }
}
const mapRotate = (deg) => {
  degree += deg
  document.getElementsByClassName('map')[0].style.transform = `translate(${x + moveX}px,${y + moveY}px) rotate(${degree}deg) scale(${scale})`
  document.getElementsByClassName('map')[0].style.transformOrigin = 'center center'
}
const resetMap = () => {
  // 得到的是数组
  document.getElementsByClassName('map')[0].setAttribute('style', 'left:0;top:0')
  document.getElementsByClassName('map')[0].style.transform = 'scale(1)'
  scale = 1
  moveX = 0
  moveY = 0
  degree = 0
  deltaX = 0
  deltaY = 0
  x = 0
  y = 0
}
//#endregion
import mapImg from '@/assets/map/detail/abyss.png'
import a from '../../assets/Pasted image 20250806131110.png'
const mapList = [mapImg]
// 点位类型选择
const lineUpTypeChecked = ref()
//#region 技能描点展示
const lineupDialogVisible = ref(false)
const lineupHover = (event) => {
  event.currentTarget.style.border = 'none'
  event.currentTarget.nextSibling.style.backgroundColor = '#6c7dff'
  var r = document.getElementById('dot-range')
  let range = r.getContext('2d')
  range.beginPath()
  range.arc(250, 250, 80, 0, 2 * Math.PI)
  range.fillStyle = 'rgba(0,0,0,0.3)'
  range.fill()
  range.strokeStyle = '#6c7dff'
  range.lineWidth = 2
  range.stroke()
  range.moveTo(350, 350)
  range.lineTo(250, 250)
  range.stroke()
}
const lineupBlur = (event) => {
  event.currentTarget.style.border = '2px solid #96ef7b'
  event.currentTarget.nextSibling.style.backgroundColor = '#96ef7b'
  var r = document.getElementById('dot-range')
  let range = r.getContext('2d')
  range.clearRect(0, 0, 630, 630)
}
import src1 from '../../assets/Pasted image 20250806131110.png'
import src2 from '../../assets/Pasted image 20250806131156.png'
import src3 from '../../assets/Pasted image 20250806131222.png'
const lineUpSrcList = [src1, src2, src3]
const isLineUpPreview = ref(false)
const lineUpPreviewIndex = ref(0)
const showLineUpPreview = (index) => {
  lineUpPreviewIndex.value = index
  isLineUpPreview.value = true
}
const commentInput = ref()
const isCollect = ref(false),
  isLike = ref(false)
//#endregion
//#region 设置栏
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
const pointNameVisible = ref(false),
  skillBallVisible = ref(false),
  lightCurtainVisible = ref(false)
const getImageUrl = (url) => {
  return new URL(url, import.meta.url).href
}
const settingBarAgentClick = (e, agent) => {
  let dom = document.getElementsByClassName('agent-img')
  for (let i = 0; i < dom.length; i++) {
    dom[i].style.backgroundColor = '#363636'
  }
  e.currentTarget.style.backgroundColor = '#96ef7b'
}
//#endregion
</script>

<template>
  <div class="container">
    <!-- 选择 -->
    <div class="select-aside">
      <!-- 地图选择 -->
      <el-select class="map-select" v-model="mapValue" :show-arrow="false" :offset="7" popper-class="map-select-dropdown" @change="mapChange">
        <el-option v-for="map in maps" :key="map.value" :label="map.label" :value="map.value">
          <div>
            <span>{{ map.label }}</span>
          </div>
        </el-option>
      </el-select>
      <br />
      <!-- 英雄选择 -->
      <div>
        <p class="label-text">选择英雄</p>
        <el-select class="agent-select" v-model="agentValue" :show-arrow="false" :offset="7" popper-class="agent-select-dropdown">
          <el-option v-for="agent in agents" :key="agent.value" :label="agent.label" :value="agent.value"></el-option>
        </el-select>
      </div>
      <br />
      <div class="row">
        <img class="agent-icon" src="../../assets/agent/sova/sova.webp" />
        <span class="agent-name"><strong>猎枭</strong></span>
      </div>
      <br />
      <!-- 技能选择 -->
      <div class="row-space">
        <div class="skills">
          <img
            :class="ifSkillIconDetail[0].bool ? skillIconClick : skillIcon"
            src="../../assets/agent/sova/sova_1.webp"
            @click="(skillClick(1), (ifSkillIconDetail[0].bool = !ifSkillIconDetail[0].bool))"
          />
          <el-tag class="skill-icon-num" v-if="ifSkillIconDetail[0].bool" size="small" effect="dark" type="success" round>9</el-tag>
          <el-icon class="skill-icon-check" v-if="ifSkillIconDetail[0].bool" color="green" size="15"><Check /></el-icon>
        </div>
        <div class="skills">
          <img
            :class="ifSkillIconDetail[1].bool ? skillIconClick : skillIcon"
            src="../../assets/agent/sova/sova_2.webp"
            @click="(skillClick(1), (ifSkillIconDetail[1].bool = !ifSkillIconDetail[1].bool))"
          />
          <el-tag class="skill-icon-num" v-if="ifSkillIconDetail[1].bool" size="small" effect="dark" type="success" round>22</el-tag>
          <el-icon class="skill-icon-check" v-if="ifSkillIconDetail[1].bool" color="green" size="15"><Check /></el-icon>
        </div>
        <div class="skills">
          <img
            :class="ifSkillIconDetail[2].bool ? skillIconClick : skillIcon"
            src="../../assets/agent/sova/sova_3.webp"
            @click="(skillClick(1), (ifSkillIconDetail[2].bool = !ifSkillIconDetail[2].bool))"
          />
          <el-tag class="skill-icon-num" v-if="ifSkillIconDetail[2].bool" size="small" effect="dark" type="success" round>22</el-tag>
          <el-icon class="skill-icon-check" v-if="ifSkillIconDetail[2].bool" color="green" size="15"><Check /></el-icon>
        </div>
        <div class="skills">
          <img
            :class="ifSkillIconDetail[3].bool ? skillIconClick : skillIcon"
            src="../../assets/agent/sova/sova_4.webp"
            @click="(skillClick(1), (ifSkillIconDetail[3].bool = !ifSkillIconDetail[3].bool))"
          />
          <el-tag class="skill-icon-num" v-if="ifSkillIconDetail[3].bool" size="small" effect="dark" type="success" round>22</el-tag>
          <el-icon class="skill-icon-check" v-if="ifSkillIconDetail[3].bool" color="green" size="15"><Check /></el-icon>
        </div>
      </div>
      <!-- 阵营选择 -->
      <div>
        <p class="label-text">选择阵营</p>
        <el-radio-group class="camp-select" v-model="camp" size="large" fill="#363636">
          <el-radio-button class="all" label="所有" value="All"> </el-radio-button>
          <el-radio-button class="t" label="进攻方" value="T"></el-radio-button>
          <el-radio-button class="ct" label="防守方" value="CT"></el-radio-button>
        </el-radio-group>
      </div>
      <br /><br />
      <!-- 收藏点位 -->
      <el-button class="show-collect" color="#363636" @click="ifSwitchCollect = !ifSwitchCollect">
        <template #default v-if="!ifSwitchCollect">
          收藏点位<el-icon class="el-icon--right"><Star /></el-icon>
        </template>
        <template #default v-if="ifSwitchCollect">
          全部点位<el-icon class="el-icon--right"><Compass /></el-icon>
        </template>
      </el-button>
    </div>
    <!-- 道具 -->
    <div class="map-container">
      <!-- 点位类型选择 -->
      <div class="lineup-type-check">
        <el-checkbox-group v-model="lineUpTypeChecked" size="large">
          <el-checkbox label="所有" value="all"></el-checkbox>
          <el-checkbox label="热门点位" value="hot"></el-checkbox>
          <el-checkbox label="小众宝藏" value="minor"></el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- 地图调整按钮 -->
      <div class="map-adjust-button">
        <el-button class="map-reset" @click="resetMap" color="#363636" :icon="RefreshRight" type="info" />
        <br />
        <el-button-group direction="vertical">
          <el-button class="map-reset" @click="mapRotate(90)" color="#363636" :icon="RotateRight" type="info" />
          <el-button class="map-reset" @click="mapRotate(-90)" color="#363636" :icon="RotateLeft" type="info" />
        </el-button-group>
        <br />
        <el-button-group direction="vertical">
          <el-button class="map-reset" @click="mapZoomButton(0.1)" color="#363636" :icon="Plus" type="info" />
          <el-button class="map-reset" @click="mapZoomButton(-0.1)" color="#363636" :icon="Minus" type="info" />
        </el-button-group>
      </div>
      <!-- 地图 -->
      <div class="map" @mousedown="startDrag" @wheel="mapZoom" draggable="false" id="map-container1">
        <canvas class="dot-range" id="dot-range" width="630" height="630">抱歉您的浏览器不支持画布功能，请更换浏览器</canvas>
        <div class="lineup">
          <span ref="dotRef" class="dot" @mouseenter="lineupHover" @mouseleave="lineupBlur" @click="lineupDialogVisible = true"></span>
          <span class="dot-agent"></span>
        </div>
        <!-- <el-image ref="imgRef" class="imgTest" @mousedown="imgGetPosition" :src="mapImg" fit="cover" :preview-src-list="mapList" /> -->
        <img class="imgTest" @mousedown="imgGetPosition1" :src="mapImg" draggable="false" />
      </div>
      <!-- 道具详情弹出框 -->
      <el-dialog class="lineup-dialog" v-model="lineupDialogVisible" width="90%" title="A厅探测箭" :show-close="false">
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
        <el-row>
          <el-col class="lineup-dialog-main" :span="18">
            <el-image v-for="(src, index) in lineUpSrcList" :src="src" :fill="cover" :key="index" @click="showLineUpPreview(index)"></el-image>
            <el-image-viewer
              v-if="isLineUpPreview"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.7"
              :url-list="lineUpSrcList"
              :initial-index="lineUpPreviewIndex"
              @close="isLineUpPreview = false"
            />
          </el-col>
          <el-col class="lineup-dialog-aside" :span="6">
            <p class="label-text" style="margin-top: 0">道具描述</p>
            <div class="description">开局射，帮助队友前压。开局射，帮助队友前压。开局射，帮助队友前压。</div>
            <tbody style="width: 100%">
              <tr>
                <td>
                  <span class="label">出手方式</span>
                  <span class="describe">跑跳投</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="label">是否下蹲</span>
                  <span class="describe">是</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="label">蓄力反弹</span>
                  <span class="describe">一蓄力二反弹</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="label">容错率</span>
                  <span class="describe">高</span>
                </td>
              </tr>
            </tbody>
            <br />
            <!-- NOTE 图标与文字平齐，el-icon和iconify相同大小 -->
            <div class="flex-center">
              <div class="flex-center default-text" v-if="!isCollect" @click="isCollect = !isCollect">
                <el-icon size="24">
                  <Star />
                </el-icon>
                &nbsp;&nbsp;
                <span>20</span>
              </div>
              <div class="flex-center" style="font-size: 16px; color: #f2688f" v-else @click="isCollect = !isCollect">
                <el-icon size="24">
                  <StarFilled />
                </el-icon>
                &nbsp;&nbsp;
                <span>20</span>
              </div>
              <div class="flex-center default-text" v-if="!isLike" @click="isLike = !isLike">
                <Like style="width: 24px; height: 24px; font-size: 24px; margin-left: 30px" />
                &nbsp;&nbsp;
                <span>20</span>
              </div>
              <div class="flex-center" style="font-size: 16px; color: #27c6ff" v-else @click="isLike = !isLike">
                <LikeFilled style="width: 24px; height: 24px; font-size: 24px; margin-left: 30px" />
                &nbsp;&nbsp;
                <span>20</span>
              </div>
            </div>
            <br />
            <div>
              <p class="label-text" style="margin-top: 5px; margin-bottom: 5px">创建时间：2025-3-15 23:11:01</p>
              <p class="label-text" style="margin-top: 5px; margin-bottom: 5px">更新时间：2026-3-18 01:11:01</p>
              <p class="label-text" style="margin-top: 5px; margin-bottom: 5px">
                来源：https://www.bilibili.com/video/BV1vRwYzrE9slabel-textlabel-textlabel-textlabel-textlabel-textlabel-text
              </p>
            </div>
            <div class="comment-input">
              <img src="../../assets/avatar.jpg" style="width: 40px; border-radius: 50%" />
              <el-input v-model="commentInput" maxlength="40" show-word-limit word-limit-position="outside" type="textarea"></el-input>
            </div>
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 设置栏开关 -->
      <span class="setting-bar-switch" v-if="settingBarVisible" @click="(settingBarSwitchOff(), (settingBarVisible = false))"><DArrowRight /></span>
      <span class="setting-bar-switch" v-else @click="(settingBarSwitchOn(), (settingBarVisible = true))"><DArrowLeft /></span>
    </div>
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
  height: 100%;
  border: 1px solid red;
  box-sizing: border-box;
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
  }

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

  .show-collect {
    width: 100%;
    height: 40px;
    font-size: 20px;
    // --el-button-bg-color: #363636;
    --el-button-border-color: rgba(0, 0, 0, 0);
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
    // left: 0px;
    // top: 0px;
    margin-top: 10px;
    border: 1px solid #fff;
    width: 630px;
    height: 630px;
    overflow: hidden;
    user-select: none;

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

  .lineup-dialog {
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
    position: absolute;
    z-index: 999;
    right: 0;
    top: 46%;
  }

  .setting-bar-switch:hover {
    background-color: #363636;
  }
}

.setting-bar {
  height: 100%;
  width: 0px;
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
    min-width: 0;
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

<style lang="scss">
/* 通过选择父组件的元素限定style的生效范围 */
.map-select {
  .el-select__wrapper {
    min-height: 100px;
    height: 100px;
    background-image: url('../../assets/map/cover/ascent.png');
    background-repeat: no-repeat;
    background-size: cover;
    font-size: 27px;
    font-weight: bold;
    line-height: 27px;
  }

  .el-select__placeholder {
    color: #fff;
    font-style: s;
  }
}

// .el-select__popper.el-popper { 和popper-class同级
//   border: none !important;
// }

/* 下拉栏在popper组件中，需要定义通过popper-class定义类名访问 */
.map-select-dropdown {
  --el-popper-bg-color-light: #1a1a1a !important;
  --el-border-color-light: rgba(0, 0, 0, 0);

  //TODO 解决增大缩放页面问题
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
    background-image: url('../../assets/map/cover/bind.png');
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
//TODO border
.camp-select {
  .el-radio-button__inner {
    color: #fff;
    background-color: #363636;
    border-radius: 4px !important;
  }

  .all {
    .el-radio-button__inner:hover {
      color: #686767;
    }
  }

  .t {
    margin: 0 15px;
    --el-radio-button-checked-text-color: #ff4655;
    .el-radio-button__inner:hover {
      color: #ff4655;
    }
  }

  .ct {
    --el-radio-button-checked-text-color: #66e5da;
    .el-radio-button__inner:hover {
      color: #66e5da;
    }
  }
}

.lineup-dialog {
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
</style>
