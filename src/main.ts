import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import './assets/styles/main.css'
import App from './App.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': {
      game: {
        title: '现代黑暗生存文字冒险',
        day: '第 {n} 天',
        restDay: '休息日',
        gameDay: '游戏日',
      }
    }
  }
})

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.mount('#app')
