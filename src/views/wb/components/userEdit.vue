<template>
  <div class="user-profile">
    <div class="cover-photo"></div>
    <div class="profile-info">
      <a-upload
        :show-upload-list="false"
        :before-upload="beforeUpload"
        @change="handleChange"
        :customRequest="customRequest"
      >
        <img :src="userStore.user.avatar" alt="User Avatar" class="profile-avatar" />
      </a-upload>
      <p>{{ userStore.user.bio }}</p>
      <div class="user-stats">
        <a-form
          :model="form"
          name="basic"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 24 }"
          autocomplete="off"
          @finish="editUserInfo"
          @finishFailed="onFinishFailed"
        >
          <a-form-item label="昵称" name="nick_name">
            <a-input v-model:value="form.nick_name" style="width: 400px" />
          </a-form-item>

          <a-form-item label="个人简介" name="about_me">
            <a-input v-model:value="form.about_me" style="width: 400px" />
          </a-form-item>
          <a-form-item label="生日" name="birthday">
            <a-date-picker v-model:value="form.birthday" format="YYYY-MM-DD" style="width: 400px" />
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
            <a-button type="primary" html-type="submit">保存</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { message } from 'ant-design-vue'
import * as api from '@/services/api'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const userStore = useUserStore()

const form = ref({})
// 上传文件校验
const beforeUpload = (file) => {
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
    console.log('log.response:', response)
    if (response.code === 0) {
      userStore.user.avatar = response.data.path
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
  try {
    const response = await api.fetchUserInfo()
    console.log('log.response:', response)
    if (response.code === 0) {
      form.value.nick_name = response.data.profile.nick_name
        ? response.data.profile.nick_name
        : response.data.profile.user_name
      form.value.birthday = dayjs(response.data.profile.birthday)
      form.value.about_me = response.data.profile.about_me
    }
    console.log('log.currentUser:', form.value)
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}
const editUserInfo = async () => {
  // 获取路由的用户 ID /wb/u/:userId
  console.log(form.value)
  try {
    form.value.birthday = dayjs(form.value.birthday).format('YYYY-MM-DD')
    const response = await api.editUserInfo(form.value)
    console.log('log.response:', response)
    if (response.code === 0) {
      message.success('修改成功')
      fetchUserInfo()
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.user-profile {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.cover-photo {
  height: 200px;
  background-color: #a5d5ff;
  border-radius: 8px 8px 0 0;
}

.profile-info {
  background-color: #fff;
  padding: 20px;
  text-align: center;
  border-radius: 0 0 8px 8px;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: -50px;
  border: 4px solid #fff;
}

.user-stats {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px;
  margin-top: 10px;
}

.profile-nav {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* .profile-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
} */
</style>
