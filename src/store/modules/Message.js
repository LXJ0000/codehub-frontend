import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IMSDK } from '@/utils/imCommon'

export const useMessageStore = defineStore('message', () => {
  const messageList = ref([])
  const lastMinSeq = ref(0)
  const startClientMsgID = ref(null)
  const isEnd = ref(false)
  const getAdvancedHistoryMessageList = async (conversationID, isFirst) => {
    try {
      if (isFirst) {
        lastMinSeq.value = 0
        startClientMsgID.value = null
        isEnd.value = false
        messageList.value = []
      }
      const { data } = await IMSDK.getAdvancedHistoryMessageList({
        lastMinSeq: lastMinSeq.value,
        count: 20,
        startClientMsgID: startClientMsgID.value ? startClientMsgID.value : '',
        conversationID: conversationID,
      })
      // messageList.value = data.messageList
      lastMinSeq.value = data.lastMinSeq
      startClientMsgID.value = data.messageList[0].clientMsgID
      isEnd.value = data.isEnd
      console.log('log.success.getAdvancedHistoryMessageList', messageList.value, data)
      data.messageList = data.messageList.filter((item) => {
        if (item.contentType === 1201) {
          // 解析 JSON 字符串
          const detail = JSON.parse(item.notificationElem.detail)
          // 确保 item.textElem 已经被初始化为一个对象
          if (!item.textElem) {
            item.textElem = {}
          }
          // 取出 handleMsg 并赋值给 item.textElem.content
          item.textElem.content = detail.handleMsg
        }
        // 如果消息内容为空，则不显示
        return item.textElem && item.textElem.content
      })

      if (messageList.value && messageList.value.length > 0) {
        messageList.value = [...data.messageList, ...messageList.value]
      } else {
        messageList.value = data.messageList
      }
      return { data: messageList.value, isEnd: isEnd.value }
    } catch (error) {
      const { errCode, errMsg } = error
      console.log('log.fail.getAdvancedHistoryMessageList', errCode, errMsg)
      return null
    }
  }
  const getAdvancedHistoryMessageListReverse = async (conversationID) => {
    IMSDK.getAdvancedHistoryMessageListReverse({
      lastMinSeq: lastMinSeq.value,
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
