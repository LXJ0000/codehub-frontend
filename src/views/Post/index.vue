<template>
  <div class="home-page">
    <header class="header module">
      <div class="logo">
        <!-- <img src="/path-to-bilibili-logo.png" alt="Bilibili Logo" /> -->
        <h1>Logo</h1>
      </div>
      <nav class="main-nav">
        <a href="#" v-for="item in navItems" :key="item" class="nav-item">{{ item }}</a>
      </nav>
      <div class="search-bar">
        <a-input-search v-model:value="searchQuery" placeholder="搜索" @search="onSearch" />
      </div>
      <div class="user-menu">
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link" @click.prevent>
            <a-avatar :src="currentUser.avatar" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="0">
                <router-link to="/user/profile" class="menu-link">个人主页</router-link>
              </a-menu-item>
              <a-menu-item key="1">
                <router-link to="/user/settings" class="menu-link">用户设置</router-link>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="3" @click="handleLogout">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-badge :count="3" class="item">
          <BellOutlined style="font-size: 20px" />
        </a-badge>
        <a-badge :count="5" class="item">
          <MessageOutlined style="font-size: 20px" />
        </a-badge>
        <a-button type="primary" @click="showPostModal">投稿</a-button>
      </div>
    </header>

    <div class="main-content">
      <aside class="user-profile module">
        <router-link to="/user/profile" class="user-info">
          <a-avatar :size="64" :src="currentUser.avatar" />
          <h2>{{ currentUser.name }}</h2>
        </router-link>
        <div class="user-stats">
          <router-link to="/user/following" class="stat-item">
            <div class="stat-value">{{ currentUser.followingCount }}</div>
            <div class="stat-label">关注</div>
          </router-link>
          <router-link to="/user/followers" class="stat-item">
            <div class="stat-value">{{ currentUser.followerCount }}</div>
            <div class="stat-label">粉丝</div>
          </router-link>
          <router-link to="/user/posts" class="stat-item">
            <div class="stat-value">{{ currentUser.postCount }}</div>
            <div class="stat-label">动态</div>
          </router-link>
        </div>
      </aside>

      <main class="feed module">
        <div class="post-creation">
          <a-input
            v-model:value="newPostContent"
            placeholder="有什么想和大家分享的？"
            :maxLength="20"
            showCount
          />
          <div class="post-actions">
            <SmileOutlined class="action-icon" />
            <PictureOutlined class="action-icon" />
            <VideoCameraOutlined class="action-icon" />
            <a-button type="primary" @click="submitPost">发布</a-button>
          </div>
        </div>

        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="all" tab="全部动态"></a-tab-pane>
          <a-tab-pane key="video" tab="视频投稿"></a-tab-pane>
          <a-tab-pane key="article" tab="专栏"></a-tab-pane>
        </a-tabs>

        <a-list
          :dataSource="posts"
          :loading="loading"
          itemLayout="vertical"
          :pagination="pagination"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #avatar>
                  <router-link :to="`/user/${item.authorId}`">
                    <a-avatar :src="item.authorAvatar" />
                  </router-link>
                </template>
                <template #title>
                  <router-link :to="`/user/${item.authorId}`" class="author-name">
                    {{ item.authorName }}
                  </router-link>
                </template>
                <template #description>
                  {{ item.createdAt }}
                </template>
              </a-list-item-meta>
              <div class="post-content" @click="goToPostDetail(item.id)">
                <h3>{{ item.title }}</h3>
                <p>{{ item.content }}</p>
                <img v-if="item.image" :src="item.image" :alt="item.title" />
              </div>
              <template #actions>
                <a-button @click="likePost(item)" :class="{ 'action-active': item.liked }">
                  <template #icon>
                    <LikeFilled v-if="item.liked" />
                    <LikeOutlined v-else />
                  </template>
                  {{ item.likeCount }}
                </a-button>
                <a-button @click="collectPost(item)" :class="{ 'action-active': item.collected }">
                  <template #icon>
                    <StarFilled v-if="item.collected" />
                    <StarOutlined v-else />
                  </template>
                  {{ item.collectCount }}
                </a-button>
                <a-button @click="sharePost(item)">
                  <template #icon><ShareAltOutlined /></template>
                  分享
                </a-button>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </main>

      <aside class="trending-topics module">
        <h3>话题</h3>
        <a-list :dataSource="trendingTopics" size="small">
          <template #renderItem="{ item }">
            <a-list-item>
              <a href="#" class="topic-link">
                <span class="topic-title">{{ item.title }}</span>
                <span class="topic-stats"
                  >{{ item.viewCount }}浏览 · {{ item.commentCount }}讨论</span
                >
              </a>
            </a-list-item>
          </template>
        </a-list>
      </aside>
    </div>

    <a-modal v-model:visible="postModalVisible" title="发布新内容" @ok="submitNewPost">
      <a-form :model="newPost" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-item label="标题">
          <a-input v-model:value="newPost.title" />
        </a-form-item>
        <a-form-item label="内容">
          <a-textarea v-model:value="newPost.content" :rows="4" />
        </a-form-item>
        <a-form-item label="状态">
          <a-radio-group v-model:value="newPost.status">
            <a-radio value="publish">公开</a-radio>
            <a-radio value="hide">私密</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { request } from '@/utils/request'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const router = useRouter()
