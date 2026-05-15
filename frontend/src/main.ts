import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import { zhCN, enUS } from './i18n'

import './assets/main.css'

function getInitialLocale(): string {
  try {
    const stored = localStorage.getItem('locale')
    if (stored === 'zh-CN' || stored === 'en-US') return stored
  } catch {}
  return 'zh-CN'
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

export { i18n }

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(MotionPlugin)
app.mount('#app')
