<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue'
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
  </div>
</template>
