// import Vue from 'vue'
// 导入dayjs
import dayjs from 'dayjs'
// 加载语言环境
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 全局使用
dayjs.locale('zh-cn')

// 全局过滤器：处理相对时间
// Vue.filter('relativeTime', value => {
//   return dayjs().to(dayjs(value))
// })

// 导出 局部进行使用
export default dayjs
