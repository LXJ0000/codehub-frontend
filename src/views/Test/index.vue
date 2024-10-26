<template>
  <button v-on:click="login">xxx</button>
</template>

<script setup>
console.log('Test')
import { getSDK } from '@openim/wasm-client-sdk'

const IMSDK = getSDK()

const config = {
  userID: '7253472263', // IM 用户 userID
  token: '123123123', // IM 用户令牌
  platformID: 345, // 当前登录平台号
  apiAddr: 'http://localhost:10002', // IM api 地址，一般为`http://your-server-ip:10002`或`https://your-server-ip/api
  wsAddr: 'ws://localhost:10001', // IM ws 地址，一般为`ws://your-server-ip:10001`(@openim/wasm-client-sdk)或`ws://your-server-ip:10003`(open-im-sdk)
}
const login = () => {
  IMSDK.getLoginStatus()
    .then(({ data }) => {
      // data: 登录状态LoginStatus
      console.log('data', data)
      if (data == 3) {
        IMSDK.logout()
          .then(() => {
            // 退出登录成功
            console.log('退出登录成功 = ====== ====== = == ')
          })
          .catch(({ errCode, errMsg }) => {
            // 调用失败
            console.log('退出登录失败', errCode, errMsg)
          })
      }
    })
    .catch(({ errCode, errMsg }) => {
      // 调用失败
      console.log(errCode, errMsg)
    })
  IMSDK.login(config)
    .then(() => {
      console.log('登录成功===================================================')
    })
    .catch(({ errCode, errMsg }) => {
      console.log(errCode, errMsg)
    })
}
</script>

<style></style>
