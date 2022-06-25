<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!--
      Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
     -->
    <form class="search-form" action="/">
      <van-search
        v-model.trim="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="onFocus"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <!-- v-show问题：一开始盒子是隐藏的，没有触底事件，不加载数据，因为采用的是v-show，组件不会重新渲染 -->
    <search-result v-if="show === 2"/>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <!-- 处理 后台返回的数据null的情况会遍历一个搜索 -->
    <!--<search-suggestion v-if="show === 1 && suggestions[0] !== null" :suggestions="suggestions"/>-->
    <search-suggestion v-if="show === 1" :suggestions="suggestions"/>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history v-if="show === 0" :searchHistories="searchHistories"/>
    <!-- /搜索历史记录 -->

  </div>
</template>
<script>
import SearchResult from './components/search-result'
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import { getSearchSuggestions } from '@/api/search'
// 防抖方法2：按需导入 利用ladash里的防抖函数做优化
import { debounce } from 'lodash'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  components: {
    SearchResult,
    SearchHistory,
    SearchSuggestion
  },
  props: {},
  data () {
    return {
      searchText: '', // 绑定输入框变量
      show: 0, // 0 代表历史 1 代表联想建议 2 代表搜索结果  // 文档中是通过一个值判断true/false
      suggestions: [], // 联想建议数据列表
      tiemr: null, // 防抖-定时器
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 存储搜索历史记录
    }
  },
  watch: {
    // 监听 searchText 判断show
    // searchText (newVal) {
    //   if (newVal) {
    //     this.show = 1
    //     // 发请求 获取数据 将suggestions传给子组件  // 文档中是在子组件watch中请求
    //     this.getSearchSuggestions(newVal)
    //   } else {
    //     this.show = 0
    //   }
    // }
    // 防抖方法2：利用ladash里的防抖函数做优化  this指向有问题
    searchText: debounce(function (newVal) {
      if (this.show === 2) return
      if (newVal) {
        this.show = 1
        // 发请求 获取数据 将suggestions传给子组件  // 文档中是在子组件watch中请求
        this.getSearchSuggestions(newVal)
      } else {
        this.show = 0
      }
    }, 300),
    // 监听searchHistories数据
    searchHistories (newVal) {
      setItem('TOUTIAO_SEARCH_HISTORIES', newVal)
    }
  },
  methods: {
    onSearch (val) {
      // if (this.searchText === '') return
      // 存储搜索历史记录（去重 新的添加至前面）
      // 先判断搜索的字段在历史记录里面有没有
      const index = this.searchHistories.indexOf(val)
      // -1表示没有 其他索引说明有
      // 删除历史记录
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      // 把新的记录添加到数组最前面
      this.searchHistories.unshift(val)

      // 点击联想词 赋给搜索栏 val: 子组件触发传过来的text
      this.searchText = val
      // 让搜索结果盒子展现，发请求拿数据
      if (this.searchText) {
        this.show = 2
      }
    },
    onCancel () {
      this.$router.back()
    },
    onFocus () {
      if (this.searchText) {
        this.show = 1
        this.getSearchSuggestions(this.searchText)
      }
    },
    async getSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        // 处理 后台返回的数据null的情况
        if (data.data.options[0] == null) {
          this.suggestions = []
          return
        }
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('获取失败，稍后重试')
      }
    }
    //   // 防抖方法1：自己写
    // getSearchSuggestions (q) {
    //   clearTimeout(this.tiemr)
    //   this.tiemr = setTimeout(async () => {
    //     try {
    //       const { data } = await getSearchSuggestions(q)
    //       // 处理 后台返回的数据null的情况
    //       if (data.data.options[0] == null) {
    //         this.suggestions = []
    //         return
    //       }
    //       this.suggestions = data.data.options
    //     } catch (err) {
    //       this.$toast('获取失败，稍后重试')
    //     }
    //   }, 300)
    // }
  }
}
</script>
<style scoped lang="less">
.search-container {
  padding-top: 108px;

  .van-search__action {
    color: #fff;
  }

  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
