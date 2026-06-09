<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'
import type { UpdateFinalTableDto } from '~/types/operations'

export type FinalTablePlayerRow = {
  participantId: string
  badge: number | string | null
  nickname: string | null
  place: number | null
  prizeAmount: number
  comment: string | null
  updatedAt: string | null
}

defineProps<{
  players: FinalTablePlayerRow[]
}>()

const emit = defineEmits<{
  change: [participantId: string, payload: UpdateFinalTableDto]
}>()

const columns: DataTableColumn[] = [
  { key: 'badge', label: 'Badge', width: '90px' },
  { key: 'nickname', label: 'Nickname', width: '180px' },
  { key: 'place', label: 'Place', align: 'right', width: '120px' },
  { key: 'prizeAmount', label: 'Prize', align: 'right', width: '140px' },
  { key: 'comment', label: 'Comment', width: '260px' },
  { key: 'updatedAt', label: 'UpdatedAt', width: '160px' },
]
</script>

<template>
  <UiDataTable
    :columns="columns"
    :rows="players"
    row-key="participantId"
    min-width="950px"
    empty-text="Финальный стол пуст"
  >
    <template #cell-badge="{ row }">
      <span class="font-semibold text-slate-950">{{
        (row as FinalTablePlayerRow).badge ?? '—'
      }}</span>
    </template>

    <template #cell-nickname="{ row }">
      <span class="text-slate-700">{{ (row as FinalTablePlayerRow).nickname ?? '—' }}</span>
    </template>

    <template #cell-place="{ row }">
      <EditableCellInput
        :model-value="(row as FinalTablePlayerRow).place ?? ''"
        type="number"
        inputmode="numeric"
        class="w-24 text-right"
        @update:model-value="
          emit('change', (row as FinalTablePlayerRow).participantId, {
            place: Number($event) || null,
          })
        "
      />
    </template>

    <template #cell-prizeAmount="{ row }">
      <EditableCellInput
        :model-value="(row as FinalTablePlayerRow).prizeAmount"
        type="number"
        inputmode="numeric"
        class="w-28 text-right"
        @update:model-value="
          emit('change', (row as FinalTablePlayerRow).participantId, {
            prizeAmount: Number($event),
          })
        "
      />
    </template>

    <template #cell-comment="{ row }">
      <EditableCellInput
        :model-value="(row as FinalTablePlayerRow).comment ?? ''"
        type="text"
        class="w-65"
        @update:model-value="
          emit('change', (row as FinalTablePlayerRow).participantId, { comment: String($event) })
        "
      />
    </template>

    <template #cell-updatedAt="{ row }">
      <span class="whitespace-nowrap text-slate-500">
        {{ (row as FinalTablePlayerRow).updatedAt ?? '—' }}
      </span>
    </template>
  </UiDataTable>
</template>
