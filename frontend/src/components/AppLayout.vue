<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue'
import { useDataStore } from '@/stores/data'
import { onMounted } from 'vue'

const data = useDataStore()

onMounted(() => {
  data.loadAll()
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#e8f0e8] via-[#f5f9f5] to-[#e8f0e8] dark:from-[#0a140a] dark:via-[#0f1a0f] dark:to-[#0a140a]">
      <TopBar />
      <div class="flex-1 overflow-y-auto p-8 space-y-6">
        <slot />
      </div>
    </div>

    <Transition name="loading-fade">
      <div v-if="data.loading" class="global-loading-overlay">
        <div class="global-loading-card">
          <div class="text-sm text-slate-500 dark:text-slate-400 mb-4">少女祈祷中...</div>
          <div class="w-48 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-brand to-brand-light rounded-full loading-progress" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.loading-fade-enter-active {
  transition: opacity 0.3s ease;
}
.loading-fade-leave-active {
  transition: opacity 0.5s ease;
}
.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

.loading-progress {
  animation: loading-slide 1.5s ease-in-out infinite;
}

@keyframes loading-slide {
  0% {
    width: 0%;
    margin-left: 0%;
  }
  50% {
    width: 60%;
    margin-left: 20%;
  }
  100% {
    width: 0%;
    margin-left: 100%;
  }
}
</style>
