<script setup>
import { ref, computed } from 'vue'

const width = 600
const height = 600
const stageRef = ref(null)

const stageConfig = computed(() => ({
  width,
  height,
}))

// 计算属性所依赖的属性发生变化，计算属性就会重新执行，视图也会更新
const circleConfig = computed(() => ({
  x: width / 2,
  y: height / 2,
  radius: 50,
  fill: 'green',
  draggable: true,
}))

const handleWheel = (e) => {
  e.evt.preventDefault()

  const stage = stageRef.value.getNode()
  const oldScale = stage.scaleX()
  const pointer = stage.getPointerPosition()

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  }

  // 如何缩放？放大？还是缩小？
  let direction = e.evt.deltaY > 0 ? -1 : 1

  // 当我们在触控板上缩放时，e.evt.ctrlKey 为 true
  // 在这种情况下，反转方向
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
</script>

<template>
  <div>
    <v-stage ref="stageRef" :config="stageConfig" style="width: 600px; height: 600px; border: 1px solid red">
      <v-layer>
        <v-circle :config="circleConfig" @wheel="handleWheel" />
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
