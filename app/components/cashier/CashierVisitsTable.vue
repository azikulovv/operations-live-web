<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'

export type PaymentStatus = 'unpaid' | 'partial' | 'paid'
export type CashierVisit = {
  id: string
  participantId: string
  badge: number
  nickname: string
  tournament: string
  totalAmount: number
  discountAmount: number
  payableAmount: number
  paidAmount: number
  paymentStatus: PaymentStatus
  comment: string
}

defineProps<{
  visits: CashierVisit[]
  savingId?: string | null
}>()

const emit = defineEmits<{
  save: [visit: CashierVisit]
  'update-total': [visit: CashierVisit, value: number]
  'update-comment': [visit: CashierVisit, value: string]
  'update-paid': [visit: CashierVisit, value: number]
}>()

const columns: DataTableColumn[] = [
  {
    key: 'badge',
    label: 'Badge',
    sticky: true,
    stickyLeft: '0px',
    width: '68px',
  },
  {
    key: 'nickname',
    label: 'Nickname',
    sticky: true,
    stickyLeft: '68px',
    width: '150px',
  },
  {
    key: 'tournament',
    label: 'Турнир',
    width: '160px',
  },
  {
    key: 'totalAmount',
    label: 'Начислено',
    align: 'right',
    width: '120px',
    cellClass: 'bg-emerald-50/50 font-medium tabular-nums text-slate-800',
  },
  {
    key: 'discountAmount',
    label: 'Промо / скидка',
    align: 'right',
    width: '130px',
    cellClass: 'tabular-nums text-slate-600',
  },
  {
    key: 'payableAmount',
    label: 'К оплате',
    align: 'right',
    width: '120px',
    cellClass: 'bg-emerald-50/70 font-semibold tabular-nums text-slate-950',
  },
  {
    key: 'paidAmount',
    label: 'Оплачено',
    align: 'right',
    width: '120px',
    cellClass: 'font-semibold tabular-nums text-slate-950',
  },
  {
    key: 'paymentStatus',
    label: 'Статус',
    width: '120px',
  },
  {
    key: 'comment',
    label: 'Комментарий',
    width: '220px',
  },
  {
    key: 'actions',
    label: '',
    align: 'right',
    width: '120px',
  },
]

function formatMoney(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value)
}

function getPaymentStatusLabel(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    unpaid: 'Не оплачено',
    partial: 'Частично',
    paid: 'Оплачено',
  }

  return labels[status]
}

function getPaymentStatusClass(status: PaymentStatus) {
  const classes: Record<PaymentStatus, string> = {
    unpaid: 'bg-red-50 text-red-700 ring-red-100',
    partial: 'bg-amber-50 text-amber-700 ring-amber-100',
    paid: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  }

  return classes[status]
}
</script>

<template>
  <UiDataTable
    :columns="columns"
    :rows="visits"
    row-key="id"
    min-width="1160px"
    empty-text="Записи не найдены"
  >
    <template #cell-badge="{ row }">
      <span
        class="inline-flex h-7 min-w-9 items-center justify-center rounded-xl bg-slate-100 px-2 text-xs font-semibold text-slate-800"
      >
        {{ (row as CashierVisit).badge }}
      </span>
    </template>

    <template #cell-nickname="{ row }">
      <div class="max-w-32 truncate font-medium text-slate-950">
        {{ (row as CashierVisit).nickname }}
      </div>
    </template>

    <template #cell-tournament="{ row }">
      <div class="max-w-40 truncate text-slate-600">
        {{ (row as CashierVisit).tournament }}
      </div>
    </template>

    <template #cell-totalAmount="{ row }">
      <input
        :value="(row as CashierVisit).totalAmount"
        type="number"
        min="0"
        class="h-8 w-24 rounded-lg border border-slate-200 bg-white px-2 text-right text-xs font-medium text-slate-800 transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        @input="
          emit(
            'update-total',
            row as CashierVisit,
            Number(($event.target as HTMLInputElement).value),
          )
        "
      />
    </template>

    <template #cell-discountAmount="{ row }">
      <span
        :class="
          (row as CashierVisit).discountAmount > 0 ? 'font-medium text-amber-700' : 'text-slate-400'
        "
      >
        {{ formatMoney((row as CashierVisit).discountAmount) }}
      </span>
    </template>

    <template #cell-payableAmount="{ row }">
      {{ formatMoney((row as CashierVisit).payableAmount) }}
    </template>

    <template #cell-paidAmount="{ row }">
      <input
        :value="(row as CashierVisit).paidAmount"
        type="number"
        min="0"
        class="h-8 w-24 rounded-lg border border-slate-200 bg-white px-2 text-right text-xs font-semibold text-slate-950 transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        @input="
          emit(
            'update-paid',
            row as CashierVisit,
            Number(($event.target as HTMLInputElement).value),
          )
        "
      />
    </template>

    <template #cell-paymentStatus="{ row }">
      <span
        class="inline-flex h-6 items-center rounded-full px-2 text-[11px] font-medium ring-1"
        :class="getPaymentStatusClass((row as CashierVisit).paymentStatus)"
      >
        {{ getPaymentStatusLabel((row as CashierVisit).paymentStatus) }}
      </span>
    </template>

    <template #cell-comment="{ row }">
      <input
        :value="(row as CashierVisit).comment"
        type="text"
        class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        placeholder="Комментарий"
        @input="
          emit('update-comment', row as CashierVisit, ($event.target as HTMLInputElement).value)
        "
      />
    </template>

    <template #cell-actions="{ row }">
      <button
        type="button"
        class="h-8 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="savingId === (row as CashierVisit).participantId"
        @click="emit('save', row as CashierVisit)"
      >
        {{ savingId === (row as CashierVisit).participantId ? '...' : 'Сохранить' }}
      </button>
    </template>
  </UiDataTable>
</template>
