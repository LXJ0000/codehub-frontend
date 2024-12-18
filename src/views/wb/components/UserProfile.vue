<template>
  <div class="min-h-screen rounded-md">
    <!-- Back Button -->
    <div class="fixed p-4 z-10 rounded-md" @click="$router.go(-1)">
      <button class="text-gray-800 text-xl flex items-center text-white font-bold">
        <ChevronLeft class="h-6 w-6" />
        返回
      </button>
    </div>

    <!-- Cover Image -->
    <img
      src="https://ww1.sinaimg.cn/mw2000/70ace9b7ly1ggzusnypoej20yi0yiaop.jpg"
      alt=""
      class="relative h-72 w-full object-cover rounded-t-md"
    />
    <!-- <div class="relative h-64 bg-white"></div> -->

    <!-- Profile Section -->
    <div class="relative px-4 bg-white pb-4 rounded-md">
      <!-- Avatar and Name Section -->
      <div class="flex items-start gap-3 mb-4">
        <div class="relative -mt-6">
          <div class="rounded-full border-4 border-white overflow-hidden w-24 h-24">
            <a-upload
              :show-upload-list="false"
              :before-upload="beforeUpload"
              @change="handleChange"
              :customRequest="customRequest"
            >
              <img
                :src="currentUser.avatar"
                alt="Profile Avatar"
                class="w-full h-full object-cover"
              />
            </a-upload>
          </div>
        </div>
        <div class="flex-1 mt-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="text-l font-bold">{{ currentUser.name }}</div>
              <span class="text-pink-500">🔍</span>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="relative"
                @mouseenter="showFollowOptions = true"
                @mouseleave="showFollowOptions = false"
              >
                <button
                  v-if="currentUser.id !== userStore.user.user_id"
                  @click="currentUser.inFollow ? unfollowUser() : followUser()"
                  class="px-4 py-1.5 rounded-full bg-gray-100 text-gray-900"
                >
                  {{ getFollowButtonText }}
                </button>
                <!-- Follow Options Dropdown -->
                <div
                  v-if="showFollowOptions"
                  class="absolute left-0 mt-2 w-36 bg-white rounded-lg shadow-lg py-2 z-20"
                >
                  <button
                    v-for="(option, index) in followOptions"
                    :key="index"
                    class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                    @click="handleFollowOption(option)"
                  >
                    {{ option }}
                  </button>
                </div>
              </div>
              <button
                class="px-4 py-1.5 rounded-full bg-gray-100 text-gray-900"
                v-if="currentUser.id !== userStore.user.user_id"
              >
                私信
              </button>
              <div
                v-if="currentUser.id !== userStore.user.user_id"
                class="relative"
                @mouseenter="showMoreOptions = true"
                @mouseleave="showMoreOptions = false"
              >
                <button class="px-2 py-1.5 rounded-full bg-gray-100 text-gray-900">
                  <MoreHorizontal class="h-5 w-5" />
                </button>
                <!-- More Options Dropdown -->
                <div
                  v-if="showMoreOptions"
                  class="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg py-2 z-20"
                >
                  <button
                    v-for="(option, index) in moreOptions"
                    :key="index"
                    class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                    @click="handleMoreOption(option)"
                  >
                    {{ option }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex gap-6 text-sm mt-2">
            <span
              ><strong>{{ currentUser.followerCount }}</strong> 粉丝</span
            >
            <span
              ><strong>{{ currentUser.followingCount }}</strong> 关注</span
            >
            <span
              ><strong>{{ currentUser.postCount }}</strong> 帖子</span
            >
          </div>
        </div>
      </div>

      <!-- Video Stats -->
      <div class="inline-block bg-orange-50 text-orange-600 rounded-lg px-3 py-1 text-sm mb-4">
        视频累计播放量{{ currentUser.videoPlayCount }}
      </div>

      <!-- Basic Info -->
      <div class="text-gray-600 space-y-2 text-sm">
        <p v-if="currentUser.about_me">{{ currentUser.about_me }}</p>
        <p v-if="currentUser.ipLocation" class="flex items-center gap-1">
          <MapPin class="h-4 w-4" />
          IP属地：{{ currentUser.ipLocation }}
          <HelpCircle class="h-4 w-4" />
        </p>

        <!-- Expandable Info -->
        <div v-if="hasAdditionalInfo" class="relative">
          <button
            @click="showMoreInfo = !showMoreInfo"
            class="absolute right-0 -top-6 text-gray-400 hover:text-gray-600"
          >
            <ChevronDown
              class="h-5 w-5 transition-transform duration-200"
              :class="{ 'transform rotate-180': showMoreInfo }"
            />
          </button>

          <!-- Additional Info (Expandable) -->
          <div v-if="showMoreInfo" class="space-y-2">
            <p v-if="currentUser.birthday">{{ currentUser.birthday }} {{ currentUser.zodiac }}</p>
            <p v-if="currentUser.joinDate">{{ currentUser.joinDate }} 加入微博</p>
            <p v-if="currentUser.creditScore" class="flex items-center gap-1">
              <Award class="h-4 w-4" />
              {{ currentUser.creditScore }}
            </p>
            <p v-if="currentUser.friendInfo">{{ currentUser.friendInfo }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <nav class="profile-nav mt-6">
      <a-menu mode="horizontal" :selectedKeys="[selectedTab]" @select="handleTabSelect">
        <a-menu-item key="weibo">文章</a-menu-item>
        <a-menu-item key="photos">相册</a-menu-item>
        <a-menu-item key="likes">赞</a-menu-item>
      </a-menu>
    </nav>
    <div class="profile-content">
      <div v-if="selectedTab === 'weibo'">
        <!-- 将 posts 数据传递给 Feed 组件 -->
        <Feed :posts="posts" />
      </div>
      <div v-else-if="selectedTab === 'photos'">
        <!-- 显示用户的相册 -->
      </div>
      <div v-else-if="selectedTab === 'likes'">
        <!-- 显示用户赞过的内容 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import Feed from './FeedView.vue'
import * as api from '@/services/api'
import {
  ChevronLeft,
  ChevronDown,
  MoreHorizontal,
  MapPin,
  HelpCircle,
  Award,
} from 'lucide-vue-next'

const route = useRoute()
const userStore = useUserStore()
const selectedTab = ref('weibo')
const showMoreOptions = ref(false)
const showFollowOptions = ref(false)
const showMoreInfo = ref(false)

const currentUser = ref({
  id: '',
  avatar: '',
  name: '',
  followingCount: 0,
  followerCount: 0,
  inFollow: false,
  postCount: 0,
  about_me: '',
  ipLocation: '',
  videoPlayCount: 0,
  interactionCount: 0,
  birthday: '',
  zodiac: '',
  joinDate: '',
  creditScore: '',
  friendInfo: '',
})

const posts = ref([])
let currentPage = 1
let last = -1
let hasMorePosts = true
let isOwnProfile = false

const getFollowButtonText = computed(() => {
  if (currentUser.value.inFollow) {
    return '互相关注'
  } else {
    return '关注'
  }
})

const hasAdditionalInfo = computed(() => {
  return (
    currentUser.value.birthday ||
    currentUser.value.joinDate ||
    currentUser.value.creditScore ||
    currentUser.value.friendInfo
  )
})

const moreOptions = ['移除粉丝', '分享个人主页', '加入黑名单', '投诉她']

const followOptions = ['设为特别关注', '设置分组', '设置备注', '取消关注']

const followUser = async () => {
  try {
    const response = await api.followUser(currentUser.value.id)
    if (response.code === 0) {
      currentUser.value.inFollow = true
      currentUser.value.followerCount++
    }
  } catch (error) {
    console.error('Error following user:', error)
  }
}

const unfollowUser = async () => {
  try {
    const response = await api.unfollowUser(currentUser.value.id)
    if (response.code === 0) {
      currentUser.value.inFollow = false
      currentUser.value.followerCount--
    }
  } catch (error) {
    console.error('Error unfollowing user:', error)
  }
}

const handleMoreOption = (option) => {
  showMoreOptions.value = false
  // Handle option click
  console.log('Selected more option:', option)
}

const handleFollowOption = (option) => {
  showFollowOptions.value = false
  // Handle option click
  console.log('Selected follow option:', option)
}

const handleScroll = () => {
  const st = document.documentElement.scrollTop

  const triggerHeight = window.innerHeight * 0.9
  if (st > currentPage * triggerHeight) {
    if (hasMorePosts) {
      currentPage++
      fetchPosts()
    } else {
      // 如果鼠标滚动到底部，提示没有更多数据了
      if (document.documentElement.scrollHeight - document.documentElement.clientHeight === st) {
        message.info('没有更多了')
      }
    }
  }
}

// 切换标签事件
const handleTabSelect = (item) => {
  selectedTab.value = item.key
}

// 上传文件校验
const beforeUpload = (file) => {
  if (!isOwnProfile) {
    message.error('只能上传自己的头像！')
    return false
  }
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的文件！')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小需小于 2MB！')
  }
  return isJpgOrPng && isLt2M
}

