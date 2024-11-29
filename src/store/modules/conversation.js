import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { IMSDK } from '@/utils/imCommon'
import { useUserStore } from './user'

const userStore = useUserStore()
export const useConversationStore = defineStore(
  'conversation',
  () => {
    const myInfo = reactive({
      img: '',
      name: '',
    })
    /* 别人的信息（特指聊天对象） */
    const userInfo = reactive({
      img: '',
      name: '',
    })
    const userList = ref([
      {
        id: 1,
        name: '晴宝大于阳晴月亮',
        avatar: '/placeholder.svg?height=40&width=40',
        lastMessage: '可能在放假',
        time: '2024/06/10',
        unread: 0,
      },
      {
        id: 2,
        name: '代码源算法交流群',
        avatar: '/placeholder.svg?height=40&width=40',
        lastMessage: '...: 有静态单射',
        time: '2024/09/02',
        unread: 0,
      },
      {
        id: 3,
        name: 'TP-Link2025未来院',
        avatar: '/placeholder.svg?height=40&width=40',
        lastMessage: 'Jenny: SHEIN状况, 20w+...',
        time: '2024/08/28',
        unread: 0,
      },
      {
        id: 4,
        name: '🍔2024蓝桥杯',
        avatar: '/placeholder.svg?height=40&width=40',
        lastMessage: '郑帆帆-20230502044: 不...',
        time: '2024/08/26',
        unread: 0,
      },
      {
        id: 5,
        name: '好运连连',
        avatar: '/placeholder.svg?height=40&width=40',
        lastMessage: '啾咪',
        time: '2024/06/09',
        unread: 0,
      },
    ])
    const conversationList = ref([])
    /* 聊天记录 */
    const chatMessageList = ref([])

    const getConversationList = async (isScrollLoad = false) => {
      try {
        await userStore.tryLogin()
        const { data } = await IMSDK.getConversationListSplit({
          offset: isScrollLoad ? conversationList.value.length : 0,
          count: 20,
        })
        const cves = data
        conversationList.value = [...(isScrollLoad ? conversationList.value.length : []), ...cves]
        console.log(conversationList.value, '好友列表')
        return cves.length === 20
      } catch (error) {
        console.error(error)
        return false
      }
    }
    const setMyInfo = (data) => {
      myInfo.img = data.img
      myInfo.name = data.name
    }
    const setUserInfo = (data) => {
      userInfo.img = data.img
      userInfo.name = data.name
    }
    const upadteMessageList = (data) => {
      chatMessageList.value.push(data)
    }
    return {
      myInfo,
      userInfo,
      userList,
      chatMessageList,
      setMyInfo,
      setUserInfo,
      upadteMessageList,
      getConversationList,
      conversationList,
    }
  },
  {},
)
