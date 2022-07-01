<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="show === 0">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-if="show === 1">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            :loading="followLoading"
            @click="onFollow"
            >已关注
          </van-button>
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            :loading="followLoading"
            @click="onFollow"
            >关注
          </van-button> -->
          <!-- <FollowUser
            class="follow-btn"
            :isFollowed.sync="article.is_followed"
            :followId="article.aut_id"
          /> -->
          <!--
            v-model语法糖:
              value="article.is_followed"
              @input="article.is_followed = $event"
            合成 v-model
           -->
          <!--  -->
          <FollowUser
            class="follow-btn"
            v-model="article.is_followed"
            :followId="article.aut_id"
          />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <CommentList :articleId="article.art_id" :list="list"/>
        <!-- /文章评论列表 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small" @click="isPostShow=true"
          >写评论
          </van-button>
          <van-icon name="comment-o" :info="totalCount" color="#777"/>
          <!-- <van-icon color="#777" name="star-o" /> -->
          <CollectArticle
            class="btn-item"
            :collected.sync="article.is_collected"
            :articleId="article.art_id"
          />
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <LikeArticle
            class="btn-item"
            :liked.sync="article.attitude"
            :articleId="article.art_id"
          />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 弹出层 发布评论 -->
        <van-popup v-model="isPostShow" position="bottom">
          <CommentPost :target="article.art_id"/>
        </van-popup>
        <!-- /弹出层 发布评论 -->
        <!-- 弹出层 回复评论 -->
        <!--
          弹出层是懒渲染的：只有在第一次展示的时候才会渲染里面的内容，之后它的关闭和显示都是在切换内容的显示和隐藏
          解决：v-if="isReplyShow" 条件渲染
        -->
        <van-popup v-model="isReplyShow" position="bottom" style="height: 80%">
          <CommentReply v-if="isReplyShow" :comment="comment" :isReplyShow.sync="isReplyShow"/>
        </van-popup>
        <!-- /弹出层 回复评论 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-if="show === 2">
        <van-icon name="failure"/>
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-if="show === 3">
        <van-icon name="failure"/>
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="getArticleById"
        >点击重试
        </van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import dayjs from '@/utils/dayjs'
// 导入图片预览函数
import { ImagePreview } from 'vant'
// import { addFollow, deleteFollow } from '@/api/user'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  // 依赖注入:
  // 给所有的后代组件提供数据 (这里在reply组件内用的)
  // 注意: 不要滥用(尽量使用vuex)
  // 特点:
  // 1.无论多深的子组件都可以拿到这个数据
  // 2.数据是非响应式的
  // 3.单向数据流
  provide () {
    return {
      articleId: this.articleId // 或者写成 this.$route.params.articleId  也可以
    }
  },
  // provide: {
  //   articleId: 'this.articleId' // 或者写成 this.$route.params.articleId  也可以
  // },
  props: {
    // 使用props解耦获得了的动态路由数据，这样我们就可以使用this.articleId 获取动态路由数据 而不需要使用 this.$route.params.articleId
    articleId: {
      type: [Number, String], // 点击跳转拿到的是数字型，如果通过手动在url地址内写路由，拿到的是字符串
      required: true
    }
  },
  data () {
    return {
      article: {},
      show: 0, // 0代表loading开启 1代表文章加载成功 2代表404 3代表文章内容加载失败点击重试
      // followLoading: false // 关注按钮加载状态
      totalCount: 0, // 评论总数
      isPostShow: false, // 控制发布评论弹层
      list: [], // 评论列表
      isReplyShow: false, // 控制回复评论弹层
      comment: {} // 每行的评论信息
    }
  },
  created () {
    this.getArticleById()
  },
  // updated () {  // 方法3 钩子函数 文章渲染后 来获取DOM
  //   this.previewImage()
  // },
  methods: {
    async getArticleById () {
      try {
        this.show = 0
        const { data } = await getArticleById(this.articleId)
        // 随机错误
        // if (Math.random() > 0.5) {
        //   JSON.parse(undefined)
        // }
        this.article = data.data
        this.show = 1

        // 初始化图片点击预览
        // 这个时候其实找不到 这个refs引用的，原因是因为v-if的渲染其实需要时间，我们视图还没有立即更新完成。
        // console.log(this.$refs.article) // undefined
        // 方法1 数据更新之后，因为试图更新是异步的，所以需要this.$nextTick(() => { 可以拿到更新之后的DOM元素 })
        // this.$nextTick(() => {
        //   console.log(this.$refs.article) // 这样就可以拿到DOM
        // })
        // 方法2 或者使用定时器，延迟更新( setTimeout 0 会把要做的事情放在异步队列的最后面执行！ )
        // 或者使用 钩子函数 updated
        setTimeout(() => {
          // console.log(this.$refs.article) // 这样就可以拿到DOM
          this.previewImage()
        }, 0)
      } catch (err) {
        // 失败有两种情况 404 / 404,500,代码错误
        // 注意：如果是服务器返回的错误 400类 500类，err对象他是有response属性的，但是如果是非服务器错误，是没有response的 说以这里加上一个err.response判断
        if (err.response && err.response.status === 404) {
          this.show = 2
        } else {
          this.show = 3
        }
      }
    },
    previewImage () {
      const articleContent = this.$refs.article // 获取到容器节点
      const imgs = articleContent.querySelectorAll('img')
      // 获取所有img地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从 0 开始
            startPosition: index
          })
        }
      })
    }
    // async onFollow () {
    //   this.followLoading = true // 开启按钮的 loading 状态
    //   try {
    //     if (this.article.is_followed) {
    //       await deleteFollow(this.article.aut_id)
    //     } else {
    //       await addFollow(this.article.aut_id)
    //     }
    //     this.article.is_followed = !this.article.is_followed
    //   } catch (err) {
    //     if (err.response && err.response.status === 400) {
    //       this.$toast.fail('潮吗，关注你自己干嘛')
    //     } else {
    //       this.$toast.fail('关注失败，请重试')
    //     }
    //   }
    //   this.followLoading = false // 关闭按钮的 loading 状态
    // }
  },
  filters: {
    // 局部注册过滤器 使用dayjs
    relativeTime (value) {
      return dayjs().to(dayjs(value))
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }

  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;

      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }

      .van-cell__label {
        margin-top: 0;
      }

      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }

      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }

      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;

      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;

    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }

    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }

    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;

    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }

    /deep/ .van-icon {
      font-size: 40px;

      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
