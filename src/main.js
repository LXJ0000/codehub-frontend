import { createApp } from 'vue'

import App from './App.vue'

import Antd from 'ant-design-vue'
import Icons from './components/Icons'

import router from './router'
import store from './store'

import 'ant-design-vue/dist/reset.css'
import directive from '@/directive'
import '@/styles/global.css'

const app = createApp(App)

app.use(router)
app.use(store)

app.use(Icons)
app.use(Antd)

app.use(directive)

app.mount('#app')
