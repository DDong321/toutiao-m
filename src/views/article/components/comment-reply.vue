<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'"
    >
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('update:isReplyShow', false)"
      />
    </van-nav-bar>

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <CommentItem :comment="comment"/>
      <!-- /当前评论项 -->

      <p class="reply">全部回复</p>

      <!-- 评论的回复列表 -->
      <CommentList :articleId="comment.com_id" :list="list" type="c"/>
      <!-- /评论的回复列表 -->
    </div>

    <!-- 底部区域 -->
    <div class="reply-bottom">
      <van-button
        class="write-btn"
        size="small"
        round
        @click="isPostShow = true"
      >写评论
      </van-button>
    </div>
    <!-- /底部区域 -->

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <CommentPost :target="comment.com_id" :articleId="articleId" :comment="comment"/>
    </van-popup>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment-post'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  // 依赖注入 来自ArticleIndex
  // inject:['articleId']
  inject: {
    articleId: {
      type: [Number, String],
      default: null
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    isReplyShow: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      list: [],
      isPostShow: false // 弹框是否显示
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {}
}
</script>
<style scoped lang="less">
//.scroll-wrap {
//  position: fixed;
//  top: 92px;
//  left: 0;
//  right: 0;
//  bottom: 88px;
//  overflow-y: auto;
//}

.reply {
  font-size: 36px;
  color: grey;
  margin: 20px 0 20px 36px;
}

.reply-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;

  .write-btn {
    width: 60%;
  }
}
</style>
