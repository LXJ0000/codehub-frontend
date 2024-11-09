import { request } from '@/utils/request'

export const login = (data) => {
  return request('/login', 'POST', data)
}

export const logoutApi = () => {
  return request('/logout', 'POST')
}

export const sendCode = (data) => {
  return request('/send_sms_code', 'POST', data)
}

export const loginSms = (data) => {
  return request('/login/sms', 'POST', data)
}

export const userSearch = (data) => {
  return request('/user/search', 'POST', data)
}
