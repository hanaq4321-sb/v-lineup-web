<script setup>
import { insertOrUpdateMapService, getService, deleteNodeService } from '@/api/map-editor.js'
import { ref, onMounted, reactive, shallowReactive, onBeforeUnmount, computed, watch } from 'vue'
import { useImage } from 'vue-konva'
import { RefreshRight, Plus, Minus, CloseBold, ZoomIn, Delete, Edit } from '@element-plus/icons-vue'
import { ElEmpty, ElMessage } from 'element-plus'
import Konva from 'konva'
import { mapDraggable, controlMapDraggable, handleWheel, mapZoomButton, mapRotate, resetMap } from '@/styles/js/map-adjust'
import RotateRight from '~icons/ix/rotate-90-right'
import RotateLeft from '~icons/ix/rotate-90-left'
import settingBar from './public/settingBar.vue'
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
const textArray = ref([])
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
let addNodeTemp = []
const addPointText = () => {
  textArray.value.push({
    x: 500,
    y: 500,
    text: '请输入点位',
    fontSize: 18,
    fontStyle: 'bold',
    fill: '#fff',
    fontFamily: 'Microsoft JhengHei',
    draggable: true,
    id: 'point',
    name: crypto.randomUUID(),
  })
  addNodeTemp.push(textArray.value[textArray.value.length - 1].name)
}

//#endregion

//#region 终极宝珠
let [skillBallImg] = useImage('image/icon/skillBall.png')
const skillBallArray = ref([])
const addSkillBall = () => {
  skillBallArray.value.push({
    x: 300,
    y: 300,
    width: 18,
    height: 18,
    offset: { x: 9, y: 9 },
    cornerRadius: 9,
    draggable: true,
    image: skillBallImg,
    id: 'skillBall',
    name: crypto.randomUUID(),
  })
  addNodeTemp.push(skillBallArray.value[skillBallArray.value.length - 1].name)
}
//#endregion

//#region 开局屏障
// TODO 重置就是直接为0，不to了
const attackBarrierArray = ref([])
const defendBarrierArray = ref([])
const addAttackBarrier = () => {
  attackBarrierArray.value.push({
    x: 600,
    y: 600,
    width: 70,
    height: 13,
    fill: 'rgba(253, 68,83,0.8)',
    draggable: true,
    id: 'attackBarrier',
    name: crypto.randomUUID(),
  })
  addNodeTemp.push(attackBarrierArray.value[attackBarrierArray.value.length - 1].name)
}
const addDefendBarrier = () => {
  defendBarrierArray.value.push({
    x: 600,
    y: 700,
    width: 70,
    height: 13,
    fill: 'rgba(102,229,218,0.8)',
    draggable: true,
    id: 'defendBarrier',
    name: crypto.randomUUID(),
  })
  addNodeTemp.push(defendBarrierArray.value[defendBarrierArray.value.length - 1].name)
}
//#endregion
// BUG 浏览器收缩导致settingbar消失
//#endregion

