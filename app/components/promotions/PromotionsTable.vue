<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'

export type PromotionType =
  | 'free_entry'
  | 'discount'
  | 'certificate'
  | 'dealer'
  | 'fifth_visit'
  | 'ladies_day'

export type Promotion = {
  id: string
  nickname: string
  type: PromotionType
  reason: string
  discountPercent: number
  used: boolean
  comment: string
}

type Props = {
  promotions: Promotion[]
}

defineProps<Props>()

const columns: DataTableColumn[] = [
  {
    key: 'nickname',
    label: 'Nickname',
    sticky: true,
    stickyLeft: '0px',
    width: '180px',
  },
  {
    key: 'type',
    label: 'Promotion Type',
    width: '180px',
  },
  {
    key: 'reason',
    label: 'Reason',
    width: '260px',
  },
  {
    key: 'discountPercent',
    label: 'Discount %',
    align: 'right',
    width: '120px',
    cellClass: 'font-semibold tabular-nums text-slate-950',
  },
  {
    key: 'used',
    label: 'Used',
    width: '100px',
  },
  {
    key: 'comment',
    label: 'Комментарий',
    width: '260px',
  },
]

function getPromotionTypeLabel(type: PromotionType) {
  const labels: Record<PromotionType, string> = {
    free_entry: 'Free Entry',
    discount: 'Discount',
    certificate: 'Certificate',
    dealer: 'Dealer',
    fifth_visit: '5th Visit',
    ladies_day: 'Ladies Day',
  }

  return labels[type]
}

function getPromotionTypeClass(type: PromotionType) {
  const classes: Record<PromotionType, string> = {
    free_entry: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    discount: 'bg-sky-50 text-sky-700 ring-sky-100',
    certificate: 'bg-violet-50 text-violet-700 ring-violet-100',
    dealer: 'bg-amber-50 text-amber-700 ring-amber-100',
    fifth_visit: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    ladies_day: 'bg-rose-50 text-rose-700 ring-rose-100',
  }

  return classes[type]
}
</script>

<template>
  <UiDataTable
    :columns="columns"
    :rows="promotions"
    row-key="id"
    min-width="1050px"
    empty-text="Акции не найдены"
  >
    <template #cell-nickname="{ row }">
      <div class="max-w-40 truncate font-medium text-slate-950">
        {{ (row as Promotion).nickname }}
      </div>
    </template>

    <template #cell-type="{ row }">
      <span
        class="inline-flex h-6 items-center rounded-full px-2 text-[11px] font-medium ring-1"
        :class="getPromotionTypeClass((row as Promotion).type)"
      >
        {{ getPromotionTypeLabel((row as Promotion).type) }}
      </span>
    </template>

    <template #cell-reason="{ row }">
      <div class="max-w-64 truncate text-slate-600">
        {{ (row as Promotion).reason || '—' }}
      </div>
    </template>

    <template #cell-discountPercent="{ row }"> {{ (row as Promotion).discountPercent }}% </template>

    <template #cell-used="{ row }">
      <span
        class="inline-flex h-6 items-center rounded-full px-2 text-[11px] font-medium ring-1"
        :class="
          (row as Promotion).used
            ? 'bg-slate-50 text-slate-500 ring-slate-200'
            : 'bg-emerald-50 text-emerald-700 ring-emerald-100'
        "
      >
        {{ (row as Promotion).used ? 'Да' : 'Нет' }}
      </span>
    </template>

    <template #cell-comment="{ row }">
      <div class="max-w-64 truncate text-slate-600">
        {{ (row as Promotion).comment || '—' }}
      </div>
    </template>
  </UiDataTable>
</template>
