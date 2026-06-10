<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'
import type { UpdateTournamentDto } from '~/types/operations'
import EditableCellInput from '../ui/EditableCellInput.vue'

export type TournamentTableRow = {
  participantId: string
  badge: number | string | null
  nickname: string | null
  reEntry: number
  addon: number
  knockouts: number
  bustoutOrder: number
  status: string
  updatedAt: string | null
}

defineProps<{
  players: TournamentTableRow[]
}>()

const emit = defineEmits<{
  change: [participantId: string, payload: UpdateTournamentDto]
}>()

const columns: DataTableColumn[] = [
  { key: 'badge', label: 'Бейдж', width: '90px' },
  { key: 'nickname', label: 'Имя пользователя', width: '180px' },
  { key: 'reEntry', label: 'Re-entry', align: 'right', width: '120px' },
  { key: 'addon', label: 'Addon', align: 'right', width: '120px' },
  { key: 'knockouts', label: 'Knockouts', align: 'right', width: '120px' },
  { key: 'bustoutOrder', label: 'Bustout order', align: 'right', width: '140px' },
  { key: 'status', label: 'Статус', width: '150px' },
  { key: 'updatedAt', label: 'Обновлен', width: '160px' },
]

const statusOptions = ['ACTIVE', 'BUSTED', 'FINISHED']
</script>

<template>
  <UiDataTable
    :columns="columns"
    :rows="players"
    row-key="participantId"
    min-width="1090px"
    empty-text="Игроки турнира не найдены"
  >
    <template #cell-badge="{ row }">
      <span class="font-semibold text-slate-950">{{
        (row as TournamentTableRow).badge ?? '—'
      }}</span>
    </template>

    <template #cell-nickname="{ row }">
      <span class="text-slate-700">{{ (row as TournamentTableRow).nickname ?? '—' }}</span>
    </template>

    <template #cell-reEntry="{ row }">
      <EditableCellInput
        :model-value="(row as TournamentTableRow).reEntry"
        type="number"
        inputmode="numeric"
        class="w-24 text-right"
        @update:model-value="
          emit('change', (row as TournamentTableRow).participantId, {
            reEntry: Number($event),
          })
        "
      />
    </template>

    <template #cell-addon="{ row }">
      <EditableCellInput
        :model-value="(row as TournamentTableRow).addon"
        type="number"
        inputmode="numeric"
        class="w-24 text-right"
        @update:model-value="
          emit('change', (row as TournamentTableRow).participantId, {
            addon: Number($event),
          })
        "
      />
    </template>

    <template #cell-knockouts="{ row }">
      <EditableCellInput
        :model-value="(row as TournamentTableRow).knockouts"
        type="number"
        inputmode="numeric"
        class="w-24 text-right"
        @update:model-value="
          emit('change', (row as TournamentTableRow).participantId, { knockouts: Number($event) })
        "
      />
    </template>

    <template #cell-bustoutOrder="{ row }">
      <EditableCellInput
        :model-value="(row as TournamentTableRow).bustoutOrder"
        type="number"
        inputmode="numeric"
        class="w-24 text-right"
        @update:model-value="
          emit('change', (row as TournamentTableRow).participantId, {
            bustoutOrder: Number($event),
          })
        "
      />
    </template>

    <template #cell-status="{ row }">
      <select
        :value="(row as TournamentTableRow).status"
        class="h-8 w-32 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        @change="
          emit('change', (row as TournamentTableRow).participantId, {
            status: ($event.target as HTMLSelectElement).value,
          })
        "
      >
        <option v-for="status in statusOptions" :key="status" :value="status">
          {{ status }}
        </option>
      </select>
    </template>

    <template #cell-updatedAt="{ row }">
      <span class="whitespace-nowrap text-slate-500">
        {{ formatDate((row as TournamentTableRow).updatedAt) || '—' }}
      </span>
    </template>
  </UiDataTable>
</template>
