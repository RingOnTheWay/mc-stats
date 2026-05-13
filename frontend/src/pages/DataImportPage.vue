<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiPost, apiDelete, apiGet } from '@/services/api'

const { t } = useI18n()

const activeTab = ref<'import' | 'export' | 'manage'>('import')

const scanFolder = ref('')
const scanDate = ref(new Date().toISOString().slice(0, 10))
const scanLoading = ref(false)
const scanResult = ref<any>(null)
const scanError = ref('')

const batchFolder = ref('')
const batchLoading = ref(false)
const batchResult = ref<any>(null)
const batchError = ref('')

const exportLoading = ref(false)
const exportResult = ref<any>(null)
const exportError = ref('')

const dates = ref<string[]>([])
const datesLoading = ref(false)
const selectedDates = ref<Set<string>>(new Set())
const deleteLoading = ref(false)
const deleteResult = ref<any>(null)
const deleteError = ref('')

const deleteDate = ref('')
const deleteSingleLoading = ref(false)
const deleteSingleResult = ref<any>(null)
const deleteSingleError = ref('')

onMounted(() => { loadDates() })

async function loadDates() {
  datesLoading.value = true
  try {
    dates.value = await apiGet<string[]>('/api/dates')
  } catch {
    dates.value = []
  } finally {
    datesLoading.value = false
  }
}

async function handleScan() {
  if (!scanFolder.value.trim()) return
  scanLoading.value = true
  scanResult.value = null
  scanError.value = ''
  try {
    const body: Record<string, string> = { folder: scanFolder.value.trim() }
    if (scanDate.value) body.date = scanDate.value
    scanResult.value = await apiPost('/api/scan', body)
  } catch (e: any) {
    scanError.value = e.message || t('dataManage.operationFailed')
  } finally {
    scanLoading.value = false
  }
}

async function handleBatchScan() {
  if (!batchFolder.value.trim()) return
  batchLoading.value = true
  batchResult.value = null
  batchError.value = ''
  try {
    batchResult.value = await apiPost('/api/batch_scan', { parent_folder: batchFolder.value.trim() })
  } catch (e: any) {
    batchError.value = e.message || t('dataManage.operationFailed')
  } finally {
    batchLoading.value = false
  }
}

async function handleExport() {
  exportLoading.value = true
  exportResult.value = null
  exportError.value = ''
  try {
    exportResult.value = await apiPost('/api/export', {})
  } catch (e: any) {
    exportError.value = e.message || t('dataManage.operationFailed')
  } finally {
    exportLoading.value = false
  }
}

async function handleDeleteSingle() {
  if (!deleteDate.value) return
  deleteSingleLoading.value = true
  deleteSingleResult.value = null
  deleteSingleError.value = ''
  try {
    deleteSingleResult.value = await apiDelete('/api/delete_date', { date: deleteDate.value })
    await loadDates()
  } catch (e: any) {
    deleteSingleError.value = e.message || t('dataManage.operationFailed')
  } finally {
    deleteSingleLoading.value = false
  }
}

async function handleBatchDelete() {
  if (selectedDates.value.size === 0) return
  deleteLoading.value = true
  deleteResult.value = null
  deleteError.value = ''
  try {
    deleteResult.value = await apiDelete('/api/batch_delete', { dates: Array.from(selectedDates.value) })
    selectedDates.value.clear()
    await loadDates()
  } catch (e: any) {
    deleteError.value = e.message || t('dataManage.operationFailed')
  } finally {
    deleteLoading.value = false
  }
}

function toggleDate(d: string) {
  if (selectedDates.value.has(d)) {
    selectedDates.value.delete(d)
  } else {
    selectedDates.value.add(d)
  }
}

function selectAllDates() {
  dates.value.forEach(d => selectedDates.value.add(d))
}

function deselectAllDates() {
  selectedDates.value.clear()
}

const allDatesSelected = computed(() => dates.value.length > 0 && selectedDates.value.size === dates.value.length)
</script>

