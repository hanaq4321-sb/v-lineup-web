<!-- <script src="../../styles/js/editor.js"></script> -->
<script setup>
import { ref, onMounted, reactive, shallowReactive, onBeforeUnmount, computed, watch } from 'vue'
import { useImage } from 'vue-konva'
import {
  Star,
  StarFilled,
  Check,
  Compass,
  RefreshRight,
  Plus,
  Minus,
  DArrowLeft,
  DArrowRight,
  Tools,
  CloseBold,
  UploadFilled,
  ZoomIn,
  Delete,
  Edit,
  User,
  Hide,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Konva from 'konva'
import {
  controlConfig,
  rotateControlCircle,
  dragLineBothEnd,
  rotateControlImg,
  ControlRotate,
  controlHover,
  controlLeave,
} from '@/styles/js/skill-editor'
import { mapDraggable, controlMapDraggable, handleWheel, mapZoomButton, mapRotate, resetMap } from '@/styles/js/map-adjust'
import RotateRight from '~icons/ix/rotate-90-right'
import RotateLeft from '~icons/ix/rotate-90-left'
import settingBar from './public/settingBar.vue'
import { useAgentSelectStore } from '@/store/user'
import { storeToRefs } from 'pinia'
//#region 地图、特工、技能信息
const selectStore = useAgentSelectStore()
const { mapValue, agentValue, agentLabel } = storeToRefs(selectStore)
let skillIndex = selectStore.skillIndex
const maps = [
  {
    label: '幽邃地窟',
    value: 'abyss',
  },
  {
    label: '亚海悬城',
    value: 'ascent',
  },
  {
    label: '源工重镇',
    value: 'bind',
  },
  {
    label: '微风岛屿',
    value: 'breeze',
  },
  {
    label: '盐海矿镇',
    value: 'corrode',
  },
  {
    label: '裂变峡谷',
    value: 'fracture',
  },
  {
    label: '隐世修所',
    value: 'haven',
  },
  {
    label: '森寒冬港',
    value: 'icebox',
  },
  {
    label: '莲花古城',
    value: 'lotus',
  },
  {
    label: '深海明珠',
    value: 'pearl',
  },
  {
    label: '霓虹町',
    value: 'split',
  },
  {
    label: '日落之城',
    value: 'sunset',
  },
]
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
    label: '炼狱',
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
// NOTE public中文件无需添加/public。且不需要import或require、getUrl。
const skillSelectIconList = ref([
  `agent/${agentValue.value}/${agentValue.value}_1.webp`,
  `agent/${agentValue.value}/${agentValue.value}_2.webp`,
  `agent/${agentValue.value}/${agentValue.value}_3.webp`,
  `agent/${agentValue.value}/${agentValue.value}_4.webp`,
])
const skillSelectAgent = ref(`agent/${agentValue.value}/${agentValue.value}.webp`)
const skillInfo = [
  {
    agent: 'sova',
    index: 1,
    type: 'control',
  },
  {
    agent: 'sova',
    index: 2,
    type: 'throwGround',
  },
  {
    agent: 'sova',
    index: 3,
    type: 'throw',
  },
  {
    agent: 'sova',
    index: 4,
    type: 'line',
  },
  {
    agent: 'harbor',
    index: 1,
    type: 'throw',
  },
  {
    agent: 'harbor',
    index: 2,
    type: 'curve',
  },
  {
    agent: 'harbor',
    index: 3,
    type: 'throw',
  },
  {
    agent: 'harbor',
    index: 4,
    type: 'line',
  },
  {
    agent: 'viper',
    index: 1,
    type: 'throw',
  },
  {
    agent: 'viper',
    index: 2,
    type: 'throw',
  },
  {
    agent: 'viper',
    index: 3,
    type: 'line',
  },
  {
    agent: 'viper',
    index: 4,
    type: 'polygon',
  },
  {
    agent: 'fade',
    index: 1,
    type: 'control',
  },
  {
    agent: 'fade',
    index: 2,
    type: 'throwGround',
  },
  {
    agent: 'fade',
    index: 3,
    type: 'throw',
  },
  {
    agent: 'fade',
    index: 4,
    type: 'line',
  },
  {
    agent: 'clove',
    index: 1,
    type: 'others',
  },
  {
    agent: 'clove',
    index: 2,
    type: 'throwGround',
  },
  {
    agent: 'clove',
    index: 3,
    type: 'circle',
  },
  {
    agent: 'clove',
    index: 4,
    type: 'others',
  },
  {
    agent: 'astra',
    index: 1,
    type: 'circle',
  },
  {
    agent: 'astra',
    index: 2,
    type: 'circle',
  },
  {
    agent: 'astra',
    index: 3,
    type: 'circle',
  },
  {
    agent: 'astra',
    index: 4,
    type: 'line',
  },
  {
    agent: 'brimstone',
    index: 1,
    type: 'circle',
  },
  {
    agent: 'brimstone',
    index: 2,
    type: 'throwGround',
  },
  {
    agent: 'brimstone',
    index: 3,
    type: 'circle',
  },
  {
    agent: 'brimstone',
    index: 4,
    type: 'circle',
  },
  {
    agent: 'deadlock',
    index: 1,
    type: 'place',
  },
  {
    agent: 'deadlock',
    index: 2,
    type: 'place',
  },
  {
    agent: 'deadlock',
    index: 3,
    type: 'throwGround',
  },
  {
    agent: 'deadlock',
    index: 4,
    type: 'throwGround',
  },
  {
    agent: 'raze',
    index: 1,
    type: 'controlStraight',
  },
  {
    agent: 'raze',
    index: 2,
    type: 'throwGround',
  },
  {
    agent: 'raze',
    index: 3,
    type: 'throwGround',
  },
  {
    agent: 'raze',
    index: 4,
    type: 'others',
  },
  {
    agent: 'neon',
    index: 1,
    type: 'doubleLine',
  },
]
const skillType = ref('controlStraight')
//#endregion

//#region 画布

//#region 画布属性
const containerRef = ref()
const mapContainerRef = ref()
const stageRef = ref()
const stageConfig = ref({
  x: 0,
  y: 0,
  draggable: true,
  //TODO 禁止拖动选项
})
const mapContainerGroupCfg = ref({
  width: 1000,
  height: 1000,
  offsetX: 500,
  offsetY: 500,
  name: 'mapContainerGroup',
})
const mapImgGroupCfg = ref({
  width: 1000,
  height: 1000,
  draggable: false,
  stroke: 'red',
  strokeWidth: 2,
  name: 'mapImgGroup',
})
let [map] = useImage(`map/detail/${mapValue.value}.png`)
const mapImageConfig = ref({
  width: 1000,
  height: 1000,
  image: map,
  name: 'mapImage',
})
const skillGroupConfig = ref({
  // 固定画布大小，调整scale适应屏幕。若不固定大小，根据mounted获取会造成在不同桌面缩放比例下，创建的组件大小不同,方便匹配组件大小。
  width: 1000,
  height: 1000,
  draggable: false,
  name: 'mapGroup',
  stroke: 'red',
  strokeWidth: 2,
})
//#endregion

//#region 窗口尺寸监听
const observer = new ResizeObserver(() => {
  // 画布尺寸随地图窗口变化，并非整个页面，这样折叠侧边栏时也能触发
  const stage = stageRef.value.getNode()
  stage.width(mapContainerRef.value.clientWidth)
  stage.height(mapContainerRef.value.clientHeight)
  // 中间地图group随窗口缩放scale,尺寸不变化。
  const group = stage.findOne('.mapContainerGroup')
  let scaleY = mapContainerRef.value.clientHeight / group.height()
  group.scale({ x: scaleY, y: scaleY })
  group.position({ x: mapContainerRef.value.clientWidth / 2, y: mapContainerRef.value.clientHeight / 2 })
  stage.batchDraw()
})
onMounted(() => {
  observer.observe(mapContainerRef.value)
})
onBeforeUnmount(() => {
  // NOTE 在组件销毁时应该销毁监听器，否则页面重新加载时会导致上一个监听器获取不到还未加载完的界面
  observer.disconnect()
})
//#endregion

//#endregion

//#region 技能绘制
let [locateIcon] = useImage('image/icon/located.png')
let [gun] = useImage('image/icon/gun.png')
const throwSkillRangeConfig = ref({
  // 接入数据库数据
  radius: 30 * 7,
  fill: 'rgba(0,0,0,1)',
  stroke: '#00FFFF',
  strokeWidth: 4,
  name: 'skillThrowRange',
})
const lineEndConfig = ref({
  x: 500,
  y: 300,
  offsetX: 20,
  offsetY: 20,
  width: 40,
  height: 40,
  cornerRadius: 15,
  draggable: true,
  image: locateIcon,
  name: 'lineEndConfig',
})
const lineStartConfig = ref({
  x: 500,
  y: 700,
  width: 40,
  height: 40,
  offsetX: 20,
  offsetY: 20,
  cornerRadius: 5,
  draggable: true,
  image: gun,
  name: 'lineStartConfig',
})
const throwLineConfig = ref({
  stroke: '#00FFFF',
  strokeWidth: 4,
  lineCap: 'round',
  name: 'penetrateLine',
  points: [500, 300, 500, 700],
  dash: [33, 10],
})

//#endregion

//#region 地图和技能选择
// 地图选择
// NOTE 直接在src中写可以使用上下级相对路径，但传入属性时只能从src传入
// const selectWrapperImg = computed(() => `url(map/cover/${mapValue.value}.png)`)
const selectWrapperImg = computed(() => `url(map/cover/breeze.png)`)
let [map1] = useImage(computed(() => `map/detail/${mapValue.value}.png`))
watch(
  map1,
  (newValue) => {
    mapImageConfig.value.image = newValue
  },
  {
    immediate: true,
  },
)
// 技能选择
let lastIndex = -1,
  lastAgent = ''
const skillClick = (index) => {
  if (index == lastIndex && agentValue.value == lastAgent) return
  lastIndex = index
  lastAgent = agentValue.value
  // 通过特工名字和技能代号确定技能类型。skillInfo从1开始标注技能顺序
  skillType.value = skillInfo.find((skill) => skill.agent == agentValue.value && skill.index == index).type
  console.log(skillType.value)
  // line过点清空
  if (['curve', 'polygon', 'control', 'controlStraight'].includes(skillType.value)) {
    controlAnchorList.value.splice(0, controlAnchorList.value.length)
    pointList.splice(0, pointList.length)
    console.log(controlAnchorList.value)
    if (skillType.value == 'control' || skillType.value == 'controlStraight') {
      // 控制类技能先把默认技能图标的位置加入到line的渲染坐标和控制点列表中中。
      pointList.push(200, 200)
      controlAnchorList.value.push({
        x: 200,
        y: 200,
        fill: '#fff',
        stroke: '#000',
        strokeWidth: 2,
        radius: 6,
        name: crypto.randomUUID(),
        draggable: true,
      })
    }
    switch (skillType.value) {
      case 'curve':
        lineType = '.skillCurve'
        break
      case 'polygon':
        lineType = '.skillPolygon'
        break
      case 'control':
        lineType = '.skillControl'
        break
      case 'controlStraight':
        lineType = '.skillControlStraight'
        break
      default:
        lineType = ''
        break
    }
  }
  // 更换载入图片
  skillIndex = index
}
// 开局默认执行一次，传入用户选定的英雄技能，否则line无法重置
skillClick(skillIndex)
const agentSelect = (label) => {
  agentLabel.value = label
  skillSelectIconList.value = [
    `agent/${agentValue.value}/${agentValue.value}_1.webp`,
    `agent/${agentValue.value}/${agentValue.value}_2.webp`,
    `agent/${agentValue.value}/${agentValue.value}_3.webp`,
    `agent/${agentValue.value}/${agentValue.value}_4.webp`,
  ]
  skillSelectAgent.value = `agent/${agentValue.value}/${agentValue.value}.webp`
  skillClick(skillIndex)
}
//#endregion

//#region 设置栏
// 开关按钮
const pointNameVisible = ref(false),
  skillBallVisible = ref(false),
  lightCurtainVisible = ref(false),
  controlAnchorVisible = ref(true),
  skillIconVisible = ref(false)
const controlAnchorVisibleClick = () => {
  const stage = stageRef.value.getNode()
  const type = skillType.value.charAt(0).toUpperCase() + skillType.value.slice(1, skillType.value.length)
  const group = stage.findOne(`.group${type}`)
  const circle = group.find('Circle')
  if (controlAnchorVisible.value) {
    circle.forEach((control) => {
      control.visible(true)
    })
  } else {
    circle.forEach((control) => {
      control.visible(false)
    })
  }
}

//#endregion

//#region 道具信息表单
const editInfoDialogVisible = ref(false)
const toleranceOptions = ref(['高', '中', '低'])
const postureOptions = ref(['站立', '下蹲', '跳投', '跑投', '跑跳投', '其他'])
const postureOthers = ref()
const sovaStrengthMarks = shallowReactive({
  // NOTE shallowReactive: 浅层响应式，只将对象的第一层属性转换为响应式
  1: '力度1',
  2: '力度2',
  3: '力度3',
  4: '力度4',
})
const form = reactive({
  // NOTE reactive只接受对象作为参数，访问的时候不用.value
  title: '',
  description: '',
  tolerance: '',
  strength: 1,
  rebound: 0,
  posture: '',
})
const ruleFormRef = ref()
const rules = reactive({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 30, message: '长度不超过30', trigger: 'blur' },
  ],
})
// 文件列表，选中图片后name和url会添加到这里
const fileList = ref([
  {
    name: '1.jpg',
    url: 'https://tse3.mm.bing.net/th/id/OIP.8ncjEMhKev8s7a8_5aB2MwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    name: '1.jpg',
    url: 'https://tse3.mm.bing.net/th/id/OIP.8ncjEMhKev8s7a8_5aB2MwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    name: '1.jpg',
    url: 'https://tse3.mm.bing.net/th/id/OIP.8ncjEMhKev8s7a8_5aB2MwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
])
// 图片预览
const fillPreviewVisible = ref(false)
const fillPreviewUrl = ref([])
const fillPreviewIndex = ref()
// 文件按钮
const filePreview = (file) => {
  fillPreviewUrl.value = []
  fileList.value.forEach((element) => {
    fillPreviewUrl.value.push(element.url)
  })
  fillPreviewIndex.value = file.index
  fillPreviewVisible.value = true
}
const fileRemove = (file) => {
  fileList.value.splice(file.index, 1)
}
const fillEditIndex = ref(0)
const fileEditVisible = ref(false)
const fileEdit = (file) => {
  fillEditIndex.value = file.index
  fileEditVisible.value = true
}
// 文件限制
const beforeUpload = (file) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  const whiteList = ['png', 'jpg', 'webp', 'jpeg']
  if (whiteList.indexOf(fileSuffix) == -1) {
    ElMessage.error('上传文件只能是图片格式')
    return false
  }
  if (file.size / 1024 / 1024 > 10) {
    ElMessage.error('上传文件大小不能超过10MB')
    return false
  }
}
const exceedLimit = () => {
  ElMessage.error('最多上传6张图片')
}
// 表单提交
const uploadRef = ref()
const submit = async (form) => {
  if (!form) return
  if (fileList.value.length == 0) {
    ElMessage.error('请上传点位示意图')
    return false
  }
  await form.validate((valid, fields) => {
    if (valid) {
      uploadRef.value.submit()
    } else {
      console.log(fields)
    }
  })
}
//#endregion
</script>

