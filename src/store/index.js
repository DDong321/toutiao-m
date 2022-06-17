import Vue from 'vue'
import Vuex from 'vuex'
// 导入封装的本地存储函数
import { getItem, setItem, removeItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    token: getItem(TOKEN_KEY)
  },
  getters: {},
  mutations: {
    // 定义一个存储token的方法
    setUser (state, payload) {
      // 数据存储到state
      state.token = payload
      // 本地存储
      setItem(TOKEN_KEY, payload)
    },
    removeUser (state) {
      state.token = null
      removeItem(TOKEN_KEY)
    }
  },
  actions: {},
  modules: {}
})
