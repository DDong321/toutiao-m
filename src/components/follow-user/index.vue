<template>
  <van-button
    v-if="isFollowed"
    round
    size="small"
    :loading="followLoading"
    @click="onFollow"
    >已关注
  </van-button>
  <van-button
    v-else
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="followLoading"
    @click="onFollow"
    >关注
  </van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  model: { // model重命名
    prop: 'isFollowed', // 默认是value
    event: 'change' // 默认是input
  },
  props: {
    // 父组件传过来的关注状态
    isFollowed: {
      type: Boolean,
      required: true
    },
    // value: {
    //   type: Boolean,
    //   required: true
    // },
    followId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      followLoading: false // 关注按钮加载状态
    }
  },
  methods: {
    async onFollow () {
      this.followLoading = true // 开启按钮的 loading 状态
      try {
        if (this.isFollowed) {
          await deleteFollow(this.followId)
        } else {
          await addFollow(this.followId)
        }
        // this.$emit('update:isFollowed', !this.isFollowed)
        // this.$emit('input', !this.isFollowed)
        this.$emit('change', !this.isFollowed)
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('潮吗，关注你自己干嘛')
        } else {
          this.$toast.fail('关注失败，请重试')
        }
      }
      this.followLoading = false // 关闭按钮的 loading 状态
    }
  }
}
</script>

<style scoped>
</style>
