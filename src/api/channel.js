// 频道请求模块
import request from '@/utils/request'

// 获取频道的文章列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}
