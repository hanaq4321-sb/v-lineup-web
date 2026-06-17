<script setup>
import { ref, onMounted } from 'vue'
// const cRef = ref()
// onMounted(() => { // 挂载完成后才能用获取dom，无论ref还是document
//   const canvas = cRef.value
//   console.log(cRef.value)
// })
onMounted(() => {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  //#region
  // 设置线条颜色
  ctx.strokeStyle = 'blue'
  ctx.lineWidth = 4
  ctx.lineJoin = 'round' // 两个线段用圆弧链接过渡
  ctx.lineCap = 'round' // 线条末端为直角
  ctx.imageSmoothingEnabled = true // 启用抗锯齿

  // let isDown = false
  // let points = []
  // let beginPoint = null

  // const down = (e) => {
  //   isDown = true
  //   const { x, y } = getPos(e)
  //   points.push({ x, y })
  //   beginPoint = { x, y }
  //   // console.log('down')
  // }
  // const move = (e) => {
  //   if (!isDown) return

  //   const { x, y } = getPos(e)
  //   points.push({ x, y })

  //   if (points.length > 3) {
  //     const lastTwoPoints = points.slice(-2)
  //     const controlPoint = lastTwoPoints[0]
  //     const endPoint = {
  //       x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
  //       y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
  //     }
  //     drawLine(beginPoint, controlPoint, endPoint)
  //     beginPoint = endPoint
  //   }
  //   // console.log('move')
  // }
  // const up = (e) => {
  //   if (!isDown) return
  //   const { x, y } = getPos(e)
  //   points.push({ x, y })

  //   if (points.length > 3) {
  //     const lastTwoPoints = points.slice(-2)
  //     const controlPoint = lastTwoPoints[0]
  //     const endPoint = lastTwoPoints[1]
  //     drawLine(beginPoint, controlPoint, endPoint)
  //   }
  //   beginPoint = null
  //   isDown = false
  //   points = []
  //   // console.log('up')
  // }
  // const getPos = (evt) => {
  //   const rect = canvas.getBoundingClientRect()
  //   return {
  //     x: evt.clientX - rect.left,
  //     y: evt.clientY - rect.top,
  //   }
  // }

  // const drawLine = (beginPoint, controlPoint, endPoint) => {
  //   ctx.beginPath()
  //   // ctx.moveTo(beginPoint.x, beginPoint.y)
  //   // ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)
  //   ctx.bezierCurveTo(beginPoint.x, beginPoint.y, controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)
  //   ctx.stroke()
  //   ctx.closePath()
  // }

  // // 监听事件
  // canvas.addEventListener('mousedown', down, false)
  // canvas.addEventListener('mousemove', move, false)
  // canvas.addEventListener('mouseup', up, false)
  // canvas.addEventListener('mouseout', up, false)
  //#endregion

  const loc = (e) => {
    console.log(e.offsetX, e.offsetY)
  }
  canvas.addEventListener('mousedown', loc, false)

  // 给定的点数组
  const points1 = [
    { x: 202, y: 95 },
    { x: 175, y: 165 },
    { x: 160, y: 195 },
    { x: 120, y: 240 },
    { x: 100, y: 245 },
    { x: 70, y: 245 },
  ]

  const points = [
    { x: 408, y: 317 },
    { x: 343, y: 296 },
    { x: 296, y: 292 },
    { x: 255, y: 270 },
    { x: 252, y: 238 },
    { x: 246, y: 217 },
    { x: 224, y: 208 },
  ]

  // 设置起始点
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  const p0 = points[0]
  const p1 = points[1]
  const p2 = points[2]

  const cp1x = p0.x + (p1.x - p0.x) / 2
  const cp1y = p0.y + (p1.y - p0.y) / 2
  ctx.quadraticCurveTo(cp1x, cp1y, p1.x, p1.y)
  // 绘制曲线
  for (let i = 1; i < points.length - 1; i++) {
    const p0 = i === 1 ? points[0] : points[i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = i === points.length - 2 ? points[points.length - 1] : points[i + 2]

    const cp1x = p1.x + (p2.x - p0.x) / 5
    const cp1y = p1.y + (p2.y - p0.y) / 5
    const cp2x = p2.x - (p3.x - p1.x) / 5
    const cp2y = p2.y - (p3.y - p1.y) / 5

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y)
  }

  ctx.stroke() // 开始画
  // 绘制给定的点
  ctx.fillStyle = 'blue'
  for (let i = 0; i < points.length; i++) {
    ctx.beginPath()
    ctx.arc(points[i].x, points[i].y, 4, 0, 2 * Math.PI)
    ctx.fillStyle = 'red'
    ctx.fill()
  }
  ctx.closePath() // 关闭路径
})
</script>
<template>
  <div class="container">
    <div class="img">
      <!-- canvas不能用css设置 -->
      <canvas ref="cRef" id="canvas" width="600px" height="600px"></canvas>
    </div>
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
.img {
  width: 600px;
  height: 600px;
  border: 1px solid red;
  background: url('../../assets/map/detail/breeze.png');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
