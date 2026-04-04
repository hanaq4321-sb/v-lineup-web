<script setup>
import { ref, onMounted, reactive, shallowReactive, onBeforeUnmount, computed } from 'vue'
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

//#region 地图和特工信息
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
const agentValue = ref('harbor')
const agentLabel = ref('海神')
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
const skillSelectIconList = ref([
  `/src/assets/agent/${agentValue.value}/${agentValue.value}_1.webp`,
  `/src/assets/agent/${agentValue.value}/${agentValue.value}_2.webp`,
  `/src/assets/agent/${agentValue.value}/${agentValue.value}_3.webp`,
  `/src/assets/agent/${agentValue.value}/${agentValue.value}_4.webp`,
])
const skillSelectAgent = ref(`/src/assets/agent/${agentValue.value}/${agentValue.value}.webp`)
const skillInfo = [
  {
    agent: 'sova',
    index: 1,
    type: 'control',
  },
  {
    agent: 'sova',
    index: 2,
    type: 'throw',
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
    type: 'control',
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
]
const skillType = ref('curve')
//#endregion

//#region 地图和技能选择
// 技能选择
const agentSelect = (label) => {
  agentLabel.value = label
  skillSelectIconList.value = [
    `/src/assets/agent/${agentValue.value}/${agentValue.value}_1.webp`,
    `/src/assets/agent/${agentValue.value}/${agentValue.value}_2.webp`,
    `/src/assets/agent/${agentValue.value}/${agentValue.value}_3.webp`,
    `/src/assets/agent/${agentValue.value}/${agentValue.value}_4.webp`,
  ]
  skillSelectAgent.value = `/src/assets/agent/${agentValue.value}/${agentValue.value}.webp`
}
const skillClick = (index) => {
  // 通过特工名字和技能代号确定技能类型
  skillType.value = skillInfo.find((skill) => skill.agent == agentValue.value && skill.index == index).type
  console.log(skillType.value)
}
//#endregion

//#region 画布
const getImageUrl = (url) => {
  return new URL(url, import.meta.url).href
}
const containerRef = ref()
const mapContainerRef = ref()
const stageRef = ref()
const stageConfig = ref({
  x: 0,
  y: 0,
})
const groupConfig = ref({
  x: 0,
  y: 0,
  draggable: false,
  scaleX: 1,
  scaleY: 1,
  name: 'mapGroup',
  stroke: 'red',
  strokeWidth: 2,
})
const [map] = useImage(getImageUrl('../../assets/map/detail/breeze.png'))
const mapImageConfig = ref({
  x: 0,
  y: 0,
  image: map,
  name: 'mapImage',
})
//#region 窗口尺寸监听
const observer = new ResizeObserver(() => {
  // 画布尺寸随窗口变化
  const stage = stageRef.value.getNode()
  stage.width(mapContainerRef.value.clientWidth)
  stage.height(mapContainerRef.value.clientHeight)
  // 中间地图group随窗口缩放,尺寸不变化。
  // NOTE scale可以使内部所有组件一起缩放，并且相对位置不变
  const group = stage.findOne('.mapGroup')
  let scaleY = mapContainerRef.value.clientHeight / group.height()
  group.scale({ x: scaleY, y: scaleY })
  group.position({ x: mapContainerRef.value.clientWidth / 2, y: mapContainerRef.value.clientHeight / 2 })
})
onMounted(() => {
  observer.observe(containerRef.value)
  const stage = stageRef.value.getNode()
  const group = stage.findOne('.mapGroup')
  // 通过一开始的页面尺寸固定调整scale缩放来实现窗口适应
  group.width(mapContainerRef.value.clientHeight)
  group.height(mapContainerRef.value.clientHeight)
  group.offset({ x: group.width() / 2, y: group.height() / 2 })
  const mapImage = stage.findOne('.mapImage')
  mapImage.width(mapContainerRef.value.clientHeight)
  mapImage.height(mapContainerRef.value.clientHeight)
  // stage.batchDraw()
})
onBeforeUnmount(() => {
  // NOTE 在组件销毁时应该销毁监听器，否则页面重新加载时会导致上一个监听器获取不到还未加载完的界面
  observer.disconnect()
})
//#endregion

//#region 直线技能
const rangeConfig = ref({
  // 接入数据库数据
  radius: 100,
  fill: 'rgba(0,0,0,0.3)',
  // 根据角色颜色
  stroke: '#6c7dff',
  strokeWidth: 2,
  name: 'skillRange',
})
const [agent] = useImage(getImageUrl('../../assets/agent/sova/sova.webp'))
const agentConfig = ref({
  width: 30,
  height: 30,
  // TODO offset值修改为大小的一半
  offsetX: 15,
  offsetY: 15,
  cornerRadius: 5,
  fill: '#6c7dff',
  image: agent,
  draggable: true,
  visible: false,
  name: 'skillAgent',
})
const lineConfig = ref({
  stroke: '#6c7dff',
  strokeWidth: 2,
  lineCap: 'round',
  name: 'skillLine',
  visible: false,
  points: [1, 1, 2, 2],
})
const [skill] = useImage(getImageUrl('../../assets/agent/sova/sova_3.webp'))
const skillIconConfig = ref({
  offsetX: 15,
  offsetY: 15,
  width: 30,
  height: 30,
  cornerRadius: 15,
  image: skill,
  name: 'skillIcon',
})
const skillCenterConfig = ref({
  radius: 5,
  fill: '#6c7dff',
})
const skillGroupConfig = ref({
  draggable: true,
  visible: false,
  name: 'skillGroup',
})
const editLineUp = () => {
  const stage = stageRef.value.getNode()
  const group = stage.findOne('.mapGroup')
  const skillGroup = stage.findOne('.skillGroup')
  const skillAgent = stage.findOne('.skillAgent')
  const skillLine = stage.findOne('.skillLine')
  skillGroup.visible(true).position({ x: group.width() / 2, y: group.height() / 2 })
  skillAgent.visible(true).position({ x: group.width() / 2, y: group.height() / 2 + 200 })
  skillLine.visible(true).points([skillGroup.position().x, skillGroup.position().y, skillAgent.position().x, skillAgent.position().y])
}
const dragIcon = () => {
  const stage = stageRef.value.getNode()
  const skillLine = stage.findOne('.skillLine')
  const skillAgent = stage.findOne('.skillAgent')
  const skillGroup = stage.findOne('.skillGroup')
  skillLine.points([skillGroup.position().x, skillGroup.position().y, skillAgent.position().x, skillAgent.position().y])
}
//#endregion

//#region 曲线技能
const curveConfig = ref({
  stroke: 'blue',
  strokeWidth: 4,
  lineCap: 'round',
  tension: 0.4,
  name: 'skillCurve',
})
const curveControlList = ref([])
const pointList = []
const curveClick = (e) => {
  // NOTE konva访问常规事件属性要加evt
  if (skillType.value != 'curve' || e.evt.button == 2) return
  const stage = stageRef.value.getNode()
  const group = stage.findOne('.mapGroup')
  const curve = stage.findOne('.skillCurve')
  pointList.push(group.getRelativePointerPosition().x, group.getRelativePointerPosition().y)
  curve.points(pointList)
  curveControlList.value.push({
    x: group.getRelativePointerPosition().x,
    y: group.getRelativePointerPosition().y,
    fill: '#ff4655',
    radius: 6,
    name: Date.now().toString(),
    draggable: true,
  })
}
const curveControlDrag = (name) => {
  const index = curveControlList.value.findIndex((e) => e.name == name)
  const stage = stageRef.value.getNode()
  const curve = stage.findOne('.skillCurve')
  const circle = stage.findOne(`.${name}`)
  pointList.splice(index * 2, 2, circle.position().x, circle.position().y)
  curve.points(pointList)
}
// 右键菜单
const editMenuVisible = ref(false)
const deleteVisible = ref(false)
const insertVisible = ref(false)
const menuPosition = ref({ x: 0, y: 0 })
let tempIndex = 0
const curveMenu = (e) => {
  editMenuVisible.value = true
  deleteVisible.value = false
  insertVisible.value = true
  menuPosition.value = { x: e.evt.clientX + 4, y: e.evt.clientY + 4 }
}
const insertControl = () => {
  editMenuVisible.value = false
  const stage = stageRef.value.getNode()
  const group = stage.findOne('.mapGroup')
  const curve = stage.findOne('.skillCurve')
  const x = group.getRelativePointerPosition().x,
    y = group.getRelativePointerPosition().y
  let i = 0
  for (i = 0; i < pointList.length; i = i + 2) {
    if (
      ((x > pointList[i] && x < pointList[i + 2]) || (x < pointList[i] && x > pointList[i + 2])) &&
      ((y > pointList[i + 1] && y < pointList[i + 3]) || (y < pointList[i + 1] && y > pointList[i + 3]))
    ) {
      break
    }
  }
  pointList.splice(i + 2, 0, x, y)
  curve.points(pointList)
  curveControlList.value.splice(i / 2 + 1, 0, {
    x: x,
    y: y,
    fill: '#ff4655',
    radius: 6,
    name: Date.now().toString(),
    draggable: true,
  })
}
const curveControlMenu = (name, e) => {
  editMenuVisible.value = true
  deleteVisible.value = true
  insertVisible.value = false
  menuPosition.value = { x: e.evt.clientX + 4, y: e.evt.clientY + 4 }
  tempIndex = curveControlList.value.findIndex((e) => e.name == name)
}
const deleteControl = () => {
  editMenuVisible.value = false
  const stage = stageRef.value.getNode()
  const curve = stage.findOne('.skillCurve')
  curveControlList.value.splice(tempIndex, 1)
  pointList.splice(tempIndex * 2, 2)
  curve.points(pointList)
}

//#endregion

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
        <div class="skills" @click="editLineUp()">
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
    <!-- 画布 -->
    <div class="map-container" ref="mapContainerRef" @contextmenu.prevent>
      <v-stage ref="stageRef" :config="stageConfig">
        <v-layer>
          <v-group :config="groupConfig" @click="curveClick">
            <!-- 背景地图 -->
            <v-image :config="mapImageConfig" />
            <!-- throw型 -->
            <v-group v-if="skillType == 'throw'">
              <!-- 连线 -->
              <v-line :config="lineConfig" />
              <!-- 特工图标 -->
              <v-image :config="agentConfig" @dragmove="dragIcon" />
              <v-group :config="skillGroupConfig" @dragmove="dragIcon">
                <!-- 技能范围 -->
                <v-circle :config="rangeConfig" />
                <!-- 技能图标 -->
                <!-- <v-image :config="skillIconConfig" /> -->
                <!-- 技能中心点 -->
                <v-circle :config="skillCenterConfig" />
              </v-group>
            </v-group>
            <!-- curve型 -->
            <v-group v-if="skillType == 'curve'">
              <v-line :config="curveConfig" @contextmenu="curveMenu($event)" />
              <v-circle
                v-for="circle in curveControlList"
                :config="circle"
                @dragmove="curveControlDrag(circle.name)"
                @contextmenu="curveControlMenu(circle.name, $event)"
              />
              <!-- 右键菜单 -->
              <div
                v-if="editMenuVisible"
                :style="{
                  position: 'absolute',
                  left: menuPosition.x + 'px',
                  top: menuPosition.y + 'px',
                  width: '60px',
                  backgroundColor: '#1a1a1a',
                  boxShadow: '0 0 5px grey',
                  zIndex: 99,
                }"
              >
                <button
                  v-if="insertVisible"
                  :style="{ width: '100%', backgroundColor: '#363636', border: 'none', margin: 0, padding: '10px', cursor: 'pointer' }"
                  @mouseover="(e) => (e.target.style.backgroundColor = '#686767')"
                  @mouseout="(e) => (e.target.style.backgroundColor = '#363636')"
                  @click="insertControl"
                >
                  插入
                </button>
                <button
                  v-if="deleteVisible"
                  :style="{ width: '100%', backgroundColor: '#363636', border: 'none', margin: 0, padding: '10px', cursor: 'pointer' }"
                  @mouseover="(e) => (e.target.style.backgroundColor = '#686767')"
                  @mouseout="(e) => (e.target.style.backgroundColor = '#363636')"
                  @click="deleteControl"
                >
                  删除
                </button>
                <button
                  :style="{ width: '100%', backgroundColor: '#363636', border: 'none', margin: 0, padding: '10px', cursor: 'pointer' }"
                  @mouseover="(e) => (e.target.style.backgroundColor = '#686767')"
                  @mouseout="(e) => (e.target.style.backgroundColor = '#363636')"
                  @click="editMenuVisible = false"
                >
                  取消
                </button>
              </div>
            </v-group>
          </v-group>
        </v-layer>
      </v-stage>
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
              <!-- NOTE 插槽作用域，解决通信问题 -->
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
  align-content: center;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid red;
  background: url('../../assets/bg.webp');
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.map-container {
  height: 100%;
  width: 100%;
  min-width: 650px;
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
  }

  .show-collect {
    width: 100%;
    height: 40px;
    font-size: 20px;
    // --el-button-bg-color: #363636;
    --el-button-border-color: rgba(0, 0, 0, 0);
  }
}

.setting-bar {
  height: 100%;
  min-width: 300px;
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

.lineup-dialog {
  min-width: 1000px;
  margin: 0 auto !important;
  margin-top: 30px !important;
  max-height: 90vh;
  overflow: hidden;
  --el-dialog-bg-color: #1a1a1a !important;
}
</style>
