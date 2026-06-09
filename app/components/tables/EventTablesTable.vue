<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'
import type { EventTableRow, UpdateEventTableDto } from '~/types/operations'

defineProps<{
  tables: EventTableRow[]
}>()

const emit = defineEmits<{
  change: [tableNumber: number, payload: UpdateEventTableDto]
}>()

const columns: DataTableColumn[] = [
  { key: 'tableNumber', label: 'Table', width: '100px' },
  { key: 'status', label: 'Status', width: '160px' },
  { key: 'seats', label: 'Seats', width: '320px' },
  { key: 'comment', label: 'Comment', width: '260px' },
  { key: 'updatedAt', label: 'UpdatedAt', width: '160px' },
]

function getSeatsText(table: EventTableRow) {
  if (!table.seats?.length) return '—'

  return table.seats
    .map((seat) => {
      const player = seat.user?.badge ?? seat.user?.name ?? seat.participantId ?? 'empty'
      return `${seat.seatNumber}: ${player}`
    })
    .join(', ')
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
      <span class="font-semibold text-slate-950">{{ (row as EventTableRow).tableNumber }}</span>
    </template>

    <template #cell-status="{ row }">
      <EditableCellInput
        :model-value="String((row as EventTableRow).status ?? '')"
        type="text"
        class="w-36"
        @update:model-value="
          emit('change', (row as EventTableRow).tableNumber, { status: String($event) || null })
        "
      />
    </template>

    <template #cell-seats="{ row }">
      <span class="text-slate-600">{{ getSeatsText(row as EventTableRow) }}</span>
    </template>

    <template #cell-comment="{ row }">
      <EditableCellInput
        :model-value="String((row as EventTableRow).comment ?? '')"
        type="text"
        class="w-65"
        @update:model-value="
          emit('change', (row as EventTableRow).tableNumber, { comment: String($event) || null })
        "
      />
    </template>

    <template #cell-updatedAt="{ row }">
      <span class="whitespace-nowrap text-slate-500">
        {{ (row as EventTableRow).updatedAt ?? '—' }}
      </span>
    </template>
  </UiDataTable>
</template>
