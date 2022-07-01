// 用户相关的请求模块
import request from '@/utils/request'
// 导入vuex仓库的store 注意：js文件内不要写this
// import store from '@/store'

// 用户登录/注册
export const login = data => request({
  method: 'POST',
  url: '/v1_0/authorizations',
  data
})

// 发送验证码
export const sendSms = mobile => request({
  method: 'GET',
  url: `/v1_0/sms/codes/${mobile}`
})

// 获取用户自己的信息
export const getUserInfo = () => request({
  method: 'GET',
  url: '/v1_0/user'
  // headers: {
  //   Authorization: `Bearer ${store.state.token.token}`
  // }
})

// 获取用户频道列表
export const getUserChannels = () => request({
  method: 'GET',
  url: '/v1_0/user/channels'
})

// 添加关注
export const addFollow = target => request({
  method: 'POST',
  url: '/v1_0/user/followings',
  data: {
    target
  }
})

// 取消关注
export const deleteFollow = userId => request({
  method: 'DELETE',
  url: `/v1_0/user/followings/${userId}`
})

// 获取当前登录用户的个人资料
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}

// 更新用户资料
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}

// 更新用户照片资料
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}
