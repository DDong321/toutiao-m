<template>
  <van-button
    :icon="collected ? 'star' : 'star-o'"
    :class="{ collected: collected }"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  props: {
    collected: {
      type: Boolean,
      required: true
      // default: false // 默认值
    },
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onCollect () {
      this.loading = true // 开启按钮的 loading 状态
      try {
        if (this.collected) {
          await deleteCollect(this.articleId)
        } else {
          await addCollect(this.articleId)
        }
        this.$emit('update:collected', !this.collected)
        // 此时视图未更新 延迟提示
        this.$nextTick(() => {
          this.$toast.success(this.collected ? '收藏成功' : '取消收藏')
        })
      } catch (err) {
        this.$toast.fail('收藏失败，请重试')
      }
      this.loading = false // 关闭按钮的 loading 状态
    }
  }
}
</script>

<style scoped lang="less">
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
