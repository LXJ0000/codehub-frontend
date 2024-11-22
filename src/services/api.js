import { request } from '@/utils/request'

// === 用户相关接口 ===

// 获取我的信息
export const fetchUserInfo = () => {
  return request('/user/profile', 'GET')
}

// 搜索用户：关键字模糊查询
export const searchPosts = (query) => {
  return request('/search', 'GET', { query })
}

// 退出登录
export const logout = () => {
  return request('/logout', 'POST')
}

// 批量查询用户信息
export const batchGetUserInfo = (userIds) => {
  return request('/user.batch', 'POST', { user_ids: userIds })
}

// === 帖子相关接口 ===

// 获取用户动态列表
export const fetchPosts = (page = 1, size = 10) => {
  return request('/post/reader', 'GET', { page, size })
}

// 获取本人帖子列表
export const fetchWriterPosts = (page = 1, size = 10) => {
  return request('/post/writer', 'GET', { page, size })
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
