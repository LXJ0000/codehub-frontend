import { request } from '@/utils/request'

// === 用户相关接口 ===

// 获取我的信息
export const fetchUserInfo = () => {
  return request('/user/profile', 'GET')
}

// 获取用户信息
export const getUserInfo = (user_id) => {
  return request('/user', 'GET', { user_id })
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
export const fetchPosts = (author_id = 0, last = -1, size = 10) => {
  return request('/post/reader', 'GET', { author_id, last, size })
}

// 获取本人帖子列表
export const fetchWriterPosts = (last = -1, size = 10) => {
  return request('/post/writer', 'GET', { last, size })
}

// 点赞动态
export const likePost = (postId, isLike) => {
  return request('/intr/like', 'POST', {
    biz: 'post',
    biz_id: postId,
    is_like: isLike,
  })
}

// 收藏动态
export const collectPost = (postId, isCollect) => {
  return request('/intr/collect', 'POST', {
    biz: 'post',
    biz_id: postId,
    // post_id: postId,
    is_collect: isCollect,
    collection_id: 0, // 默认只有一个收藏夹 id 为 0
  })
}

// 发布新动态
export const submitPost = (content, title = 'title', status = 'publish', abstract = '') => {
  return request('/post', 'POST', { title, content: content, status, abstract })
}

// 发布新内容（用于模态框提交）
export const submitNewPost = (postData) => {
  return request('/post', 'POST', postData)
}

// 删除动态
export const deletePost = (postId) => {
  return request('/post.delete', 'POST', { post_id: postId })
}

// 发表一级评论
export const submitComment = (postId, content) => {
  return request('/comment', 'POST', { biz: 'post', biz_id: postId, content: content })
}

// 回复一级评论
export const submitSecondComment = (postId, content, parentId) => {
  return request('/comment', 'POST', {
    biz: 'post',
    biz_id: postId,
    content: content,
    parent_id: parentId,
  })
}

// 回复某个二级评论
export const submitSecondToUserComment = (postId, content, parentId, userId) => {
  return request('/comment', 'POST', {
    biz: 'post',
    biz_id: postId,
    content: content,
    parent_id: parentId,
    to_user_id: userId,
  })
}

// 获取一级评论列表
export const fetchFirstComments = (postId, min_id = '0', limit = 3) => {
  return request('/comment.list', 'POST', { biz: 'post', biz_id: postId, min_id, limit })
}

// 获取二级评论列表
export const fetchSecondComments = (postId, parent_id, min_id = '0', limit = 3) => {
  return request('/comment.list', 'POST', {
    biz: 'post',
    biz_id: postId,
    parent_id: parent_id,
    min_id,
    limit,
  })
}

// 点赞评论
export const likeComment = (commentId, isLike) => {
  return request('/intr/like', 'POST', {
    biz: 'comment',
    biz_id: commentId,
    is_like: isLike,
  })
}
