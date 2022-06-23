<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' : '编辑' }}
      </van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="channel.id"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEdit && fixedChannels.indexOf(channel.id) === -1"
        ></van-icon>
        <!-- 或者 v-show="isEdit && fixedChannels.includes(channel.id)"-->
        <span
          class="text"
          slot="text"
          :class="{active: index === active}"
        >{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>
    <!-- /我的频道 -->
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        icon="plus"
        v-for="channel in recommendChannels"
        :key="channel.id"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
// 使用Lodash工具库
import _ from 'lodash'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制x图标显示隐藏
      fixedChannels: [0] // 存储哪些频道不允许删除 存的是频道id
    }
  },
  computed: {
    recommendChannels () {
      // 筛选出未添加的频道
      // return this.allChannels.filter(channel => {
      //   return !this.myChannels.find(myChannel => channel.id === myChannel.id)
      // })

      // - 利用Lodash工具库
      return _.differenceBy(this.allChannels, this.myChannels, 'id')
    },
    ...mapState(['token'])
  },
  created () {
    // 调用获取所有频道的函数
    this.getAllChannels()
  },
  methods: {
    // 定义获取所有频道的函数
    async getAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast.fail('获取频道列表失败')
      }
    },
    // 定义一个点击推荐频道触发的事件
    async onAddChannel (channel) {
      this.$emit('addChannel', channel)

      // 频道数据持久化 - 添加
      // 判断用户是否登录 vuex state中的user
      if (this.token) {
        // 登录状态 发送添加请求
        try {
          await addUserChannel({
            id: channel.id, // 频道id
            seq: this.myChannels.length // 顺序序号
          })
        } catch (err) {
          this.$toast.fail('添加失败')
        }
      } else {
        // 未登录状态 本地存储
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 定义一个点击我的频道触发的事件
    async onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 编辑状态，点击删除频道
        if (this.fixedChannels.includes(channel.id)) return
        // 删除
        this.$parent.$parent.channels.splice(index, 1)
        // 如果删除的index <= active, 为了让高亮效果不变，需要让active-1
        if (index <= this.active) {
          this.$emit('update:active', this.active - 1)
        }

        // 频道数据持久化 - 删除
        // 判断用户是否登录 vuex state中的user
        if (this.token) {
          // 登录状态 发送添加请求
          try {
            await deleteUserChannel(channel.id) // 频道id
          } catch (err) {
            this.$toast.fail('删除失败')
          }
        } else {
          // 未登录状态 本地存储
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } else {
        // 完成状态，点击跳转
        // sync修饰符只允许修改基本数据类型
        // 'update: 属性名'
        this.$emit('update:active', index)
        this.$parent.$parent.isChannelEditShow = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;

    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;

      .van-grid-item__text, .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }

      .active {
        color: red;
      }

      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;

        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
