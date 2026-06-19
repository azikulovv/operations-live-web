<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'
import type { EventTableRow, UpdateEventTableDto } from '~/types/operations'
import EditableCellInput from '../ui/EditableCellInput.vue'

defineProps<{
  tables: EventTableRow[]
}>()

const emit = defineEmits<{
  change: [tableNumber: number, payload: UpdateEventTableDto]
}>()

const columns: DataTableColumn[] = [
  { key: 'tableNumber', label: 'Стол', width: '100px' },
  { key: 'status', label: 'Статус', width: '160px' },
  { key: 'playersCount', label: 'Кол-во игроков', align: 'right', width: '150px' },
  { key: 'comment', label: 'Комментарий', width: '260px' },
  { key: 'updatedAt', label: 'Обновлен', width: '160px' },
]

const statusOptions = ['OPEN', 'OCCUPIED', 'RESERVED', 'CLOSED']

function getPlayersCount(table: EventTableRow) {
  if (typeof table.playersCount === 'number') return table.playersCount

  return table.seats?.length ?? 0
}

function getStatusOptions(status: string | null | undefined) {
  if (!status || statusOptions.includes(status)) return statusOptions

  return [status, ...statusOptions]
}
</script>

<template>
  <UiDataTable
    :columns="columns"
    :rows="tables"
    row-key="tableNumber"
    min-width="1000px"
    empty-text="Столы не найдены"
  >
    <template #cell-tableNumber="{ row }">
      <span class="whitespace-nowrap text-slate-900">{{ (row as EventTableRow).tableNumber }}</span>
    </template>

    <template #cell-status="{ row }">
      <select
        :value="String((row as EventTableRow).status ?? '')"
        class="h-8 w-36 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        @change="
          emit('change', (row as EventTableRow).tableNumber, {
            status: ($event.target as HTMLSelectElement).value || null,
          })
        "
      >
        <option
          v-for="status in getStatusOptions((row as EventTableRow).status)"
          :key="status"
          :value="status"
        >
          {{ status }}
        </option>
      </select>
    </template>

    <template #cell-playersCount="{ row }">
      <EditableCellInput
        :model-value="getPlayersCount(row as EventTableRow)"
        type="number"
        inputmode="numeric"
        class="w-24 text-right"
        @update:model-value="
          emit('change', (row as EventTableRow).tableNumber, { playersCount: Number($event) })
        "
      />
    </template>

    <template #cell-comment="{ row }">
      <EditableCellInput
        :model-value="String((row as EventTableRow).comment ?? '')"
        type="text"
        :debounce="600"
        class="w-65"
        @update:model-value="
          emit('change', (row as EventTableRow).tableNumber, { comment: String($event) || null })
        "
      />
    </template>

    <template #cell-updatedAt="{ row }">
      <span class="whitespace-nowrap text-slate-500">
        {{ formatDate((row as EventTableRow).updatedAt) || '—' }}
      </span>
    </template>
  </UiDataTable>
</template>
