<template>
  <aside class="right-sidebar">
    <!-- <div v-if="isLogin" class="login-card">
      <img
        src="https://tvax1.sinaimg.cn/crop.0.0.1079.1079.180/006UebRdly8hket8gaah4j30tz0tzmz2.jpg?KID=imgbed,tva&Expires=1731430147&ssig=4qtJVzbHnZ"
        alt="登录横幅"
        class="login-banner"
      />
      <a-button type="primary" block class="login-btn"> 立即登录 </a-button>
      <div class="register-prompt">
        还没有悦联？
        <a href="#" class="register-link">立即注册！</a>
      </div>
    </div> -->
    <div class="profile-card">
      <div class="avatar" @click="goToUserProfile()">
        <img :src="user.avatar" alt="头像" class="profile-avatar" />
      </div>
      <div class="profile-header">
        <div class="profile-info">
          <h4 class="profile-name">{{ user.name }}</h4>
          <p class="profile-signature">{{ user.about_me }}</p>
        </div>
      </div>
      <div class="profile-stats">
        <div class="profile-stat">
          <span class="stat-label">关注 </span>
          <span class="stat-value">{{ user.followingCount }}</span>
        </div>
        <div class="profile-stat">
          <span class="stat-label">粉丝 </span>
          <span class="stat-value">{{ user.followerCount }}</span>
        </div>
        <div class="profile-stat">
          <span class="stat-label">帖子 </span>
          <span class="stat-value">{{ user.postCount }}</span>
        </div>
      </div>
      <!-- <a-button type="primary" block @click="showModal" style="border-radius: 16px"
        >退出登录</a-button
      > -->
      <!-- <a-modal
        v-model:open="open"
        centered
        title="确定要退出登录吗？"
        @ok="handleLogout"
        v-model:width="modalWidth"
      >
        <p>该操作不可撤销！</p>
      </a-modal> -->
    </div>

    <div class="hot-topics">
      <div class="topics-header">
        <h3>悦联热搜</h3>
        <!-- <a-button type="link" class="refresh-btn" style="border-radius: 16px">
          <RefreshCw class="refresh-icon" />
          刷新
        </a-button> -->
        <RefreshCw class="refresh-icon" />
      </div>

      <a-list :dataSource="hotTopics" class="topics-list">
        <template #renderItem="{ item, index }">
          <a-list-item>
            <div class="topic-item">
              <span class="topic-rank" :class="{ 'top-3': index < 3 }">{{ index + 1 }}</span>
              <span class="topic-title">{{ item.title }}</span>
              <span class="topic-count">{{ item.count }}</span>
            </div>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import { fetchUserInfo } from '@/services/api'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
// import { message } from 'ant-design-vue'

const userStore = useUserStore()
const router = useRouter()
// const open = ref(false)
// const modalWidth = ref(300)
// const showModal = () => {
//   open.value = true
// }
// const handleLogout = async () => {
//   try {
//     await userStore.logout()
//     message.success('退出登录成功')
//     router.push('/login')
//   } catch (error) {
//     message.error(error.message || '退出登录失败，请重试')
//   }
// }
// const isLogin = ref(false)
const user = ref({})
const hotTopics = ref([
  { title: '杭州一宝马路口连撞多车', count: '57651' },
  { title: '李子柒回归', count: '下午趋势' },
  { title: '调集最强专家力量巡诊', count: '950888' },
  { title: '珠海警方通报一起重大刑事案件', count: '959795' },
  { title: '全国法定节假日将增加', count: '下午趋势' },
  { title: '宋再临去世', count: '最近趋势' },
  { title: '秘鲁的中餐文化Chifa', count: '' },
  { title: 'A股跳水原因找到了', count: '71814' },
  { title: '停止这种AI视频', count: '213412' },
  { title: '李子柒停更原因', count: '21:24登顶' },
])

const getUserInfo = async () => {
  try {
    const response = await fetchUserInfo()
    // const response = await request('/user/profile', 'GET')
    if (response.code === 0) {
      user.value.followingCount = response.data.profile.relation_stat.followee
      user.value.followerCount = response.data.profile.relation_stat.follower
      user.value.postCount = response.data.profile.post_cnt
      user.value.name = response.data.profile.nick_name
        ? response.data.profile.nick_name
        : response.data.profile.user_name
      user.value.avatar = response.data.profile.avatar
      user.value.birthday = response.data.profile.birthday
      user.value.about_me = response.data.profile.about_me
        ? response.data.profile.about_me
        : '这个人很懒，什么都没留下'
      user.value.email = response.data.profile.email
      user.value.id = response.data.profile.relation_stat.user_id
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}

const goToUserProfile = () => {
  router.push(`/wb/u/${userStore.user.user_id}`)
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.right-sidebar {
  margin-left: 5px;
  margin-right: 5px;
  width: 300px;
  position: sticky;
  top: 90px;
}

.login-card,
.profile-card {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}

.login-banner {
  width: 100%;
  margin-bottom: 16px;
}

.login-btn {
  background: #ff8200;
  border-color: #ff8200;
  margin-bottom: 12px;
}

.register-prompt {
  text-align: center;
  color: #666;
}

.register-link {
  color: #ff8200;
}

.hot-topics {
  background: #fff;
  border-radius: 4px;
  padding: 24px;
}

.topics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.refresh-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
}

.topic-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.topic-rank {
  font-weight: bold;
  color: #999;
}

.topic-rank.top-3 {
  color: #ff8200;
}

.topic-count {
  margin-left: auto;
  color: #999;
  font-size: 12px;
}

:deep(.ant-list-item) {
  padding: 12px 0;
}
.avatar {
  display: flex;
  justify-content: center;
  img {
    width: 150px;
    height: 150px;
    border: 1px solid #d4ecf4;
  }
}
.profile-header {
  display: flex;

  /* justify-content: center; */
  /* margin-bottom: 16px; */
}

.profile-avatar {
  /* width: 40px;
  height: 40px; */
  border-radius: 50%;
  margin-right: 12px;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-weight: bold;
  margin-bottom: 4px;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.profile-signature {
  color: #666;
  font-size: 14px;
  display: flex;
  justify-content: center;
  /* margin-top: 10px; */
}

.profile-stats {
  display: flex;
  justify-content: space-evenly;
  margin: 0 auto;
  margin-bottom: 16px;
}

.profile-stat {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.stat-value {
  font-weight: bold;
}
</style>
