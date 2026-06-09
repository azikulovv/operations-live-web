<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'
import type { UpdateBartenderSaleDto } from '~/types/bartender-sales'
import EditableCellInput from '../ui/EditableCellInput.vue'

export type BartenderPayment = {
  participantId: string
  badge: string | null
  nickname: string | null
  amount: number
  comment: string | null
  updatedAt: string | null
}

defineProps<{
  payments: BartenderPayment[]
}>()

const emit = defineEmits<{
  change: [participantId: string, payload: UpdateBartenderSaleDto]
}>()

const columns: DataTableColumn[] = [
  {
    key: 'badge',
    label: 'Badge',
    width: '90px',
  },
  {
    key: 'nickname',
    label: 'Nickname',
    width: '180px',
  },
  {
    key: 'amount',
    label: 'Amount',
    width: '140px',
  },
  {
    key: 'comment',
    label: 'Comment',
    width: '260px',
  },
  {
    key: 'updatedAt',
    label: 'UpdatedAt',
    width: '160px',
  },
]
</script>

<template>
  <UiDataTable
    :columns="columns"
    :rows="payments"
    row-key="id"
    min-width="830px"
    empty-text="Записей пока нет"
  >
    <template #cell-badge="{ row }">
      <span class="font-semibold text-slate-950">
        {{ (row as BartenderPayment).badge }}
      </span>
    </template>

    <template #cell-nickname="{ row }">
      <span class="text-slate-700">
        {{ (row as BartenderPayment).nickname }}
      </span>
    </template>

    <template #cell-amount="{ row }">
      <EditableCellInput
        :model-value="(row as BartenderPayment).amount!"
        type="number"
        inputmode="numeric"
        class="w-35"
        @update:model-value="
          emit('change', (row as BartenderPayment).participantId, {
            amount: Number($event),
          })
        "
      />
    </template>

    <template #cell-comment="{ row }">
      <EditableCellInput
        :model-value="(row as BartenderPayment).comment!"
        type="text"
        class="w-65"
        @update:model-value="
          emit('change', (row as BartenderPayment).participantId, {
            comment: String($event),
          })
        "
      />
    </template>

    <template #cell-updatedAt="{ row }">
      <span class="whitespace-nowrap text-slate-500">
        {{ (row as BartenderPayment).updatedAt }}
      </span>
    </template>
  </UiDataTable>
</template>
