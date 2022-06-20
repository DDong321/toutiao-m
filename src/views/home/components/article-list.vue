<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-text="reFreshText"
      :success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <ArticleItem
          v-for="article in list"
          :key="article.art_id"
          :article="article"
        />
        <!-- <van-cell
          v-for="article in list"
          :key="article.art_id"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  components: {
    ArticleItem
  },
  data () {
    return {
      list: [],
      loading: false, // loading 控制上拉加载更多的 loading 状态
      finished: false, // finished 控制数据是否加载结束
      timestamp: Date.now(), // 请求的时间戳 或+new Date()
      error: false,
      isreFreshLoading: false, // 控制下拉加载的函数是否能触发，下拉会自动变为true
      reFreshText: '刷新成功' // 刷新提示的文本
    }
  },
  methods: {
    // load 事件：当触发上拉加载更多的时候会触发调用 load 事件
    // List 初始化后会触发一次 load 事件，用于加载第一屏的数据 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成
    async onLoad () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: this.timestamp, // 时间戳，也就是请求的页数
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // // 测试error 随机失败
        // if (Math.random() > 0.5) {
        //  // JSON.parse('ddqd')
        //   const error = new Error('随机报错')
        //   throw (error)
        // }

        // 合并数据
        this.list.push(...data.data.results)
        // 或 this.list= [...this.list, ...data.data.results]
        // 让loading重置为false，为下一次load事件做准备
        this.loading = false
        // 拿到上一次请求返回的时间戳
        this.timestamp = data.data.pre_timestamp
        // 如果pre_timestamp返回值为null，说明是最后一页，关闭onload事件
        if (this.timestamp === null) {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },
    async onRefresh () {
      // 发请求，拿的是最新的数据，不是下一页数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 获取最新时间戳 不是下一页
          with_top: 1
        })
        // 更新所有数据
        this.list = data.data.results
        // 将isreFreshLoading重置为false 才能下一次的下拉
        this.isreFreshLoading = false
        this.reFreshText = '刷新成功'
      } catch (err) {
        this.isreFreshLoading = false
        this.reFreshText = '刷新失败'
      }
    }
  }
}
</script>

<style scoped>
/* 记住列表的滚动位置 */
/* 让每一个标签内容文章列表产生自己的滚动容器，这样就不会相互影响了 */
.article-list {
  /* height: 79vh; 其他设备底部没铺满 该方案不适配 */
  /* calc() 计算 */
  height: calc(100vh - 274px);
  overflow-y: auto;
}
</style>
