import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IMSDK } from '@/utils/imCommon'

export const useFriendReqStore = defineStore('firendReq', () => {
  const firendReq = ref([])
  const unResolve = ref(0)
  const getFriendApplicationList = async () => {
    const recv = ref([]) // 接受的好友请求
    const send = ref([]) // 发送的好友请求
    await IMSDK.getFriendApplicationListAsRecipient()
      .then(({ data }) => {
        console.log('log.success.getFriendApplicationListAsRecipient', data)
        recv.value = data
      })
      .catch(({ errCode, errMsg }) => {
        console.log('log.error.getFriendApplicationListAsRecipient', errCode, errMsg)
      })
    await IMSDK.getFriendApplicationListAsApplicant()
      .then(({ data }) => {
        console.log('log.success.getFriendApplicationListAsApplicant', data)
        send.value = data
      })
      .catch(({ errCode, errMsg }) => {
        console.log('log.error.getFriendApplicationListAsApplicant', errCode, errMsg)
      })
    firendReq.value = []
    unResolve.value = 0
    recv.value.forEach((item) => {
      let status = '等待验证'
      if (item.handleResult === 1) {
        status = '已同意'
      } else if (item.handleResult === -1) {
        status = '已拒绝'
      } else {
        unResolve.value++
      }
      firendReq.value.push({
        userID: item.fromUserID,
        nickname: item.fromNickname,
        addTime: new Date(item.createTime).toLocaleDateString(),
        message: item.reqMsg,
        status: status,
      })
    })
    send.value.forEach((item) => {
      let status = '已发送'
      if (item.handleResult === 1) {
        status = '对方同意好友申请'
      } else if (item.handleResult === -1) {
        status = '对方拒绝好友申请'
      }
      firendReq.value.push({
        userID: item.toUserID,
        nickname: item.toNickname,
        avatar: item.toFaceURL,
        addTime: new Date(item.createTime).toLocaleDateString(),
        message: '已发送验证消息',
        status: status,
      })
    })
    // firendReq 按照 addTime 降序排列
    firendReq.value.sort((a, b) => {
      return new Date(b.addTime) - new Date(a.addTime)
    })
    console.log('log.success.getFriendApplicationList', firendReq.value)
    return firendReq.value
  }
  return {
    firendReq,
    unResolve,

    getFriendApplicationList,
  }
})