<template>
  <div class="container" ref="containerRef">
    <!-- 选择 -->
    <div class="select-aside">
      <!-- 地图选择 -->
      <el-select class="map-select" v-model="mapValue" :show-arrow="false" :offset="7" popper-class="map-select-dropdown" id="selectId">
        <el-option v-for="map in maps" :key="map.value" :label="map.label" :value="map.value">
          <div style="position: relative">
            <!-- TODO width非固定值 -->
            <img :src="`map/cover/${map.value}.png`" style="width: 257px; height: auto; object-fit: cover" />
            <span class="large-text" style="position: absolute; left: 20px">{{ map.label }}</span>
          </div>
        </el-option>
      </el-select>
      <br />
      <!-- 英雄选择 -->
      <div>
        <p class="label-text">选择英雄</p>
        <el-select class="agent-select" v-model="agentValue" :show-arrow="false" :offset="7" popper-class="agent-select-dropdown">
          <el-option
            v-for="agent in agents"
            :key="agent.value"
            :label="agent.label"
            :value="agent.value"
            @click="agentSelect(agent.label)"
          ></el-option>
        </el-select>
      </div>
      <br />
      <div class="row">
        <img class="agent-icon" :src="skillSelectAgent" />
        <span class="agent-name"
          ><strong>{{ agentLabel }}</strong></span
        >
      </div>
      <br />
      <!-- 技能选择 -->
      <div class="row-space">
        <div class="skills">
          <img class="skill-icon" :src="skillSelectIconList[0]" @click="skillClick(1)" />
        </div>
        <div class="skills">
          <img class="skill-icon" :src="skillSelectIconList[1]" @click="skillClick(2)" />
        </div>
        <div class="skills">
          <img class="skill-icon" :src="skillSelectIconList[2]" @click="skillClick(3)" />
        </div>
        <div class="skills">
          <img class="skill-icon" :src="skillSelectIconList[3]" @click="skillClick(4)" />
        </div>
      </div>
      <br /><br />
      <!-- 收藏点位 -->
      <el-button class="show-collect" color="#363636" @click="editInfoDialogVisible = true">
        <template #default>
          上传<el-icon class="el-icon--right"><Star /></el-icon>
        </template>
      </el-button>
    </div>
    <!-- 地图 -->
    <div class="map-container" ref="mapContainerRef" @contextmenu.prevent>
      <v-stage ref="stageRef" :config="stageConfig" @wheel="handleWheel($event, stageRef)">
        <v-layer>
          <v-group :config="mapContainerGroupCfg" @click="addNewControlAnchor($event)">
            <v-group :config="mapImgGroupCfg">
              <!-- 背景地图 -->
              <v-image :config="mapImageConfig" />
            </v-group>
            <v-group :config="skillGroupConfig">
              <v-group :config="{ name: 'groupThrow' }">
                <v-line :config="throwLineConfig" />
                <v-image :config="lineStartConfig" @dragmove="dragLineBothEnd(stageRef, '.penetrateLine', '.lineStartConfig', '.lineEndConfig')" />
                <v-image :config="lineEndConfig" @dragmove="dragLineBothEnd(stageRef, '.penetrateLine', '.lineStartConfig', '.lineEndConfig')" />
              </v-group>
            </v-group>
          </v-group>
        </v-layer>
      </v-stage>
      <div class="map-adjust-button">
        <el-button class="map-reset" @click="resetMap(stageRef)" color="#363636" :icon="RefreshRight" type="info" />
        <br />
        <el-button-group direction="vertical">
          <el-button class="map-reset" @click="mapRotate(90, stageRef)" color="#363636" :icon="RotateRight" type="info" />
          <el-button class="map-reset" @click="mapRotate(-90, stageRef)" color="#363636" :icon="RotateLeft" type="info" />
        </el-button-group>
        <br />
        <el-button-group direction="vertical">
          <el-button class="map-reset" @click="mapZoomButton(1, stageRef)" color="#363636" :icon="Plus" type="info" />
          <el-button class="map-reset" @click="mapZoomButton(-1, stageRef)" color="#363636" :icon="Minus" type="info" />
        </el-button-group>
      </div>
    </div>
    <!-- 道具信息表单 -->
    <el-dialog class="lineup-dialog" v-model="editInfoDialogVisible" width="50%" title="A厅探测箭" :show-close="false">
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
      <div class="lineup-dialog-main" style="max-width: 600px">
        <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="auto" label-position="left" size="large" style="margin-bottom: 40px">
          <el-form-item label="标题" prop="title">
            <el-input class="dark" v-model="form.title" placeholder="如“A大防前压箭”"></el-input>
          </el-form-item>
          <el-form-item label="道具描述" class="default-text">
            <el-input class="dark" v-model="form.description" placeholder="如“开局射，帮助队友抢A大”"></el-input>
          </el-form-item>
          <el-form-item label="容错率">
            <el-segmented v-model="form.tolerance" :options="toleranceOptions" />
          </el-form-item>
          <el-form-item label="出手方式">
            <el-segmented v-model="form.posture" :options="postureOptions" />
            <el-input v-model="postureOthers" v-if="form.posture == '其他'" placeholder="请补充其他出手方式"></el-input>
          </el-form-item>
          <el-form-item label="蓄力反弹" class="slider-demo-block" style="margin-bottom: 40px">
            <div class="flex-center" style="width: 100%">
              <el-slider v-model="form.strength" :marks="sovaStrengthMarks" step="mark" :min="1" :max="4" />
              <el-input-number v-model="form.rebound" :min="0" :max="2" style="width: 250px">
                <template #suffix>
                  <span>反弹</span>
                </template>
              </el-input-number>
            </div>
          </el-form-item>
          <el-form-item label="点位图片">
            <div>拖拽文件或者点击上传，大小不超过10MB。点击编辑按钮可为图片添加标注。</div>
            <el-upload
              action="#"
              ref="uploadRef"
              list-type="picture-card"
              :auto-upload="false"
              v-model:file-list="fileList"
              drag
              multiple
              :limit="6"
              :on-exceed="exceedLimit"
              :before-upload="beforeUpload"
            >
              <el-icon><Plus /></el-icon>
              <!-- NOTE 插槽作用域，解决通信问题，根据elem文档中对应插槽是否提供类型 -->
              <template #file="file">
                <img class="el-upload-list__item-thumbnail" :src="file.file.url" />
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview">
                    <i class="el-icon el-icon--zoom-in" @click="fileEdit(file)"> <Edit /></i>
                  </span>
                  <span class="el-upload-list__item-preview">
                    <i class="el-icon el-icon--zoom-in" @click="filePreview(file)"> <ZoomIn /></i>
                  </span>
                  <span class="el-upload-list__item-delete" @click="fileRemove(file)">
                    <i class="el-icon el-icon--zoom-in"> <Delete /></i>
                  </span>
                </span>
              </template>
            </el-upload>
            <el-input v-if="fileEditVisible" v-model="fileList[fillEditIndex].tips" placeholder="为图片添加说明"></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="success" @click="submit(ruleFormRef)" style="width: 100%">上传</el-button>
          </el-form-item>
        </el-form>
        <el-image-viewer
          v-if="fillPreviewVisible"
          @close="fillPreviewVisible = false"
          :url-list="fillPreviewUrl"
          :zoom-rate="1.2"
          :max-scale="2"
          :min-scale="0.5"
          :initial-index="fillPreviewIndex"
          show-progress
        />
      </div>
    </el-dialog>
    <!-- 设置 -->
    <settingBar :stage="stageRef" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
  // align-content: center;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid red;
  background: url('decorate/bg.webp');
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.map-container {
  height: 100%;
  width: 100%;
  min-width: 650px;
  overflow: hidden;
  position: relative;

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
  }

  .show-collect {
    width: 100%;
    height: 40px;
    font-size: 20px;
    // --el-button-bg-color: #363636;
    --el-button-border-color: rgba(0, 0, 0, 0);
  }
}

