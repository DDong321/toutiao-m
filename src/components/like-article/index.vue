<template>
  <van-button
    :icon="liked === 1 ? 'good-job' : 'good-job-o'"
    :class="{ liked: liked === 1 }"
    :loading="loading"
    @click="onLike"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  props: {
    liked: {
      type: Number,
      required: true
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
    async onLike () {
      this.loading = true // 开启按钮的 loading 状态
      try {
        if (this.liked === 1) {
          await deleteLike(this.articleId)
          this.$emit('update:liked', -1)
        } else {
          await addLike(this.articleId)
          this.$emit('update:liked', 1)
        }
        // 此时视图未更新 延迟提示
        this.$nextTick(() => {
          this.$toast.success(this.liked === 1 ? '点赞成功' : '取消点赞')
        })
      } catch (err) {
        this.$toast.fail('点赞失败，请重试')
      }
      this.loading = false // 关闭按钮的 loading 状态
    }
  }
}
</script>

<style scoped lang="less">
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
