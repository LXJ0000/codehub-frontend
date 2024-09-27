import { request } from '@/utils/request'

export const login = (data) => {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}

export const getRouter = (data) => {
  return request({
    url: location.origin + '/api/getPermission',
    method: 'get',
    data,
  })
}
