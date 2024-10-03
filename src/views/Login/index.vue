<template>
  <div class="auth-container">
    <a-card title="登录" class="auth-card">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="account" tab="账号密码登录">
          <a-form
            :model="formState"
            name="login"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
            autocomplete="off"
            layout="vertical"
          >
            <a-form-item
              name="email"
              label="邮箱"
              :rules="[
                { required: true, message: '请输入邮箱!' },
                { type: 'email', message: '请输入有效的邮箱地址!' },
              ]"
            >
              <a-input v-model:value="formState.email" />
            </a-form-item>

            <a-form-item
              name="password"
              label="密码"
              :rules="[{ required: true, message: '请输入密码!' }]"
            >
              <a-input-password v-model:value="formState.password" />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="loading" block>登录</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <a-tab-pane key="phone" tab="手机号登录">
          <a-form
            :model="phoneFormState"
            name="phoneLogin"
            @finish="onPhoneFinish"
            @finishFailed="onFinishFailed"
            autocomplete="off"
            layout="vertical"
          >
            <a-form-item
              name="phone"
              label="手机号"
              :rules="[{ required: true, message: '请输入手机号!' }]"
            >
              <a-input v-model:value="phoneFormState.phone" />
            </a-form-item>

            <a-form-item
              name="verificationCode"
              label="验证码"
              :rules="[{ required: true, message: '请输入验证码!' }]"
            >
              <a-row :gutter="8">
                <a-col :span="16">
                  <a-input v-model:value="phoneFormState.verificationCode" />
                </a-col>
                <a-col :span="8">
                  <a-button @click="sendVerificationCode" :disabled="cooldown > 0">
                    {{ cooldown > 0 ? `${cooldown}s` : '获取验证码' }}
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="loading" block>登录</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>

      <div class="social-login">
        <p>其他登录方式</p>
        <a-space>
          <a-button shape="circle" @click="handleWechatLogin">
            <template #icon><WechatOutlined /></template>
          </a-button>
          <a-button shape="circle" @click="handleQQLogin">
            <template #icon><QqOutlined /></template>
          </a-button>
        </a-space>
      </div>

      <div class="register-link">
        <router-link to="/register">还没有账号？立即注册</router-link>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const activeKey = ref('account')
const cooldown = ref(0)

const formState = reactive({
  email: '',
  password: '',
})

const phoneFormState = reactive({
  phone: '',
  verificationCode: '',
})

const onFinish = async () => {
  loading.value = true
  try {
    await userStore.login(formState)
    console.log(userStore.user, '\n', userStore.accessToken, '\n', userStore.refreshToken)
    message.success('登录成功!')
    router.push('/dashboard')
  } catch (error) {
    message.error(error.message || '登录失败，请重试!')
  } finally {
    loading.value = false
  }
}

const onPhoneFinish = async () => {
  message.info('手机号登录功能暂未实现')
}

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
  message.error('请检查表单信息并重试!')
}

const sendVerificationCode = async () => {
  message.info('发送验证码功能暂未实现')
}

const handleWechatLogin = () => {
  message.info('微信登录功能暂未实现')
}

const handleQQLogin = () => {
  message.info('QQ登录功能暂未实现')
}
</script>

<style lang="scss" scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;

  .auth-card {
    width: 100%;
    max-width: 400px;
  }

  .social-login {
    margin-top: 24px;
    text-align: center;

    p {
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.45);
    }
  }

  .register-link {
    margin-top: 16px;
    text-align: center;
  }
}
</style>
