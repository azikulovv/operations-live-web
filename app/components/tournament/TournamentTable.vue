<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'
import type { UpdateTournamentDto } from '~/types/operations'

export type TournamentTableRow = {
  participantId: string
  badge: number | string | null
  nickname: string | null
  tableNumber: number | null
  seatNumber: number | null
  points: number
  place: number | null
  comment: string | null
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
  { key: 'tableNumber', label: 'Стол', width: '90px' },
  { key: 'seatNumber', label: 'Место', width: '90px' },
  { key: 'points', label: 'Очки', align: 'right', width: '120px' },
  { key: 'place', label: 'Позиция', align: 'right', width: '120px' },
  { key: 'comment', label: 'Комментарий', width: '240px' },
  { key: 'updatedAt', label: 'Обновлен', width: '160px' },
]
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

    <template #cell-points="{ row }">
      <EditableCellInput
        :model-value="(row as TournamentTableRow).points"
        type="number"
        inputmode="numeric"
        class="w-24 text-right"
        @update:model-value="
          emit('change', (row as TournamentTableRow).participantId, { points: Number($event) })
        "
      />
    </template>

    <template #cell-place="{ row }">
      <EditableCellInput
        :model-value="(row as TournamentTableRow).place ?? ''"
        type="number"
        inputmode="numeric"
        class="w-24 text-right"
        @update:model-value="
          emit('change', (row as TournamentTableRow).participantId, {
            place: Number($event) || null,
          })
        "
      />
    </template>

    <template #cell-comment="{ row }">
      <EditableCellInput
        :model-value="(row as TournamentTableRow).comment ?? ''"
        type="text"
        class="w-60"
        @update:model-value="
          emit('change', (row as TournamentTableRow).participantId, { comment: String($event) })
        "
      />
    </template>

    <template #cell-updatedAt="{ row }">
      <span class="whitespace-nowrap text-slate-500">
        {{ formatDate((row as TournamentTableRow).updatedAt) || '—' }}
      </span>
    </template>
  </UiDataTable>
</template>
