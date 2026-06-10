import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ConfigProvider, Avatar, InputNumber, Switch } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { lazyLoad } from './directives/lazyLoad'

const app = createApp(App)
app.use(createPinia())
app.use(ConfigProvider)
app.use(Avatar)
app.use(InputNumber)
app.use(Switch)
app.use(router)
app.directive('lazy', lazyLoad)
app.mount('#app')
