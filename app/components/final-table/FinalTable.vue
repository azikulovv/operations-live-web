<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'
import type { UpdateFinalTableDto } from '~/types/operations'
import EditableCellInput from '../ui/EditableCellInput.vue'

export type FinalTablePlayerRow = {
  id: string
  participantId: string
  email: string
  seat: number | null
  badge: string | number | null
  nickname: string | null
  stack: number
  updatedAt: string | null
}

defineProps<{
  players: FinalTablePlayerRow[]
}>()

const emit = defineEmits<{
  change: [participantId: string, payload: UpdateFinalTableDto]
}>()

const columns: DataTableColumn[] = [
  { key: 'badge', label: 'Бейдж', width: '90px' },
  { key: 'nickname', label: 'Имя пользователя', width: '180px' },
  { key: 'seat', label: 'Место', align: 'right', width: '110px' },
  { key: 'stack', label: 'Стек', align: 'right', width: '140px' },
  { key: 'updatedAt', label: 'Обновлен', width: '160px' },
]

function getSeat(value: string | number | null) {
  const seat = Number(value)

  if (!Number.isFinite(seat)) return 1

  return Math.min(Math.max(seat, 1), 9)
}

function getStack(value: string | number) {
  const stack = Number(value)

  if (!Number.isFinite(stack)) return 0

  return stack
}

function onSeatChange(row: FinalTablePlayerRow, value: string | number) {
  emit('change', row.participantId, {
    seat: getSeat(value),
    stack: getStack(row.stack),
  })
}

function onStackChange(row: FinalTablePlayerRow, value: string | number) {
  emit('change', row.participantId, {
    seat: getSeat(row.seat),
    stack: getStack(value),
  })
}
</script>

<template>
  <UiDataTable
    :columns="columns"
    :rows="players"
    row-key="id"
    min-width="760px"
    empty-text="Финальный стол пуст"
  >
    <template #cell-badge="{ row }">
      <span class="font-semibold text-slate-950">{{
        (row as FinalTablePlayerRow)?.badge ?? '—'
      }}</span>
    </template>

    <template #cell-nickname="{ row }">
      <span class="text-slate-700">{{
        (row as FinalTablePlayerRow).nickname ?? (row as FinalTablePlayerRow).email ?? '—'
      }}</span>
    </template>

    <template #cell-seat="{ row }">
      <EditableCellInput
        :model-value="(row as FinalTablePlayerRow).seat ?? ''"
        type="number"
        inputmode="numeric"
        min="1"
        max="9"
        class="w-20 text-right"
        @update:model-value="onSeatChange(row as FinalTablePlayerRow, $event)"
      />
    </template>

    <template #cell-stack="{ row }">
      <EditableCellInput
        :model-value="(row as FinalTablePlayerRow).stack"
        type="number"
        inputmode="numeric"
        min="0"
        class="w-28 text-right"
        @update:model-value="onStackChange(row as FinalTablePlayerRow, $event)"
      />
    </template>

    <template #cell-updatedAt="{ row }">
      <span class="whitespace-nowrap text-slate-500">
        {{ formatDate((row as FinalTablePlayerRow).updatedAt) || '—' }}
      </span>
    </template>
  </UiDataTable>
</template>
