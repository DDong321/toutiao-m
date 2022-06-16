<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录" />
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <!--【增加图标】-->
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <!--【增加图标】-->
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <!--【增加发送按钮】-->
        <template #button>
          <!-- vant form组件问题(看文档) -->
          <!--这里注意，要加上native-type,否则也可以实现表单提交-->
          <van-button
            v-if="isCountDownShow"
            class="send-sms-btn"
            round
            size="small"
            native-type="button"
            type="default"
            @click="onSendSms"
          >
            发送验证码
          </van-button>
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="small"
            native-type="button"
            type="default"
          >
            <!-- 倒计时组件  time 时长，毫秒数； format 格式； finish 结束事件 -->
            <van-count-down
              :time="1000 * 60"
              format="ss s"
              @finish="isCountDownShow = true"
            />
          </van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: true // 是否展示倒计时
    }
  },
  methods: {
    // 使用辅助函数
    ...mapMutations(['setUser']),
    // 表单提交事件
    async onSubmit () {
      // 引入Toast组件后，会自动在Vue的prototype上挂载$toast方法，便于在组件内调用
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 展示时长(ms)，值为0时，toast不会消失
      })
      try {
        const { data } = await login(this.user)
        this.$toast.success('登录成功') // 会先把其他的toast清除
        // 调用mutations里的方法
        this.setUser(data.data)
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
        // console.dir(err)
      }
    },
    // 注册点击验证码事件
    async onSendSms () {
      try {
        // validate验证表单，支持传入name来验证单个或部分表单项
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log(err)
      }
      this.isCountDownShow = false

      try {
        await sendSms(this.user.mobile)
        this.$toast.success('发送成功')
      } catch (err) {
        this.isCountDownShow = true
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 156px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