// 自定义上传请求
const customRequest = async ({ file, onSuccess, onError }) => {
  const formData = new FormData()
  formData.append('avatar', file)

  try {
    const response = await api.uploadAvatar(formData)
    if (response.code === 0) {
      userStore.user.avatar = response.data.path
      currentUser.value.avatar = response.data.path
      onSuccess(response)
    } else {
      onError(new Error(response.message))
    }
  } catch (error) {
    onError(error)
  }
}

// 上传状态变化
const handleChange = (info) => {
  if (info.file.status === 'uploading') {
    console.log('Uploading:', info.file.name)
  }
  if (info.file.status === 'done') {
    message.success('头像更新成功')
  } else if (info.file.status === 'error') {
    message.error('请稍后重试')
  }
}

const fetchUserInfo = async () => {
  // 获取路由的用户 ID /wb/u/:userId
  const userId = route.params.userid
  try {
    const response = await api.getUserInfo(userId)
    if (response.code === 0) {
      const profile = response.data.profile
      currentUser.value = {
        id: profile.user_id,
        avatar: profile.avatar,
        name: profile.nick_name || profile.user_name,
        followingCount: profile.relation_stat.followee,
        followerCount: profile.relation_stat.follower,
        inFollow: profile.relation_stat.in_follow,
        postCount: profile.post_cnt,
        about_me: profile.about_me,
        ipLocation: 'IP属地', // This should come from API
        videoPlayCount: profile.video_play_count || 0,
        interactionCount: profile.interaction_count || 0,
        birthday: profile.birthday,
        zodiac: '狮子座', // This should come from API
        joinDate: '2018-08-28', // This should come from API
        creditScore: '信用较好',
        friendInfo: `她有 1 个好友，你们已经互相关注${profile.mutual_follow_days || 0}天了`,
      }
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}

const fetchPosts = async () => {
  try {
    let current = ref()
    if (currentUser.value.id === userStore.user.user_id) {
      current.value = await api.fetchWriterPosts(last)
    } else {
      current.value = await api.fetchPosts(currentUser.value.id, last)
    }
    if (current.value.code === 0) {
      current.value = current.value.data.post_list.map((item) => ({
        id: item.post.post_id,
        title: item.post.title,
        content: item.post.content,
        abstract: item.post.abstract,
        authorId: item.post.author_id,
        createdAt: new Date(item.post.created_at * 1000).toLocaleString(),
        created_at: item.post.created_at,
        status: item.post.status,
        liked: item.stat.liked,
        collected: item.stat.collected,
        likeCount: item.interaction.like_cnt,
        collectCount: item.interaction.collect_cnt,
        readCount: item.interaction.read_cnt,
        authorAvatar:
          item.post.author.avatar ||
          'https://avatars.githubusercontent.com/u/98313822?u=b615bc340136ea9f06cec4e05f0aee6b00118f82&v=4',
        authorName: item.post.author.nick_name || item.post.author.user_name,
        comment_count: item.comment_count,
      }))
      if (current.value.length < 10) {
        hasMorePosts = false
      }
      if (posts.value && last !== -1) {
        posts.value = [...posts.value, ...current.value]
      } else {
        posts.value = [...current.value]
      }
      last = current.value[current.value.length - 1].created_at
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
}

const removeLast = () => {
  last = -1
}

onMounted(async () => {
  removeLast()
  await fetchUserInfo()
  fetchPosts()
  window.addEventListener('scroll', handleScroll)
  if (currentUser.value.id === userStore.user.user_id) {
    isOwnProfile = true
  }
})

onUnmounted(() => {
  removeLast()
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
.profile-nav {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}
</style>
