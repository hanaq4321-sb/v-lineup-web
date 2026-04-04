<script setup>
import { ref, onMounted } from 'vue'
import { useImage } from 'vue-konva'
// import { Stage as VStage, Layer as VLayer, Circle as VCircle } from 'vue-konva'
// onMounted才能获取到
const stage = ref()
const layer = ref()
const list = ref([])
const dragItemId = ref(null)
const stageSize = {
  width: 600,
  height: 600,
}
// const starStyle = {
//   x: item.x,
//   y: item.y,
//   rotation: item.rotation,
//   id: item.id,
//   numPoints: 5,
//   innerRadius: 30,
//   outerRadius: 50,
//   fill: '#89b717',
//   opacity: 0.8,
//   draggable: true,
//   // 拖动时放大
//   scaleX: dragItemId === item.id ? item.sclae * 1.2 : item.scale,
//   scaleY: dragItemId === item.id ? item.sclae * 1.2 : item.scale,
//   shadowColor: 'yellow',
//   shadowBlur: 10,
//   // 拖动时阴影放大
//   shadowOffsetX: dragItemId === item.id ? 15 : 5,
//   shadowOffsetY: dragItemId === item.id ? 15 : 5,
//   shadowOpacity: 0.6,
// }

const handleDragStart = (e) => {
  // 获取当前拖动对象的dom,返回子元素的id
  dragItemId.value = e.target.id()
  // 根据元素即config的ID定位元素在数组中的位置
  // NOTE .find()会遍历数组，返回第一个使回调函数为true的元素。i代表当前遍历到的元素，箭头函数接收i，返回是否与value相等
  // 获取数组中存储的元素的config
  const item = list.value.find((i) => i.id === dragItemId.value)
  // 获取对应元素在数组中的索引
  const index = list.value.indexOf(item)
  // 删除list中索引为index的元素，删除一次
  list.value.splice(index, 1)
  // 把元素放到最后，使其最后渲染，自然就能在最上层
  list.value.push(item)
}
const handleDragEnd = () => {
  dragItemId.value = null
}

onMounted(() => {
  for (let n = 0; n < 30; n++) {
    list.value.push({
      id: Math.round(Math.random() * 10000).toString(),
      x: Math.random() * stageSize.width,
      y: Math.random() * stageSize.height,
      rotation: Math.random() * 180,
      scale: Math.random(),
    })
  }
})

// NOTE Vuekonva可以直接把配置卸写在标签里
const rectConfig = {
  x: 10,
  y: 10,
  stroke: '#555',
  strokeWidth: 5,
  fill: '#ddd',
  width: 300,
  height: 200,
  shadowColor: 'white',
  shadowBlur: 10,
  shadowOffsetX: 10,
  shadowOffsetY: 10,
  shadowOpacity: 0.2,
  cornerRadius: 10,
}
const textConfig = {
  // 左上角定位
  x: 10,
  y: 10,
  text: '大首付款',
  fontSize: 18,
  fontFamily: 'Calibri',
  fill: '#fff',
  width: 90,
  padding: 9,
  align: 'center',
}
const circleConfig = {
  x: 10,
  y: 10,
  radius: 10,
  fill: 'red',
}

const getImageUrl = (url) => {
  return new URL(url, import.meta.url).href
}
const [map] = useImage(getImageUrl('../../assets/map/detail/breeze.png'))
</script>

<template>
  <div>
    <v-stage
      ref="stage"
      :config="stageSize"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      style="width: 600px; height: 600px; border: 1px solid red"
    >
      <v-layer>
        <v-image :config="{ x: 0, y: 0, image: map, width: 600, height: 600 }" />
      </v-layer>
      <v-layer ref="layer">
        <v-star
          v-for="item in list"
          :key="item.id"
          :config="{
            x: item.x,
            y: item.y,
            rotation: item.rotation,
            id: item.id,
            numPoints: 5,
            innerRadius: 30,
            outerRadius: 50,
            fill: '#89b717',
            opacity: 0.8,
            draggable: true,
            // 拖动时放大
            scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            shadowColor: 'black',
            shadowBlur: 10,
            // 拖动时阴影放大
            shadowOffsetX: dragItemId === item.id ? 15 : 5,
            shadowOffsetY: dragItemId === item.id ? 15 : 5,
            shadowOpacity: 0.6,
          }"
        />
      </v-layer>
      <v-layer>
        <v-rect :config="rectConfig" />
        <v-text :config="textConfig"></v-text>
        <v-circle :config="circleConfig"></v-circle>
      </v-layer>
    </v-stage>
  </div>
</template>

<style lang="scss" scoped>
div {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
