import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载全局样式
import './styles/index.less'

// 加载注册vant
import Vant from 'vant'
import 'vant/lib/index.css'

// 使用 lib-flexible 动态设置REM基准值（html 标签的字体大小）
// 使用(postcss css处理工具)postcss-pxtorem 将px转为rem (配置.postcssrc.js文件)
import 'amfe-flexible'

// 导入dayjs.js文件
// import '@/utils/dayjs'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
