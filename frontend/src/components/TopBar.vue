<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Settings } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const isSettingsPage = computed(() => route.path === '/settings')

const breadcrumbMap: Record<string, string> = {
  '/': 'nav.dashboard',
  '/map': 'nav.mapStats',
  '/players': 'nav.playerStats',
  '/battle': 'nav.battleStats',
  '/craft': 'nav.craftStats',
  '/items': 'nav.itemStats',
  '/activity': 'nav.activity',
  '/data-manage': 'nav.dataManage',
  '/settings': 'nav.settings',
}

const subtitleMap: Record<string, string> = {
  '/': 'dashboard.subtitle',
  '/map': 'map.subtitle',
  '/players': 'playerStats.subtitle',
  '/battle': 'battle.subtitle',
  '/craft': 'craft.subtitle',
  '/items': 'item.subtitle',
  '/activity': 'activity.subtitle',
  '/data-manage': 'dataManage.subtitle',
  '/settings': 'settings.subtitle',
}

const currentLabel = computed(() => t(breadcrumbMap[route.path] || 'nav.dashboard'))
const currentSubtitle = computed(() => {
  const key = subtitleMap[route.path]
  return key ? t(key) : ''
})

function goToSettings() {
  router.push('/settings')
}
</script>

<template>
  <div class="bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl border-b border-brand/10 dark:border-brand/20 shadow-sm">
    <div class="px-8 py-5 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-slate-800 dark:text-slate-100">{{ currentLabel }}</h1>
        <p v-if="currentSubtitle" class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{{ currentSubtitle }}</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          class="p-2 rounded-lg transition-all duration-300 group"
          :class="isSettingsPage
            ? 'bg-brand/15 text-brand dark:text-brand-light'
            : 'hover:bg-white/80 dark:hover:bg-slate-800/80'"
          @click="goToSettings"
        >
          <Settings
            class="w-5 h-5 transition-all duration-300"
            :class="isSettingsPage
              ? 'text-brand dark:text-brand-light'
              : 'text-slate-600 dark:text-slate-400 group-hover:text-brand group-hover:rotate-90'"
          />
        </button>
      </div>
    </div>
  </div>
</template>
