<template>
  <div class="update-photo">
    <img class="img" :src="imgSrc" ref="img" alt="">

    <div class="toolbar">
      <div class="cancel" @click="$parent.$parent.isUpdatePhotoShow=false">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'

export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    // 预览图片地址信息
    imgSrc: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      cropper: null // 裁剪器对象
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    // 图片裁剪 在mounted内写
    // 1.安装插件 cropperjs
    // 2.引入js和css
    // 3.查看文档 配置cropper
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      // autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false
    })
    // 不能在这里调用 this.cropper.getCroppedCanvas() 方法！因为裁剪器还没初始化好！
  },
  methods: {
    // 确定事件
    onConfirm () {
      // 基于服务端的裁切使用 getData 方法获取裁切参数
      // 返回的式裁切的坐标，交给服务端去裁切
      // console.log(this.cropper.getData())

      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象(类似于URL.createObjectURL)
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        // console.log(blob) // 裁剪后的结果信息
        // 上传文件
        // 1.看懂接口文档 注意 file的参数类型 和 Content-Type的类型
        // 2.能够利用原生语法上传文件
        this.$toast.loading({
          message: '保存中...',
          forbidClick: true, // 禁止背景点击
          duration: 0 // 持续展示
        })
        try {
          // 错误的用法
          // 如果接口要求 Content-Type 是 application/json
          // 则传递普通 JavaScript 对象
          // updateUserPhoto({
          //   photo: blob
          // })
          // 如果接口要求 Content-Type 是 multipart/form-data
          // 则你必须传递 FormData 对象

          // 上传文件
          // 1.创建formData对象
          const formData = new FormData()
          // 2.给对象添加key 和 value  photo是文档给的参数
          formData.append('photo', blob)
          // 3.发请求
          const { data } = await updateUserPhoto(formData)
          // 4.更新头像视图
          this.$emit('update:photo', data.data.photo)
          // 5.关闭弹出层
          this.$parent.$parent.isUpdatePhotoShow = false
          // 提示成功
          this.$toast.success('更新成功')
        } catch (err) {
          this.$toast.fail('更新失败')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;

  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;

    .cancel, .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}

.img {
  display: block;
  max-width: 100%;
}
</style>
