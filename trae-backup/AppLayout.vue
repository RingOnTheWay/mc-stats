<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#e8f0e8] via-[#f5f9f5] to-[#e8f0e8]">
      <TopBar />
      <div class="flex-1 overflow-y-auto p-8 space-y-6">
        <slot />
      </div>
    </div>
  </div>
</template>
