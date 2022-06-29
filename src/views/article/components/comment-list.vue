<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error="error"
    error-text="加载失败，请点击重试"
    :immediate-check="false"
    @load="onLoad"
  >
    <CommentItem
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      :index="index"
    ></CommentItem>
  </van-list>
</template>
<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    },
    // totalCount: {
    //   type: [Number, String]
    // },
    list: {
      type: Array,
      default: () => []
    },
    type: { // 评论类型
      type: String,
      default: 'a',
      // 自定义校验
      // validator: value => ['a', 'c'].indexOf(value) !== -1
      validator (value) {
        return ['a', 'c'].includes(value)
      }
    }
  },
  data () {
    return {
      // CommentList: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 获取评论数据的偏移量
      limit: 10, // 获取的评论数据个数
      error: false
    }
  },
  created () {
    // 当你手动初始 onLoad 的话，它不会自动开始初始的 loading
    // 所以我们要手动的开启初始 loading
    this.loading = true
    this.onLoad() // 页面一打开就获取评论总数量
  },
  methods: {
    async onLoad () {
      try {
        const { data } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.articleId, // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // this.list.push(...data.data.results)
        this.$parent.list.push(...data.data.results)
        // if (this.total_count !== undefined) {
        // this.$emit('update:totalCount', data.data.total_count)
        // }
        this.$parent.totalCount = data.data.total_count

        this.loading = false
        // if (data.data.results.length) { // results: []
        //   this.offset = data.data.last_id
        // }
        if (data.data.end_id) { // end_id: null // 所有评论或回复的最后一个id（截止offset值，小于此值的offset可以不用发送请求获取评论数据，已经没有数据），若无评论或回复数据，则值为NULL
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>
