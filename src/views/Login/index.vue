<template>
  <div class="auth-container">
    <a-card title="登录" class="auth-card">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="account" tab="邮箱">
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
              :rules="[
                { required: true, message: '请输入邮箱!' },
                { type: 'email', message: '请输入有效的邮箱地址!' },
              ]"
            >
              <a-input v-model:value="formState.email" placeholder="邮箱" />
            </a-form-item>

            <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
              <a-input-password v-model:value="formState.password" placeholder="密码" />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="loading" block>登录</a-button>
            </a-form-item>

            <a-form-item>
              <div class="login-options">
                <a class="forgot-password" @click="handleForgotPassword">忘记密码</a>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <a-tab-pane key="phone" tab="手机号">
          <a-form
            :model="phoneFormState"
            name="phoneLogin"
            @finish="onPhoneFinish"
            @finishFailed="onFinishFailed"
            autocomplete="off"
          >
            <a-form-item name="phone" :rules="[{ required: true, message: '请输入手机号!' }]">
              <a-input v-model:value="phoneFormState.phone" placeholder="手机号" />
            </a-form-item>

            <a-form-item
              v-if="loginMethod === 'password'"
              name="password"
              :rules="[{ required: true, message: '请输入密码!' }]"
            >
              <a-input-password v-model:value="phoneFormState.password" placeholder="密码" />
            </a-form-item>

            <a-form-item v-else name="code">
              <a-row :gutter="8">
                <a-col :span="16">
                  <a-input v-model:value="phoneFormState.code" placeholder="验证码" />
                </a-col>
                <a-col :span="8">
                  <a-button @click="sendVerificationCode" :disabled="cooldown > 0" block>
                    {{ cooldown > 0 ? `${cooldown}s` : '发送验证码' }}
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="loading" block>登录</a-button>
            </a-form-item>

            <a-form-item>
              <div class="login-options">
                <a class="forgot-password" @click="handleForgotPassword">忘记密码</a>
                <a class="toggle-login-method" @click="toggleLoginMethod">
                  {{ loginMethod === 'password' ? '验证码登录' : '密码登录' }}
                </a>
              </div>
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
import { sendCode } from '@/services/login'
import { WechatOutlined, QqOutlined } from '@ant-design/icons-vue'

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const activeKey = ref('account')
const cooldown = ref(0)
const loginMethod = ref('password') // 'code' for verification code, 'password' for password login

const formState = reactive({
  email: '',
  password: '',
})

const phoneFormState = reactive({
  phone: '',
  code: '',
  password: '',
})

const onFinish = async () => {
  loading.value = true
  try {
    await userStore.login(formState)
    message.success('登录成功!')
    router.push('/dashboard')
  } catch (error) {
    message.error('用户名或密码有误')
  } finally {
    loading.value = false
  }
}

const onPhoneFinish = async () => {
  loading.value = true
  try {
    if (loginMethod.value === 'code') {
      await userStore.phoneLogin(phoneFormState)
    } else {
      await userStore.phonePasswordLogin({
        phone: phoneFormState.phone,
        password: phoneFormState.password,
      })
    }
    message.success('登录成功!')
    router.push('/dashboard')
  } catch (error) {
    message.error(error.message || '登录失败，请重试!')
  } finally {
    loading.value = false
  }
}

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
  message.error('请检查表单信息并重试!')
}

const sendVerificationCode = async () => {
  if (!phoneFormState.phone) {
    message.error('请先输入手机号!')
    return
  }
  cooldown.value = 60
  try {
    const data = await sendCode({ phone: phoneFormState.phone })
    let timer = setInterval(() => {
      cooldown.value--
      if (cooldown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    if (data.code === 0) {
      message.success('验证码发送成功!')
    }
  } catch (error) {
    message.error(error.message || '发送验证码失败，请重试!')
    cooldown.value = 0
  }
}

const toggleLoginMethod = () => {
  loginMethod.value = loginMethod.value === 'code' ? 'password' : 'code'
}

const handleForgotPassword = () => {
  message.info('忘记密码功能暂未实现')
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

  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

    .forgot-password {
      color: rgba(0, 0, 0, 0.45);
    }

    .toggle-login-method {
      color: #1890ff;
    }
  }
}
</style>
