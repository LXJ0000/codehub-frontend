import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IMSDK } from '@/utils/imCommon'

export const useMessageStore = defineStore('message', () => {
  const messageList = ref([])
  const getAdvancedHistoryMessageList = async (conversationID) => {
    try {
      const { data } = await IMSDK.getAdvancedHistoryMessageList({
        lastMinSeq: 0,
        count: 20,
        startClientMsgID: '',
        conversationID: conversationID,
      })
      console.log('log.success.getAdvancedHistoryMessageList', data)
      messageList.value = data.messageList
      return data.messageList
    } catch (error) {
      const { errCode, errMsg } = error
      console.log('log.fail.getAdvancedHistoryMessageList', errCode, errMsg)
      return null
    }
  }
  const getAdvancedHistoryMessageListReverse = async (conversationID) => {
    IMSDK.getAdvancedHistoryMessageListReverse({
      lastMinSeq: 0,
      count: 20,
      startClientMsgID: '',
      conversationID: conversationID,
    })
      .then(({ data }) => {
        messageList.value = data.messageList
        console.log('log.success.getAdvancedHistoryMessageList', data)
      })
      .catch(({ errCode, errMsg }) => {
        console.log('log.fail.getAdvancedHistoryMessageList', errCode, errMsg)
      })
  }
  const sendMessage = async (recvID, msgItem) => {
    IMSDK.sendMessage({
      recvID: recvID,
      groupID: '',
      message: msgItem,
    })
      .then(({ data }) => {
        console.log('log.success.store.sendMessage', 'data', data)
      })
      .catch(({ errCode, errMsg }) => {
        console.log('log.fail.store.sendMessage', errCode, errMsg)
      })
  }
  const createTextMessage = async (text) => {
    try {
      const { data } = await IMSDK.createTextMessage(text)
      console.log('log.success.createTextMessage', data)
      return data
    } catch (error) {
      const { errCode, errMsg } = error
      console.log('log.fail.createTextMessage', errCode, errMsg)
      return null
    }
  }
  return {
    messageList,
    getAdvancedHistoryMessageList,
    getAdvancedHistoryMessageListReverse,
    sendMessage,
    createTextMessage,
  }
})