//#region 地图切换、删除、提交
const selectWrapperImg = computed(() => `url(map/cover/${mapValue.value}.png)`)
let [map1] = useImage(computed(() => `map/detail/${mapValue.value}.png`))
watch(
  map1,
  async (newValue) => {
    mapImageConfig.value.image = newValue
    // NOTE 不能连等，会导致对象相同
    // TODO 空值处理，地图默认角度
    attackBarrierArray.value = []
    defendBarrierArray.value = []
    textArray.value = []
    skillBallArray.value = []
    const result = await getService(selectStore.mapValue)
    if (result.code == 0) {
      const pointList = result.data.pointList
      const barrierList = result.data.barrierList
      const skillBallList = result.data.skillBallList
      pointList.forEach((e) => {
        textArray.value.push({
          ...e,
          fontSize: 18,
          fontStyle: 'bold',
          fill: '#fff',
          fontFamily: 'Microsoft JhengHei',
          draggable: true,
          id: 'point',
          name: e.uuid,
        })
      })
      barrierList.forEach((e) => {
        if (e.side == 1) {
          attackBarrierArray.value.push({
            ...e,
            width: 70,
            height: 13,
            fill: 'rgba(253,68,83,0.8)',
            draggable: true,
            id: 'attackBarrier',
            name: e.uuid,
          })
        } else {
          defendBarrierArray.value.push({
            ...e,
            width: 70,
            height: 13,
            fill: 'rgba(102,229,218,0.8)',
            draggable: true,
            id: 'defendBarrier',
            name: e.uuid,
          })
        }
      })
      skillBallList.forEach((e) => {
        skillBallArray.value.push({
          ...e,
          width: 18,
          height: 18,
          offset: { x: 9, y: 9 },
          cornerRadius: 9,
          draggable: true,
          image: skillBallImg,
          id: 'skillBall',
          name: e.uuid,
        })
      })
    } else {
      console.log(result.msg)
      ElMessage.error('获取地图编辑信息失败')
    }
  },
  {
    immediate: true,
  },
)
// BUG 必须要三个一起穿，传一个后端没处理
const submit = async () => {
  let pointJson = [],
    barrierJson = [],
    skillBallJson = []
  const stage = stageRef.value.getNode()
  const point = stage.find('#point')
  const skillBall = stage.find('#skillBall')
  const attackBarrier = stage.find('#attackBarrier')
  const defendBarrier = stage.find('#defendBarrier')
  point.forEach((e) => {
    pointJson.push({
      uuid: e.name(),
      ...e.position(),
      text: e.text(),
      mapId: selectStore.mapValue,
    })
  })
  skillBall.forEach((e) => {
    skillBallJson.push({
      uuid: e.name(),
      ...e.position(),
      mapId: selectStore.mapValue,
    })
  })
  attackBarrier.forEach((e) => {
    barrierJson.push({
      uuid: e.name(),
      ...e.position(),
      rotation: e.rotation(),
      scaleX: e.scaleX(),
      side: 1,
      mapId: selectStore.mapValue,
    })
  })
  defendBarrier.forEach((e) => {
    barrierJson.push({
      uuid: e.name(),
      ...e.position(),
      rotation: e.rotation(),
      scaleX: e.scaleX(),
      side: 0,
      mapId: selectStore.mapValue,
    })
  })
  const result = await insertOrUpdateMapService(pointJson, barrierJson, skillBallJson)
  if (result.code == 0) {
    //将新节点列表置空，方便删除
    addNodeTemp = []
    ElMessage.success('上传成功')
  } else {
    console.log(result.msg)
    ElMessage.error('上传失败')
  }
}
const deleteNode = async () => {
  if (isFocus == null) {
    ElMessage.error('请先选中')
    return
  }
  const name = isFocus.name()
  console.log('name' + name)
  transformerRef.value.getNode().nodes([])
  let index
  let nodeAryayIndex = addNodeTemp.indexOf(name)
  // 不在新添加的数组中，后端删除
  if (nodeAryayIndex == -1) {
    console.log('old')
    const result = await deleteNodeService(name, editType)
    if (result.code == 0) {
      ElMessage.success('删除成功')
    } else {
      console.log(result.msg)
      ElMessage.error('删除失败')
    }
  } else {
    console.log('new')
    addNodeTemp.splice(nodeAryayIndex, 1)
  }
  switch (editType) {
    case 'text':
      index = textArray.value.findIndex((e) => e.name == name)
      console.log(index)
      // console.log(textArray.value[index].text)
      textArray.value.splice(index, 1)
      break
    case 'image':
      index = skillBallArray.value.findIndex((e) => e.name == name)
      skillBallArray.value.splice(index, 1)
      break
    case 'attackRect':
      index = attackBarrierArray.value.findIndex((e) => e.name == name)
      attackBarrierArray.value.splice(index, 1)
      break
    case 'defendRect':
      index = defendBarrierArray.value.findIndex((e) => e.name == name)
      defendBarrierArray.value.splice(index, 1)
      break
    default:
      break
  }
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
