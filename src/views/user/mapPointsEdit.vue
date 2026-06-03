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
import settingBar from './user/public/settingBar.vue'
import { useAgentSelectStore } from '@/store/user'
import { storeToRefs } from 'pinia'
//#region 地图、特工、技能信息
const selectStore = useAgentSelectStore()
const { mapValue, agentValue, agentLabel } = storeToRefs(selectStore)
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
  name: 'stage',
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

//#region 文本编辑
// TODO 读取进来
const textArray = ref([
  {
    x: 500,
    y: 500,
    fontSize: 20,
    text: 'B区 拐角',
    fontStyle: 'bold',
    fill: '#fff',
    fontFamily: 'Microsoft JhengHei',
    draggable: true,
    name: crypto.randomUUID(),
  },
])
const pointsNameInput = ref('')
const transformerConfig = ref({
  enabledAnchors: ['middle-left', 'middle-right'],
  rotationSnaps: [0, 90, 180, 270],
  rotationSnapTolerance: 10,
  anchorFill: 'rgba(255,255,255,0)',
  anchorStroke: '#fff',
  anchorStrokeWidth: 2,
  anchorSize: 9,
  anchorCornerRadius: 4.5,
})
const transformerRef = ref(null)
let isFocus = null,
  editType = null
const Focus = (e, type) => {
  if (type == 'attackRect' || type == 'defendRect') transformerConfig.value.enabledAnchors = ['middle-left', 'middle-right']
  else transformerConfig.value.enabledAnchors = []
  const node = e.currentTarget
  transformerRef.value.getNode().nodes([node])
  isFocus = node
  editType = type
  if (type == 'text') pointsNameInput.value = node.text()
  else pointsNameInput.value = null
}
const stageUnFocus = (e) => {
  if (['mapImage', 'stage'].includes(e.target.name()) && isFocus != null) {
    transformerRef.value.getNode().nodes([])
    pointsNameInput.value = null
    isFocus = null
  }
}
const pointsNameInputing = () => {
  isFocus.text(pointsNameInput.value)
}
const addPointText = () => {
  textArray.value.push({
    x: 500,
    y: 500,
    fontSize: 22,
    text: '测试2222测试',
    fill: '#fff',
    draggable: true,
    name: crypto.randomUUID(),
  })
}

//#endregion

//#region 终极宝珠

//#region 终极宝珠
let [skillBallImg] = useImage('image/icon/skillBall.png')
const skillBallArray = ref([
  {
    x: 300,
    y: 300,
    width: 20,
    height: 20,
    offset: { x: 10, y: 10 },
    cornerRadius: 10,
    draggable: true,
    image: skillBallImg,
    name: crypto.randomUUID(),
  },
])
const addSkillBall = () => {
  skillBallArray.value.push({
    x: 300,
    y: 300,
    width: 20,
    height: 20,
    offset: { x: 10, y: 10 },
    cornerRadius: 10,
    draggable: true,
    image: skillBallImg,
    name: crypto.randomUUID(),
  })
}
//#endregion

//#region 开局屏障
// TODO 参考,throw和circle的处理
const attackBarrierArray = ref([
  {
    x: 600,
    y: 600,
    width: 70,
    height: 13,
    fill: 'rgba(253, 68,83,0.8)',
    draggable: true,
    name: crypto.randomUUID(),
  },
])
const defendBarrierArray = ref([
  {
    x: 600,
    y: 700,
    width: 70,
    height: 13,
    fill: 'rgba(102,229,218,0.8)',
    draggable: true,
    name: crypto.randomUUID(),
  },
])
const addAttackBarrier = () => {
  attackBarrierArray.value.push({
    x: 600,
    y: 600,
    width: 70,
    height: 13,
    fill: 'rgba(253, 68,83,0.8)',
    draggable: true,
    name: crypto.randomUUID(),
  })
}
const addDefendBarrier = () => {
  defendBarrierArray.value.push({
    x: 600,
    y: 700,
    width: 70,
    height: 13,
    fill: 'rgba(102,229,218,0.8)',
    draggable: true,
    name: crypto.randomUUID(),
  })
}
//#endregion

//#endregion

//#region 删除和提交
const deleteNode = () => {
  const name = isFocus.name()
  let index
  switch (editType) {
    case 'text':
      index = textArray.value.indexOf(name)
      textArray.value.splice(index, 1)
      break
    case 'image':
      index = skillBallArray.value.indexOf(name)
      skillBallArray.value.splice(index, 1)
      break
    case 'attackRect':
      index = attackBarrierArray.value.indexOf(name)
      attackBarrierArray.value.splice(index, 1)
      break
    case 'defendRect':
      index = defendBarrierArray.value.indexOf(name)
      defendBarrierArray.value.splice(index, 1)
      break
    default:
      break
  }
}
//#endregion

//#region 地图选择
const selectWrapperImg = computed(() => `url(map/cover/${mapValue.value}.png)`)
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
      <br />
      <div class="button-group">
        <div>
          <el-button size="large" @click="addPointText">地图标点</el-button>
          <el-input v-model="pointsNameInput" @input="pointsNameInputing"></el-input>
        </div>
        <div>
          <el-button size="large" @click="addSkillBall">终极宝珠</el-button>
        </div>
        <div>
          <el-button size="large" @click="addAttackBarrier">进攻方屏障</el-button>
        </div>
        <div>
          <el-button size="large" @click="addDefendBarrier">防守方方屏障</el-button>
        </div>
        <div>
          <el-button size="large" @click="deleteNode">删除</el-button>
        </div>
        <div>
          <el-button size="large" @click="submit">确认修改</el-button>
        </div>
      </div>
    </div>
    <!-- 地图 -->
    <div class="map-container" ref="mapContainerRef" @contextmenu.prevent>
      <v-stage ref="stageRef" :config="stageConfig" @wheel="handleWheel($event, stageRef)" @click="stageUnFocus">
        <v-layer>
          <v-group :config="mapContainerGroupCfg">
            <v-group :config="mapImgGroupCfg">
              <!-- 背景地图 -->
              <v-image :config="mapImageConfig" />
              <v-text :config="text" @click="Focus($event, 'text')" v-for="text in textArray" :key="text.name" />
              <v-image :config="skillBall" @click="Focus($event, 'image')" v-for="skillBall in skillBallArray" :key="skillBall.name" />
              <v-rect :config="barrier" @click="Focus($event, 'attackRect')" v-for="barrier in attackBarrierArray" :key="barrier.name" />
              <v-rect :config="barrier" @click="Focus($event, 'defendRect')" v-for="barrier in defendBarrierArray" :key="barrier.name" />
              <v-transformer :config="transformerConfig" ref="transformerRef" />
            </v-group>
            <v-group :config="skillGroupConfig">
              <!-- <v-text :config="text" @click="Focus($event, 'text')" v-for="text in textArray" :key="text.name" />
              <v-image :config="skillBall" @click="Focus($event, 'image')" v-for="skillBall in skillBallArray" :key="skillBall.name" />
              <v-rect :config="barrier" @click="Focus($event, 'attackRect')" v-for="barrier in attackBarrierArray" :key="barrier.name" />
              <v-rect :config="barrier" @click="Focus($event, 'defendRect')" v-for="barrier in defendBarrierArray" :key="barrier.name" />
              <v-transformer :config="transformerConfig" ref="transformerRef" /> -->
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
  width: 300px;
  padding: 10px 20px;
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

  .button-group {
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .el-button {
      font-size: 16px;
      width: 300px;
    }
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