<template>
  <div>
    <div class="stat-tabs">
      <button :class="{ active: activeTab === 'import' }" @click="activeTab = 'import'">{{ t('dataManage.importTab') }}</button>
      <button :class="{ active: activeTab === 'export' }" @click="activeTab = 'export'">{{ t('dataManage.exportTab') }}</button>
      <button :class="{ active: activeTab === 'manage' }" @click="activeTab = 'manage'">{{ t('dataManage.manageTab') }}</button>
    </div>

    <!-- Import Tab -->
    <div v-if="activeTab === 'import'">
      <div class="surface-card" style="padding:20px;border-radius:16px;margin-bottom:16px">
        <h3 style="margin-bottom:16px;font-weight:500">{{ t('dataManage.singleScan') }}</h3>
        <div class="form-group">
          <label class="form-label">{{ t('dataManage.serverFolder') }}</label>
          <input v-model="scanFolder" type="text" class="form-input" :placeholder="t('dataManage.folderPlaceholder')" />
        </div>
        <div class="form-group">
          <label class="form-label">{{ t('dataManage.scanDate') }}</label>
          <input v-model="scanDate" type="date" class="form-input" />
        </div>
        <button class="action-btn primary" :disabled="scanLoading || !scanFolder.trim()" @click="handleScan">
          <span v-if="scanLoading" class="material-symbols-outlined spin">progress_activity</span>
          <span v-else class="material-symbols-outlined">upload</span>
          {{ scanLoading ? t('common.loading') : t('dataManage.startScan') }}
        </button>
        <div v-if="scanError" class="result-card error">{{ scanError }}</div>
        <div v-if="scanResult" class="result-card success">
          <div class="result-header">{{ t('dataManage.scanSuccess') }}</div>
          <div class="result-detail">
            <span>{{ t('dataManage.date') }}: {{ scanResult.date }}</span>
            <span>{{ t('dataManage.playerCount') }}: {{ scanResult.player_count }}</span>
            <span>{{ t('dataManage.battleCount') }}: {{ scanResult.battle_stats_count }}</span>
            <span>{{ t('dataManage.craftCount') }}: {{ scanResult.craft_stats_count }}</span>
            <span>{{ t('dataManage.itemCount') }}: {{ scanResult.item_stats_count }}</span>
          </div>
        </div>
      </div>

      <div class="surface-card" style="padding:20px;border-radius:16px">
        <h3 style="margin-bottom:16px;font-weight:500">{{ t('dataManage.batchScan') }}</h3>
        <div class="form-group">
          <label class="form-label">{{ t('dataManage.parentFolder') }}</label>
          <input v-model="batchFolder" type="text" class="form-input" :placeholder="t('dataManage.parentFolderPlaceholder')" />
        </div>
        <p class="form-hint">{{ t('dataManage.batchHint') }}</p>
        <button class="action-btn primary" :disabled="batchLoading || !batchFolder.trim()" @click="handleBatchScan">
          <span v-if="batchLoading" class="material-symbols-outlined spin">progress_activity</span>
          <span v-else class="material-symbols-outlined">drive_folder_upload</span>
          {{ batchLoading ? t('common.loading') : t('dataManage.startBatchScan') }}
        </button>
        <div v-if="batchError" class="result-card error">{{ batchError }}</div>
        <div v-if="batchResult" class="result-card success">
          <div class="result-header">{{ t('dataManage.batchScanSuccess') }}</div>
          <pre class="result-json">{{ JSON.stringify(batchResult, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- Export Tab -->
    <div v-if="activeTab === 'export'">
      <div class="surface-card" style="padding:20px;border-radius:16px">
        <h3 style="margin-bottom:16px;font-weight:500">{{ t('dataManage.exportTitle') }}</h3>
        <p class="form-hint">{{ t('dataManage.exportHint') }}</p>
        <button class="action-btn primary" :disabled="exportLoading" @click="handleExport">
          <span v-if="exportLoading" class="material-symbols-outlined spin">progress_activity</span>
          <span v-else class="material-symbols-outlined">download</span>
          {{ exportLoading ? t('common.loading') : t('dataManage.startExport') }}
        </button>
        <div v-if="exportError" class="result-card error">{{ exportError }}</div>
        <div v-if="exportResult" class="result-card success">
          <div class="result-header">{{ exportResult.message || t('dataManage.exportSuccess') }}</div>
        </div>
      </div>
    </div>

    <!-- Manage Tab -->
    <div v-if="activeTab === 'manage'">
      <div class="surface-card" style="padding:20px;border-radius:16px;margin-bottom:16px">
        <h3 style="margin-bottom:16px;font-weight:500">{{ t('dataManage.deleteByDate') }}</h3>
        <div class="form-group">
          <label class="form-label">{{ t('dataManage.selectDate') }}</label>
          <input v-model="deleteDate" type="date" class="form-input" />
        </div>
        <button class="action-btn danger" :disabled="deleteSingleLoading || !deleteDate" @click="handleDeleteSingle">
          <span v-if="deleteSingleLoading" class="material-symbols-outlined spin">progress_activity</span>
          <span v-else class="material-symbols-outlined">delete</span>
          {{ deleteSingleLoading ? t('common.loading') : t('dataManage.confirmDelete') }}
        </button>
        <div v-if="deleteSingleError" class="result-card error">{{ deleteSingleError }}</div>
        <div v-if="deleteSingleResult" class="result-card success">
          <div class="result-header">{{ t('dataManage.deleteSuccess', { date: deleteSingleResult.date }) }}</div>
          <div class="result-detail">
            <span>{{ t('dataManage.mapDeleted') }}: {{ deleteSingleResult.map_records_deleted }}</span>
            <span>{{ t('dataManage.playerDeleted') }}: {{ deleteSingleResult.player_records_deleted }}</span>
            <span>{{ t('dataManage.detailDeleted') }}: {{ deleteSingleResult.detail_records_deleted }}</span>
          </div>
        </div>
      </div>

      <div class="surface-card" style="padding:20px;border-radius:16px">
        <h3 style="margin-bottom:16px;font-weight:500">{{ t('dataManage.batchDelete') }}</h3>
        <div class="date-toolbar">
          <button class="action-btn small" @click="selectAllDates" :disabled="dates.length === 0">{{ t('common.selectAll') }}</button>
          <button class="action-btn small" @click="deselectAllDates" :disabled="selectedDates.size === 0">{{ t('common.deselectAll') }}</button>
          <span class="date-count">{{ t('dataManage.selectedCount', { n: selectedDates.size }) }}</span>
          <button class="action-btn small" @click="loadDates" :disabled="datesLoading">
            <span class="material-symbols-outlined" style="font-size:16px">refresh</span>
          </button>
        </div>
        <div v-if="datesLoading" style="padding:20px;text-align:center;color:var(--md-sys-color-on-surface-variant)">{{ t('common.loading') }}</div>
        <div v-else-if="dates.length === 0" style="padding:20px;text-align:center;color:var(--md-sys-color-on-surface-variant)">{{ t('common.noData') }}</div>
        <div v-else class="date-list">
          <label v-for="d in dates" :key="d" class="date-item" :class="{ selected: selectedDates.has(d) }">
            <input type="checkbox" :checked="selectedDates.has(d)" @change="toggleDate(d)" />
            <span>{{ d }}</span>
          </label>
        </div>
        <button class="action-btn danger" style="margin-top:16px" :disabled="deleteLoading || selectedDates.size === 0" @click="handleBatchDelete">
          <span v-if="deleteLoading" class="material-symbols-outlined spin">progress_activity</span>
          <span v-else class="material-symbols-outlined">delete_sweep</span>
          {{ deleteLoading ? t('common.loading') : t('dataManage.confirmBatchDelete', { n: selectedDates.size }) }}
        </button>
        <div v-if="deleteError" class="result-card error">{{ deleteError }}</div>
        <div v-if="deleteResult" class="result-card success">
          <div class="result-header">{{ t('dataManage.batchDeleteSuccess') }}</div>
          <div class="result-detail">
            <span>{{ t('dataManage.totalDates') }}: {{ deleteResult.total_dates }}</span>
            <span>{{ t('dataManage.mapDeleted') }}: {{ deleteResult.total_map_deleted }}</span>
            <span>{{ t('dataManage.playerDeleted') }}: {{ deleteResult.total_player_deleted }}</span>
            <span>{{ t('dataManage.detailDeleted') }}: {{ deleteResult.total_detail_deleted }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
.stat-tabs button { padding: 8px 20px; border-radius: 20px; border: 1px solid var(--md-sys-color-outline); background: none; color: var(--md-sys-color-on-surface); font-size: 13px; cursor: pointer; }
.stat-tabs button.active { background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); border-color: var(--md-sys-color-primary); }

.surface-card { background: var(--md-sys-color-surface-container-low); }

.form-group { margin-bottom: 16px; }
.form-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 500; color: var(--md-sys-color-on-surface-variant); }
.form-input { width: 100%; padding: 10px 14px; border-radius: 12px; border: 1px solid var(--md-sys-color-outline); background: var(--md-sys-color-surface-container); color: var(--md-sys-color-on-surface); font-size: 14px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
.form-input:focus { border-color: var(--md-sys-color-primary); }
.form-hint { font-size: 12px; color: var(--md-sys-color-on-surface-variant); margin-bottom: 16px; margin-top: -8px; }

.action-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 24px; border-radius: 20px; border: none; font-size: 14px; font-weight: 500; cursor: pointer; transition: opacity 0.2s; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.action-btn .material-symbols-outlined { font-size: 18px; }
.action-btn.primary { background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); }
.action-btn.danger { background: var(--md-sys-color-error); color: var(--md-sys-color-on-error); }
.action-btn.small { padding: 6px 14px; font-size: 12px; border-radius: 16px; background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); border: none; cursor: pointer; }

.result-card { margin-top: 16px; padding: 14px 18px; border-radius: 12px; font-size: 13px; }
.result-card.success { background: rgba(52, 199, 89, 0.12); color: #2d8a4e; }
.result-card.error { background: rgba(255, 59, 48, 0.12); color: #c0392b; }
.result-header { font-weight: 600; margin-bottom: 8px; }
.result-detail { display: flex; flex-wrap: wrap; gap: 12px; }
.result-detail span { font-size: 12px; }
.result-json { margin: 8px 0 0; font-size: 12px; white-space: pre-wrap; word-break: break-all; max-height: 300px; overflow-y: auto; }

.date-toolbar { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.date-count { font-size: 12px; color: var(--md-sys-color-on-surface-variant); margin-left: auto; }

.date-list { display: flex; flex-wrap: wrap; gap: 8px; max-height: 280px; overflow-y: auto; padding: 4px 0; }
.date-item { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 12px; border: 1px solid var(--md-sys-color-outline); font-size: 13px; cursor: pointer; transition: all 0.15s; background: var(--md-sys-color-surface-container); color: var(--md-sys-color-on-surface); }
.date-item.selected { background: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container); border-color: var(--md-sys-color-primary); }
.date-item input { accent-color: var(--md-sys-color-primary); }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
