<template>
  <div class="search-suggestion">
    <van-cell v-for="(text, index) in suggestions" :key="index" icon="search" @click="$parent.onSearch(text)">
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchSuggestion',
  props: {
    suggestions: {
      type: Array,
      required: true
    }
  },
  methods: {
    // 定义一个正则替换的方法
    // text --> <span style="color: red">输入的内容</span>
    // 全局替换 忽略大小写
    // 通过正则构造函数创建正则表达式
    highlight (text) {
      const reg = new RegExp(this.$parent.searchText, 'gi')
      return text.replace(reg, `<span style="color: red">${this.$parent.searchText}</span>`)
    }
  }
}
</script>

<style scoped lang="less"></style>
