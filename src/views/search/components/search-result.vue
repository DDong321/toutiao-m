<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell v-for="result in list" :key="result.art_id" :title="result.title"/>
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from '@/api/search'

export default {
  name: 'SearchResult',
  components: {},
  props: {},
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      page: 1, // 页码
      per_page: 10 // 每页个数
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    async onLoad () {
      try {
        const { data } = await getSearchResults({
          page: this.page, // 页码
          per_page: this.per_page, // 每页个数
          q: this.$parent.searchText // 查询关键词
        })
        const { results } = data.data
        this.list.push(...results)
        // 将本次加载中的 loading 关闭article
        this.loading = false
        // 判断是否还有数据
        if (results.length) {
          // 如果有，则更新获取下一个数据的页码
          this.page++
        } else {
          // 如果没有，则将加载状态 finished 设置为结束
          this.finished = true
        }
      } catch (err) {
        // 展示加载失败的提示状态
        this.error = true
        // 加载失败了 loading 也要关闭
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
