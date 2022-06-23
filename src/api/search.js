// 搜索相关的请求模块
import request from '@/utils/request'

// 搜索建议
export const getSearchSuggestions = q => request({
  method: 'GET',
  url: '/v1_0/suggestion',
  params: {
    q
  }
})

// 搜索结果
export const getSearchResults = params => request({
  method: 'GET',
  url: '/v1_0/search',
  params
})
