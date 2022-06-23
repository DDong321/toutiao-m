<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
      >搜索
      </van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 频道列表 -->
    <!--
    animated 滑动的动画
    border 底边框线
    swipeable 开启左右手势滑动
    -->
    <van-tabs class="channel-tabs" v-model="active" swipeable animated border>
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <ArticLeList :channel="channel"/>
      </van-tab>
      <!-- 右侧自定义内容 -->
      <!-- 占位元素 让最后一个tab能全部显示-->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 右侧按钮 -->
      <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->
    <!-- 频道编辑弹层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
      close-icon-position="top-left"
    >
      <ChannelEdit :my-channels="channels" :active.sync="active" @addChannel="addChannel"/>
    </van-popup>
    <!-- /频道编辑弹层 -->
  </div>
</template>

<script>
// 导入获取用户频道的方法
import { getUserChannels } from '@/api/user'
import ArticLeList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    ArticLeList,
    ChannelEdit
  },
  data () {
    return {
      active: 0,
      channels: [], // 用户频道列表
      isChannelEditShow: false // 弹出层是否显示
    }
  },
  created () {
    this.getUserChannels()
  },
  computed: {
    ...mapState(['token'])
  },
  methods: {
    async getUserChannels () {
      // 频道数据持久化 - 正确获取首页频道数据
      // 情况1: 有token 拿的是登录后操作的频道
      // 情况2: 没token 拿的是默认频道
      // 没token:
      // - 没登录,也没操作过数据(本地存储肯定为null)
      // - 没登陆过,操作过数据(本地存储为true)
      try {
        // 无论什么情况 先拿后台数据
        const { data } = await getUserChannels()
        this.channels = data.data.channels
        if (!this.token && getItem('TOUTIAO_CHANNELS')) {
          this.channels = getItem('TOUTIAO_CHANNELS')
        }
      } catch (err) {
        this.$toast.fail('获取频道失败')
      }
      // try {
      //   const { data } = await getUserChannels()
      //   this.channels = data.data.channels
      // } catch (err) {
      //   this.$toast.fail('获取用户频道列表失败')
      // }
    },
    // 定义一个添加用户频道的函数
    addChannel (channel) {
      this.channels.push(channel)
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;

  // /deep/(深度选择器)：(scpoed模式下)在组件内修改全局的外来组件样式，需要加/deep/ 必须是less语法     sess语法用：::v-deep
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }

  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;

    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }

    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);

      i.toutiao {
        font-size: 33px;
      }

      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