.lineup-dialog {
  .lineup-dialog-main {
    max-height: calc(90vh - 20px);
    overflow: scroll;
  }
  .lineup-dialog-main::-webkit-scrollbar {
    display: none;
  }

  .slider-demo-block {
    max-width: 600px;
    display: flex;
    align-items: center;
  }

  .slider-demo-block .el-slider {
    margin-top: 0;
    margin-left: 12px;
    margin-right: 30px;
  }

  .slider-demo-block + .slider-demo-block {
    // margin-top: 20px;
  }
}
</style>
<style lang="scss">
.map-select {
  .el-select__wrapper {
    min-height: 100px;
    height: 100px;
    background-image: v-bind(selectWrapperImg) !important;
    background-repeat: no-repeat;
    background-size: cover;
    font-size: 27px;
    font-weight: bold;
    line-height: 27px;
  }

  .el-select__placeholder {
    color: #fff;
  }
}
.map-select-dropdown {
  --el-popper-bg-color-light: #1a1a1a !important;
  --el-border-color-light: rgba(0, 0, 0, 0);

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
    padding: 0 0;
    // background-image: url('../../assets/map/cover/bind.png');
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

.lineup-dialog {
  min-width: 1000px;
  margin: 0 auto !important;
  margin-top: 30px !important;
  max-height: 90vh;
  overflow: hidden;
  --el-dialog-bg-color: #1a1a1a !important;
}
</style>
