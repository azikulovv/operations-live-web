<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'

export type BartenderPayment = {
  id: string
  badge: string | number
  nickname: string
  amount: number
  comment: string | null
  createdAt: string
}

defineProps<{
  payments: BartenderPayment[]
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
    key: 'createdAt',
    label: 'CreatedAt',
    width: '160px',
  },
]

function formatMoney(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0,
  }).format(value)
}
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
      <span class="font-semibold text-slate-950">
        {{ formatMoney((row as BartenderPayment).amount) }}
      </span>
    </template>

    <template #cell-comment="{ row }">
      <div class="max-w-64 truncate text-slate-500">
        {{ (row as BartenderPayment).comment || '—' }}
      </div>
    </template>

    <template #cell-createdAt="{ row }">
      <span class="whitespace-nowrap text-slate-500">
        {{ (row as BartenderPayment).createdAt }}
      </span>
    </template>
  </UiDataTable>
</template>
