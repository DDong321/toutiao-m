<template>
  <div class="update-birthday">
    <!--
      currentDate 双向绑定了日期选择器
        设置日期选择器的默认值
        同步日期选择器选择的日期
      min-date: 可选的最小日期
      max-date: 可选的最大日期
     -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$parent.$parent.isUpdateBirthdayShow=false"
      @confirm="onConfirm"
    />
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateGender',
  components: {},
  props: {
    localBirthday: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.localBirthday)
    }
  },
  created () {
  },
  methods: {
    // 确定事件
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
      try {
        await updateUserProfile({
          birthday: currentDate
        })
        // 更新视图
        this.$emit('update:localBirthday', currentDate)
        // 关闭弹层
        this.$parent.$parent.isUpdateBirthdayShow = false
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  },
  computed: {},
  watch: {},
  mounted () {
  }
}
</script>

<style scoped>

</style>
