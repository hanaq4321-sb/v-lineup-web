<script setup>
import Konva from 'konva'
import { onMounted } from 'vue'
/*
                Stage
                  |
          +------+------+
          |             |
        Layer         Layer
          |             |
    +-----+-----+     Shape
    |           |
  Group       Group
    |           |
    +       +---+---+
    |       |       |
  Shape   Group    Shape
            |
            +
            |
          Shape
*/
// 舞台
var konvaJson = {
  attrs: {
    id: 'p1',
    name: 'red pentagon',
    x: 100,
    y: 100,
    sides: 5,
    radius: 70,
    fill: 'yellow',
    stroke: 'green',
    strokeWidth: '4',
    shadowColor: '#fff',
    shadowBlur: 40,
    opacity: 0.5,
    draggable: 'true',
  },
  className: 'RegularPolygon',
}
const k1 = () => {
  var stage = new Konva.Stage({
    container: 'c', // 容器 <div> 的 id
    width: 500,
    height: 500,
  })
  // 图层
  var layer = new Konva.Layer()
  // 形状
  var circle = new Konva.Circle({
    x: stage.width() / 2,
    y: stage.height() / 2,
    radius: 70,
    fill: 'red',
    stroke: 'green',
    strokeWidth: 4,
  })
  // 将形状添加到图层
  layer.add(circle)
  // 将图层添加到舞台
  stage.add(layer)
}
const k2 = () => {
  var stage = new Konva.Stage({
    container: 'c',
    width: 600,
    height: 600,
  })
  var layer = new Konva.Layer()
  var pentagon = new Konva.RegularPolygon({
    id: 'p1',
    name: 'red pentagon',
    x: 100,
    y: 100,
    sides: 5,
    radius: 70,
    fill: 'yellow',
    stroke: 'green',
    strokeWidth: '4',
    shadowColor: '#fff',
    shadowOffset: 0,
    shadowBlur: 40,
    opacity: 0.5,
  })
  // 允许拖动
  pentagon.draggable('true')
  // NOTE mouseover(mouseout)：鼠标指针进入事件绑定的元素或子元素；mouseenter(mouseleave)：鼠标指针进入绑定事件的元素
  pentagon.on('mouseover', function () {
    console.log('hover')
  })
  layer.add(pentagon)
  stage.add(layer)
  // 按类型查找
  console.log(layer.find('RegularPolygon'))
  // 按id查找
  console.log(layer.findOne('#p1'))
  // 按name查找
  console.log(layer.find('.pentagon'))
  // 序列化，转化为JSON
  konvaJson = pentagon.toJSON()
  console.log(konvaJson)
}
const k3 = () => {
  var stage = new Konva.Stage({
    container: 'c',
    width: 600,
    height: 600,
  })
  var layer = new Konva.Layer()
  var pentagon = Konva.Node.create(konvaJson)
  layer.add(pentagon)
  stage.add(layer)
}
onMounted(() => {
  // k1()
  k2()
  // k3()
})
</script>

<template>
  <div class="container">
    <div id="c" style="border: 1px solid red"></div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
