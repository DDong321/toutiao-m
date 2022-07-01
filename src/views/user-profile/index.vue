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
    <van-cell class="avatar-cell" title="头像" is-link center @click="$refs.file.click()">
      <van-image
        class="avatar"
        round
        fit="cover"
        :src="user.photo"
      />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow=true"/>
    <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link @click="isUpdateGenderShow=true"/>
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow = true"/>
    <!-- /个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%;"
      position="bottom"
    >
      <UpdateName v-if="isUpdateNameShow" :localName.sync="user.name"/>
    </van-popup>
    <!-- /编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <UpdateGender v-if="isUpdateGenderShow" :localGender.sync="user.gender"/>
    </van-popup>
    <!-- /编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <UpdateBirthday v-if="isUpdateBirthdayShow" :localBirthday.sync="user.birthday"/>
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%;"
    >
      <UpdatePhoto :imgSrc="imgSrc" :photo.sync="user.photo"/>
    </van-popup>
    <!-- /编辑头像 -->
    <!-- 上传文件用的input标签 隐藏 input标签具有的hidden属性 -->
    <input type="file" ref="file" hidden @change="onFileChange">
  </div>
</template>
<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/Update-photo'

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  data () {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false, // 控制编辑昵称弹层显示
      isUpdateGenderShow: false, // 控制编辑性别弹层显示
      isUpdateBirthdayShow: false, // 控制编辑生日弹层显示
      isUpdatePhotoShow: false, // 控制编辑头像弹层显示
      imgSrc: '' // 预览的图片路径
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
    },
    // 文件改变(本地input上传后)触发的事件
    onFileChange () {
      // console.log(this.$refs.file.files[0])
      // 1.拿到上传文件对象
      const file = this.$refs.file.files[0]
      // 2.转成图片的src路径
      this.imgSrc = window.URL.createObjectURL(file) // blob:http://...
      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true
      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决：每次使用完毕，把它的 file 清空
      this.$refs.file.value = ''
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
