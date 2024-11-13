<template>
  <aside class="right-sidebar">
    <div class="login-card">
      <img
        src="https://tvax1.sinaimg.cn/crop.0.0.1079.1079.180/006UebRdly8hket8gaah4j30tz0tzmz2.jpg?KID=imgbed,tva&Expires=1731430147&ssig=4qtJVzbHnZ"
        alt="登录横幅"
        class="login-banner"
      />
      <a-button type="primary" block class="login-btn"> 立即登录 </a-button>
      <div class="register-prompt">
        还没有微博？
        <a href="#" class="register-link">立即注册！</a>
      </div>
    </div>

    <div class="hot-topics">
      <div class="topics-header">
        <h3>微博热搜</h3>
        <a-button type="link" class="refresh-btn">
          <RefreshCw class="refresh-icon" />
          点击刷新
        </a-button>
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
import { ref } from 'vue'
import { RefreshCw } from 'lucide-vue-next'

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
</script>

<style scoped>
.right-sidebar {
  width: 300px;
  /* margin-left: 20px; */
}

.login-card {
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
  padding: 20px;
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
</style>
