<template>
  <div id="app">
    <!-- 缓存一级路由home -- > article组件 -->
    <!-- include 只缓存LayoutIndex组件 -->
    <keep-alive include="LayoutIndex">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
</style>