const searchQuery = ref('')
const activeTab = ref('all')
const newPostContent = ref('')
const posts = ref([])
const loading = ref(false)
const postModalVisible = ref(false)
const newPost = ref({
  title: '',
  content: '',
  status: 'publish',
  abstract: 'abstract',
})

const currentUser = ref({
  avatar: 'https://via.placeholder.com/64',
  name: '梦奴Y',
  followingCount: 0,
  followerCount: 0,
  postCount: 35,
})

const navItems = ['首页', '番剧', '直播', '游戏中心', '会员购', '漫画', '赛事']

const trendingTopics = ref([
  { title: '必剪音色克隆免费上线', viewCount: '285.0万', commentCount: '5890' },
  { title: '罗永浩宣布还清8.24亿巨债', viewCount: '24.8万', commentCount: '912' },
  { title: '发电厂8天抓21万斤海蜇', viewCount: '167.9万', commentCount: '2466' },
  { title: '教老爸贝用手机淘宝', viewCount: '820.8万', commentCount: '2.5万' },
  { title: 'Blast秋决G2夺冠', viewCount: '29.0万', commentCount: '374' },
])

const pagination = {
  onChange: (page) => {
    fetchPosts(page)
  },
  pageSize: 10,
}

onMounted(() => {
  fetchUserInfo()
  fetchPosts()
})

