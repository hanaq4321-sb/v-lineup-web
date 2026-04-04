<script setup>
import { onMounted, ref } from 'vue'
import { Canvas, Rect } from 'fabric'
import * as fabric from 'fabric'

// 需要在页面容器加载完才能开始初始化（页面加载完才找到 canvas 元素）
const canvasRef = ref()
const fabric1 = () => {
  var canvas = new fabric.Canvas('c', {
    // backgroundColor: '#fff',
    selectionColor: 'rgba(255, 255, 0, 0.3)', // 选中对象时的背景色
    selectionLineWidth: 2,
    selectionBorderColor: 'yellow', // 选中对象的边框色
  })
  fabric.FabricImage.fromURL('src\\assets\\map\\detail\\abyss.png').then((img) => {
    img.scale(canvas.width / img.width)
    img.set({ left: canvas.width / 2, top: canvas.height / 2 })
    // img.set({ originX: 'center', originY: 'center' })
    // canvas.add(img)
  })
  const rect = new fabric.Rect({
    fill: 'red',
    originX: 'center',
    originY: 'center',
    width: 100,
    height: 100,
    // angle: 45,
    strokeWidth: 5,
    stroke: 'green',
  })
  const text = new fabric.FabricText('hello,world', {
    fontSize: 30,
    originX: 'center',
    originY: 'center',
  })
  const group = new fabric.Group([rect, text], {
    left: 150,
    top: 100,
  })
  canvas.add(group)
  // rect.set({ left: 20, top: 50 }).set('fill', 'blue')
  // rect.set('angle', 15).set('flipY', true)
}
const fabric2 = () => {
  var canvas = new fabric.Canvas('c', {
    selectionColor: 'rgba(255, 255, 0, 0.3)', // 选中对象时的背景色
    selectionLineWidth: 2,
    selectionBorderColor: 'yellow', // 选中对象的边框色
  })

  // 设置铅笔画笔
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
  canvas.freeDrawingBrush.width = 4
  canvas.isDrawingMode = true
}
onMounted(() => {
  // fabric1()
  fabric2()
})
</script>
<template>
  <div class="container">
    <canvas id="c" ref="canvasRef" width="600px" height="600px"> </canvas>
  </div>
</template>
<style lang="scss" scoped>
.container {
  height: 100%;
  border: 1px solid red;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
#c {
  background-image: url('../../assets/map/detail/ascent.png');
  background-repeat: no-repeat;
  background-size: cover;
  border: 1px solid red;
}
</style>
