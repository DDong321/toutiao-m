// 封装axios请求模块 配置统一请求
import axios from 'axios'
import store from '@/store'

// 创建一个axios实例对象
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/' // 基础路径
})

// - 添加请求拦截器
// 主要作用：统一给有权限的接口注入请求头token
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const { token } = store.state
  // 如果用户没有登录，token值为null，会报错，所有加一个判断条件
  if (token && token.token) {
    // config.headers = { Authorization: ... }  // 不能这样写 会覆盖其他内容
    config.headers.Authorization = `Bearer ${token.token}`
  }
  // console.log(config)
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 无感刷新技术点：
// 短token用来发请求，在请求头中携带，一般2小时过期
// 长token refresh_token是用来获取新的短token，一般14天过期
// 问：能不能把短token过期时间加长？比如14天？
// 答：不能涉及到安全问题，防止token被盗。可以登录密码加密，MDS加密(MD5本质是一个插件，调用它的方法就可以生成加密后的密码)，但是需要后端配合

// 无感刷新思路：
// 1.用户发送请求，后端返回401，说明token过期，统一监测后端返回的401代码
// 2.监测到401报错，就拿refresh_token发请求获取最新的token
// 3.自动再发一次用户上次发的请求

// - 添加响应拦截器
// 主要作用：
// 1.无感刷新
// 2.对后端返回的数据进行统一处理
// 3.对后端数据的错误进行统一处理
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log(response)
  return response
}, async function (error) {
  // 对响应错误做点什么
  // 检查token过期
  if (error.response.status === 401) {
    // 发请求，刷新token
    // 注意：不能使用request请求，会死循环，因为request设置了请求拦截器，会注入旧的token
    // 使用axios发请求
    const { data } = await axios({
      url: 'http://toutiao.itheima.net/v1_0/authorizations',
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${store.state.token.refresh_token}`
      }
    })
    // 新token存到vuex内，存到本地存储，不能用辅助函数
    store.commit('setUser', {
      ...store.state.token,
      token: data.data.token
    })
    // 再发一次上次发送过的请求
    return request(error.config)
  }
  return Promise.reject(error)
})

export default request
