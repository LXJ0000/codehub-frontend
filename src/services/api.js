import { request } from '@/utils/request'

// 获取用户信息
export const fetchUserInfo = () => {
  return request('/user/profile', 'GET')
}

// 获取用户动态列表
export const fetchPosts = (page = 1, size = 10) => {
  return request('/post/reader', 'GET', { page, size })
}

// 点赞动态
export const likePost = (postId, isLike) => {
  return request('/post/like', 'POST', {
    post_id: postId,
    is_like: isLike,
  })
}

// 收藏动态
export const collectPost = (postId, isCollect) => {
  return request('/post/collect', 'POST', {
    post_id: postId,
    is_collect: isCollect,
    collection_id: 0, // 默认只有一个收藏夹 id 为 0
  })
}

// 发布新动态
export const submitPost = (content, title = 'title', status = 'publish', abstract = 'abstract') => {
  return request('/post', 'POST', { title, content: content, status, abstract })
}

// 发布新内容（用于模态框提交）
export const submitNewPost = (postData) => {
  return request('/post', 'POST', postData)
}

// 搜索功能
export const searchPosts = (query) => {
  return request('/search', 'GET', { query })
}

// 获取话题列表
export const fetchTrendingTopics = () => {
  return request('/trending/topics', 'GET')
}

// 登出
export const logout = () => {
  return request('/logout', 'POST')
}
