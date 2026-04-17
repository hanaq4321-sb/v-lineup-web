//TODO 修改默认border,阵营
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useImage } from 'vue-konva'
import { Star, StarFilled, Check, Compass, RefreshRight, Plus, Minus, DArrowLeft, DArrowRight, Tools, CloseBold } from '@element-plus/icons-vue'
import RotateRight from '~icons/ix/rotate-90-right'
import RotateLeft from '~icons/ix/rotate-90-left'
import Like from '~icons/mdi/like-outline'
import LikeFilled from '~icons/mdi/like'
const getImageUrl = (url) => {
  return new URL(url, import.meta.url).href
}
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
const mapContainerRef = ref()
const stageRef = ref()
var stageConfig = ref({
  width: 0,
  height: 0,
})
// 利用group实现子元素相对于group相对定位
const groupConfig = ref({
  // config要为ref，canvas才能动态变化。同时给x设置computed就能保证stage变化后，x也会重新计算跟着更新。目的是为了适应不同窗口大小
  // x: computed(() => {
  //   // kanva以元素的左上角定位，所以要居中要减去元素宽度的一半
  //   return stageConfig.value.width / 2
  // }),
  // y: computed(() => {
  //   // kanva以元素的左上角定位，所以要居中要减去元素宽度的一半
  //   return stageConfig.value.height / 2
  // }),
  x: 0,
  y: 0,
  // NOTE offset更改形状的原点。矩形类形状默认的原点是左上角，定位也是以左上角定位。修改完offset后，将原点挪至中心，方后续的定位变换等。
  // offsetX: stageConfig.value.height / 2,
  // offsetY: stageConfig.value.height / 2,
  offsetX: 0,
  offsetY: 0,
  height: 0,
  width: 0,
  draggable: true,
  scaleX: 1,
  scaleY: 1,
})
const [map] = useImage(getImageUrl('../../assets/map/detail/breeze.png'))
const mapDetailConfig = ref({
  x: 0,
  y: 0,
  image: map,
  width: 0,
  height: 0,
})
onMounted(() => {
  // NOTE offsetWidth：内容、内边距、边框  clientWidth：内容、内边距
  // let parentWidth = mapContainerRef.value.clientWidth 这样会导致值定死，应该只获取dom
  stageConfig.value.width = mapContainerRef.value.clientWidth
  stageConfig.value.height = mapContainerRef.value.clientHeight
  mapDetailConfig.value.width = mapContainerRef.value.clientHeight
  mapDetailConfig.value.height = mapContainerRef.value.clientHeight
  groupConfig.value.width = mapContainerRef.value.clientHeight
  groupConfig.value.height = mapContainerRef.value.clientHeight
  const container = document.getElementById('map-container1')
  const observer = new ResizeObserver(() => {
    // 画布正常跟随屏幕大小变化
    stageConfig.value.width = mapContainerRef.value.clientWidth
    stageConfig.value.height = mapContainerRef.value.clientHeight
    // 地图宽高1：1缩放，这样可以使地图组件内的点线也跟着一起缩放
    let scaleY = mapContainerRef.value.clientHeight / groupConfig.value.height
    const group = stageRef.value.getNode().findOne('Group')
    console.log(scaleY)
    group.scale({ x: scaleY, y: scaleY })
    group.offset({ x: group.width() / 2, y: group.height() / 2 })
    // FIXME 窗口变化就重置，检查其他网站逻辑
    group.position({ x: stageConfig.value.width / 2, y: stageConfig.value.height / 2 })
  })
  observer.observe(container)
})
const [skill] = useImage(getImageUrl('../../assets/agent/sova/sova_1.webp'))
const skillList = ref([])
const stageClick = (e) => {
  const group = e.target.getStage().findOne('Group')
  if (!group) return
  // group上的click事件，故获取的是相对于group左上角的定位，因为group的宽高都相等根据屏幕自适应变化，为1：1,故在此可用百分比定位
  const pos = group.getRelativePointerPosition()
  let xp = pos.x / groupConfig.value.width
  let yp = pos.y / groupConfig.value.height
  skillList.value.push({
    // 保证group大小随屏幕变化时，定位也跟着变化
    x: computed(() => {
      return xp * groupConfig.value.width
    }),
    y: computed(() => {
      return yp * groupConfig.value.height
    }),
    id: Date.now().toString(),
    offsetX: 15,
    offsetY: 15,
    width: 30,
    height: 30,
    cornerRadius: 15,
    stroke: '#96ef7b',
    strokeWidth: 2,
    image: skill,
    name: 'skillIcon',
  })
}
const handleWheel = (e) => {
  // 代表没有阻止任何事件
  // e.evt.preventDefault()
  const stage = stageRef.value.getNode()
  // 以x为基准，保证比例不变
  const oldScale = stage.scaleX()
  const pointer = stage.getPointerPosition()

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  }

  // 如何缩放？放大？还是缩小？
  let direction = e.evt.deltaY > 0 ? -1 : 1

  // 当我们在触控板上缩放时，e.evt.ctrlKey 为 true
  // FIXME 在这种情况下，反转方向
  if (e.evt.ctrlKey) {
    direction = -direction
  }

  const scaleBy = 1.1
  const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

  stage.scale({ x: newScale, y: newScale })

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  }
  stage.position(newPos)
}
// 地图调整按钮组
const mapZoomButton = (s) => {
  const stage = stageRef.value.getNode()
  const oldScale = stage.scaleX()
  const scaleBy = 1.1
  const newScale = s > 0 ? oldScale * scaleBy : oldScale / scaleBy
  const newPos = {
    // FIXME 优化
    x: (stage.width() - stage.width() * newScale) / 2,
    y: (stage.height() - stage.height() * newScale) / 2,
  }
  stage.scale({ x: newScale, y: newScale })
  stage.position(newPos)
}
let degree = 0
const mapRotate = (d) => {
  degree += d
  const stage = stageRef.value.getNode()
  const group = stage.findOne('Group')
  group.to({ rotation: degree })
  const icons = stage.find('.skillIcon')
  icons.forEach((icon) => {
    icon.to({ rotation: -degree })
  })
  // v-if未渲染时获取不到形状，这里可以修改config
  agentConfig.value.rotation = -degree
}
const resetMap = () => {
  // NOTE stage的scale是为了实现滚轮缩放，stage适应屏幕通过修改config实现，group的scale是为了适应不同屏幕。在此要分别重置stage的偏移和group的drag
  // 获取stage节点
  const stage = stageRef.value.getNode()
  stage.position({ x: 0, y: 0 })
  stage.scale({ x: 1, y: 1 })
  // 通过stage节点获取组
  const group = stage.findOne('Group') // 直接大写按类型、.按name、#按id。name和id为config中的
  // NOTE 1、修改config.value；2、修改shape.position
  // NOTE config会影响元素，而元素的变化不会修改config
  group.position({ x: stage.width() / 2, y: stage.height() / 2 })
  // 重置角度
  degree = 0
  group.to({ rotation: degree })
  const icons = stage.find('.skillIcon')
  icons.forEach((icon) => {
    icon.to({ rotation: degree })
  })
  agentConfig.value.rotation = degree
}
// #endregion
//#region lineUp范围站位细节展示
const lineUpDetailVisible = ref(false)
const roundConfig = ref({
  x: 200,
  y: 200,
  radius: 50,
  fill: 'rgba(0,0,0,0.3)',
  stroke: '#6c7dff',
  strokeWidth: 2,
  name: 'skillScope',
})
const lineConfig = ref({
  stroke: '#6c7dff',
  strokeWidth: 2,
  lineCap: 'round',
  name: 'skillLine',
})
const [agent] = useImage(getImageUrl('../../assets/agent/sova/sova.webp'))
const agentConfig = ref({
  x: 100,
  y: 100,
  width: 30,
  height: 30,
  // TODO offset值修改为大小的一半
  offsetX: 15,
  offsetY: 15,
  cornerRadius: 5,
  fill: '#6c7dff',
  image: agent,
  name: 'skillAgent',
})
const lineUpHover = (id) => {
  lineUpDetailVisible.value = true
  const item = skillList.value.find((i) => i.id === id)
  roundConfig.value.x = item.x
  roundConfig.value.y = item.y
  item.strokeWidth = 0
  lineConfig.value.points = [roundConfig.value.x, roundConfig.value.y, agentConfig.value.x, agentConfig.value.y]
}
const lineUpBlur = (id) => {
  lineUpDetailVisible.value = false
  const item = skillList.value.find((i) => i.id === id)
  item.strokeWidth = 2
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
import { stages } from 'konva/lib/Stage'
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
          <el-button class="map-reset" @click="mapZoomButton(1)" color="#363636" :icon="Plus" type="info" />
          <el-button class="map-reset" @click="mapZoomButton(-1)" color="#363636" :icon="Minus" type="info" />
        </el-button-group>
      </div>
      <!-- 地图 -->
      <div class="map" ref="mapContainerRef" id="map-container1">
        <v-stage ref="stageRef" :config="stageConfig" @wheel="handleWheel">
          <v-layer>
            <v-group :config="groupConfig" @click="stageClick">
              <!-- 地图背景 -->
              <v-image :config="mapDetailConfig" />
              <!-- 技能范围 -->
              <v-circle :config="roundConfig" v-if="lineUpDetailVisible" />
              <!-- 技能与特工连线 -->
              <v-line :config="lineConfig" v-if="lineUpDetailVisible" />
              <!-- 特工 -->
              <v-image :config="agentConfig" v-if="lineUpDetailVisible" />
              <!-- 技能图标 -->
              <v-image
                v-for="skill in skillList"
                :key="skill.id"
                :config="skill"
                @mouseenter="lineUpHover(skill.id)"
                @mouseleave="lineUpBlur(skill.id)"
                @click="lineupDialogVisible = true"
              />
              <!-- 遮盖按后来居上的顺序 -->
            </v-group>
          </v-layer>
        </v-stage>
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
.map-select1 {
  .el-select__wrapper {
    min-height: 100px;
    height: 100px;
    // background-image: url('../../assets/map/cover/ascent.png');
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
.map-select-dropdown1 {
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
