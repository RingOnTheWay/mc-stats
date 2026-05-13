<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useDataStore } from '@/stores/data'
import { useI18n } from 'vue-i18n'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const { t } = useI18n()
const data = useDataStore()

onMounted(() => { data.loadAll() })

const mapKeys = ['world', 'world_nether', 'world_the_end'] as const
const mapLabels = computed<Record<string, string>>(() => ({
  world: t('map.world'), world_nether: t('map.nether'), world_the_end: t('map.end'),
}))
const mapColors = ['#00D9FF', '#FF8A65', '#B388FF']

const chartData = computed(() => {
  const dates = data.allDates
  return {
    labels: dates,
    datasets: mapKeys.map((key, i) => ({
      label: mapLabels.value[key],
      data: dates.map(d => data.mapSizes[d]?.[key] || 0),
      borderColor: mapColors[i],
      backgroundColor: mapColors[i] + '20',
      tension: 0.4, fill: true, pointRadius: 3, pointHoverRadius: 5,
    })),
  }
})

const chartOptions = computed(() => ({
  responsive: true, maintainAspectRatio: true,
  plugins: { legend: { position: 'bottom' as const, labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 12 } } } },
  scales: { y: { beginAtZero: true, title: { display: true, text: t('map.unit') } } },
}))
</script>

<template>
  <div>
    <div class="surface-card" style="padding:20px;border-radius:16px">
      <h3 style="margin-bottom:12px;font-weight:500">{{ t('map.title') }}</h3>
      <Line :data="chartData" :options="chartOptions" style="max-height:400px" />
    </div>
  </div>
</template>

<style scoped>
.surface-card { background: var(--md-sys-color-surface-container-low); }
</style>
