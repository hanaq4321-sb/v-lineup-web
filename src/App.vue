<script setup>
import Layout from './views/Layout.vue'
window.addEventListener(
  'mousewheel',
  function (event) {
    if (event.ctrlKey === true || event.metaKey) {
      event.preventDefault()
    }
  },
  { passive: false },
)
</script>

<template>
  <Layout />
</template>

<style>
body {
  margin: 0px;
}
</style>
