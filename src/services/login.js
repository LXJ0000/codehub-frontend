import { request } from '@/utils/request'
import { http } from '@/utils/request'
export const login = (data) => {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}

export const logoutApi = () => {
  return request({
    url: '/logout',
    method: 'post',
  })
}

export const getRouter = (data) => {
  return request({
    url: location.origin + '/api/getPermission',
    method: 'get',
    data,
  })
}

export const sendCode = (data) => {
  return http({
    url: '/send_sms_code',
    method: 'post',
    data,
  })
}
export const loginSms = (data) => {
  return http({
    url: '/login/sms',
    method: 'post',
    data,
  })
}
