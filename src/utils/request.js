// 封装axios请求模块 配置统一请求
import axios from 'axios'

// 创建一个axios实例对象
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/' // 基础路径
})

// 配置请求拦截器

// 配置响应拦截器

export default request