const fetchUserInfo = async () => {
  try {
    const response = await request('/relation/stat', 'GET')
    if (response.code === 0) {
      currentUser.value.followingCount = response.data.Followee
      currentUser.value.followerCount = response.data.Follower
    }
    // /post/writer
    const data = await request('/post/writer', 'GET')
    if (data.code === 0) {
      currentUser.value.postCount = data.data.count
    }
    currentUser.value.name = userStore.user.user_name
    if (userStore.user.nick_name !== '') {
      currentUser.value.name = userStore.user.nick_name
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}

const fetchPosts = async (page = 1) => {
  loading.value = true
  try {
    const response = await request('/post/reader', 'GET', { page, size: 10 })
    if (response.code === 0) {
      posts.value = response.data.post_list.map((item) => ({
        id: item.post.post_id,
        title: item.post.title,
        content: item.post.content,
        abstract: item.post.abstract,
        authorId: item.post.author_id,
        createdAt: new Date(item.post.created_at * 1000).toLocaleString(),
        status: item.post.status,
        liked: item.stat.liked,
        collected: item.stat.collected,
        likeCount: item.interaction.like_cnt,
        collectCount: item.interaction.collect_cnt,
        readCount: item.interaction.read_cnt,
        authorAvatar: 'https://via.placeholder.com/40', // 你可能需要从其他地方获取作者头像
        authorName: 'Author Name', // 你可能需要从其他地方获取作者名称
      }))
      // 更新分页信息
      pagination.total = response.data.count
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
  } finally {
    loading.value = false
  }
}

const likePost = async (post) => {
  try {
    const response = await request('/post/like', 'POST', {
      post_id: post.id,
      is_like: !post.liked,
    })
    if (response.code === 0) {
      post.liked = !post.liked
      post.likeCount += post.liked ? 1 : -1
      message.success(post.liked ? '点赞成功' : '取消点赞成功')
    }
  } catch (error) {
    console.error('Error liking post:', error)
  }
}

const collectPost = async (post) => {
  try {
    const response = await request('/post/collect', 'POST', {
      post_id: post.id,
      is_collect: !post.collected,
      collection_id: 0,
    })
    if (response.code === 0) {
      post.collected = !post.collected
      post.collectCount += post.collected ? 1 : -1
      message.success(post.collected ? '收藏成功' : '取消收藏成功')
    }
  } catch (error) {
    console.error('Error collecting post:', error)
  }
}

const sharePost = (post) => {
  // Implement share functionality
  console.log('Sharing post:', post)
  message.info('分享功能暂未实现')
}

const submitPost = async () => {
  if (!newPostContent.value.trim()) {
    message.warning('请输入内容')
    return
  }
  try {
    const response = await request('/post', 'POST', {
      title: '',
      content: newPostContent.value,
      status: 'publish',
    })
    if (response.code === 0) {
      message.success('发布成功')
      newPostContent.value = ''
      fetchPosts()
    }
  } catch (error) {
    console.error('Error submitting post:', error)
    message.error('发布失败')
  }
}

const showPostModal = () => {
  postModalVisible.value = true
}

const submitNewPost = async () => {
  try {
    const response = await request('/post', 'POST', newPost.value)
    if (response.code === 0) {
      message.success('发布成功')
      postModalVisible.value = false
      newPost.value = { title: '', content: '', status: 'publish', abstract: 'abstract' }
      fetchPosts()
    }
  } catch (error) {
    console.error('Error submitting new post:', error)
    message.error('发布失败')
  }
}

const onSearch = () => {
  console.log('Searching for:', searchQuery.value)
  message.info('搜索功能暂未实现')
}

const goToPostDetail = (postId) => {
  router.push(`/post/${postId}`)
}

const handleLogout = () => {
  // Implement logout logic
  message.success('退出登录成功')
  router.push('/login')
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f5f7;
}

.module {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-nav {
  display: flex;
  gap: 20px;
}

.nav-item {
  color: #333;
  text-decoration: none;
}

.nav-item:hover {
  color: #00a1d6;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.main-content {
  display: flex;
  gap: 20px;
}

.user-profile {
  width: 240px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  text-decoration: none;
  color: #333;
}

.user-stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
  text-decoration: none;
  color: #333;
}

.stat-item:hover {
  color: #00a1d6;
}

.feed {
  flex-grow: 1;
}

.post-creation {
  margin-bottom: 20px;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.action-icon {
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.action-icon:hover {
  color: #00a1d6;
}

.trending-topics {
  width: 240px;
}

.topic-link {
  text-decoration: none;
  color: #333;
}

.topic-title {
  font-weight: bold;
  margin-right: 8px;
}

.topic-stats {
  font-size: 12px;
  color: #999;
}

.author-name {
  color: #333;
  text-decoration: none;
}

.author-name:hover {
  color: #00a1d6;
}

.action-active {
  color: #00a1d6;
}

.menu-link {
  color: #333;
  text-decoration: none;
}

@media (max-width: 1200px) {
  .trending-topics {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .user-profile {
    width: 100%;
  }

  .feed {
    width: 100%;
  }
}
</style>
