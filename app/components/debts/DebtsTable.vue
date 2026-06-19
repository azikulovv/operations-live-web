<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'
import type { UpdateDebtDto } from '~/types/operations'
import EditableCellInput from '../ui/EditableCellInput.vue'

export type DebtTableRow = {
  participantId: string
  badge: number | string | null
  nickname: string | null
  amount: number
  comment: string | null
  closed: boolean
  updatedAt: string | null
}

defineProps<{
  debts: DebtTableRow[]
}>()

const emit = defineEmits<{
  change: [participantId: string, payload: UpdateDebtDto]
}>()

const columns: DataTableColumn[] = [
  { key: 'badge', label: 'Бейдж', width: '90px' },
  { key: 'nickname', label: 'Имя пользователя', width: '180px' },
  { key: 'amount', label: 'Долг', align: 'right', width: '140px' },
  { key: 'closed', label: 'Закрыт', width: '110px' },
  { key: 'comment', label: 'Комментарий', width: '260px' },
  { key: 'updatedAt', label: 'Обновлен', width: '160px' },
]
</script>

<template>
  <UiDataTable
    :columns="columns"
    :rows="debts"
    row-key="participantId"
    min-width="940px"
    empty-text="Долги не найдены"
  >
    <template #cell-badge="{ row }">
      <span class="font-semibold text-slate-950">{{ (row as DebtTableRow).badge ?? '—' }}</span>
    </template>

    <template #cell-nickname="{ row }">
      <span class="text-slate-700">{{ (row as DebtTableRow).nickname ?? '—' }}</span>
    </template>

    <template #cell-amount="{ row }">
      <EditableCellInput
        :model-value="(row as DebtTableRow).amount"
        type="number"
        inputmode="numeric"
        class="w-28 text-right"
        @update:model-value="
          emit('change', (row as DebtTableRow).participantId, { amount: Number($event) })
        "
      />
    </template>

    <template #cell-closed="{ row }">
      <input
        :checked="(row as DebtTableRow).closed"
        type="checkbox"
        class="size-4 rounded border-slate-300 text-slate-950"
        @change="
          emit('change', (row as DebtTableRow).participantId, {
            closed: ($event.target as HTMLInputElement).checked,
          })
        "
      />
    </template>

    <template #cell-comment="{ row }">
      <EditableCellInput
        :model-value="(row as DebtTableRow).comment ?? ''"
        type="text"
        :debounce="600"
        class="w-65"
        @update:model-value="
          emit('change', (row as DebtTableRow).participantId, { comment: String($event) })
        "
      />
    </template>

    <template #cell-updatedAt="{ row }">
      <span class="whitespace-nowrap text-slate-500">
        {{ formatDate((row as DebtTableRow).updatedAt) ?? '—' }}
      </span>
    </template>
  </UiDataTable>
</template>
