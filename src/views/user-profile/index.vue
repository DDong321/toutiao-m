<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 个人信息 -->
    <van-cell class="avatar-cell" title="头像" is-link center>
      <van-image
        class="avatar"
        round
        fit="cover"
        :src="user.photo"
      />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link/>
    <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link/>
    <van-cell title="生日" :value="user.birthday" is-link/>
    <!-- /个人信息 -->
  </div>
</template>
<script>
import { getUserProfile } from '@/api/user'

export default {
  name: 'UserProfile',
  components: {},
  props: {},
  data () {
    return {
      user: {} // 个人信息
    }
  },
  created () {
    this.getUserProfile()
  },
  methods: {
    async getUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (err) {
        this.$toast('数据获取失败')
      }
    }
  },
  computed: {},
  watch: {},
  mounted () {
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }

    .avatar {
      width: 60px;
      height: 60px;
    }
  }

  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
