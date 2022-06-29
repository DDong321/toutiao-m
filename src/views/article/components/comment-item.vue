<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{ comment.aut_name }}</div>
      <van-button
        class="like-btn"
        :icon="comment.like_count ? 'good-job' : 'good-job-o'"
        :class="{ liked: comment.is_liking }"
        :loading="commentLoading"
        @click="onCommentLike"
      >{{ comment.like_count || '赞' }}
      </van-button>
    </div>

    <div slot="label">
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{ comment.pubdate | relativeTime1 }}</span>
        <van-button
          class="reply-btn"
          round
          @click="reply"
        >回复 {{ comment.reply_count }}
        </van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'

export default {
  name: 'CommentItem',
  props: {
    // 每行的评论信息
    comment: {
      type: Object,
      required: true
    },
    // 父组件list数据对应的索引号
    index: {
      type: Number
      // required: true
    }
  },
  data () {
    return {
      commentLoading: false
    }
  },
  methods: {
    async onCommentLike () {
      this.commentLoading = true
      try {
        if (this.comment.is_liking) {
          await deleteCommentLike(this.comment.com_id)
          this.$parent.$parent.list[this.index].like_count--
        } else {
          await addCommentLike(this.comment.com_id)
          this.$parent.$parent.list[this.index].like_count++
        }
        // 注意父组件的父组件传过来的comment是对象 不能使用sync
        // 修改list中的数据 要用索引获取
        this.$parent.$parent.list[this.index].is_liking = !this.$parent.$parent.list[this.index].is_liking
      } catch (err) {
        console.log(err)
        this.$toast.fail('点赞失败，请重试')
      }
      this.commentLoading = false
    },
    reply () {
      this.$parent.$parent.$parent.isReplyShow = true
      this.$parent.$parent.$parent.comment = this.comment
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }

  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }

  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }

  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }

  .bottom-info {
    display: flex;
    align-items: center;
  }

  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }

  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;

    .van-icon {
      font-size: 30px;
    }
  }

  .liked {
    .van-button__icon {
      color: orange;
    }
  }
}
</style>
