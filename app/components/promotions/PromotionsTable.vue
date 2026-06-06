<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'
import type { EventPromotion, EventPromotionType } from '~/types/event'

type Props = {
  promotions: EventPromotion[]
}

defineProps<Props>()

const columns: DataTableColumn[] = [
  {
    key: 'nickname',
    label: 'Nickname',
    stickyLeft: '0px',
    width: '180px',
  },
  {
    key: 'type',
    label: 'Promotion Type',
    width: '120px',
  },
  {
    key: 'reason',
    label: 'Reason',
    width: '120px',
  },
  {
    key: 'discountPercent',
    label: 'Discount %',
    align: 'right',
    width: '80px',
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

function getPromotionTypeLabel(type: EventPromotionType | string | undefined) {
  if (!type) return 'Не задано'

  const labels: Record<EventPromotionType, string> = {
    CERTIFICATE: 'Сертификат',
    DEALER: 'Дилер',
    DISCOUNT: 'Скидка',
    FIFTH_VISIT: '5-й визит',
    FREE_ENTRY: 'Free Entry',
    LADIES_DAY: 'Ladies Day',
    VIP: 'VIP',
  }

  return type in labels ? labels[type as EventPromotionType] : type
}

function getPromotionTypeClass(type: EventPromotionType | string | undefined) {
  const classes: Record<EventPromotionType, string> = {
    CERTIFICATE: 'bg-violet-50 text-violet-700 ring-violet-100',
    DEALER: 'bg-amber-50 text-amber-700 ring-amber-100',
    DISCOUNT: 'bg-sky-50 text-sky-700 ring-sky-100',
    FIFTH_VISIT: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    FREE_ENTRY: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    LADIES_DAY: 'bg-rose-50 text-rose-700 ring-rose-100',
    VIP: 'bg-slate-950 text-white ring-slate-950',
  }

  if (!type || !(type in classes)) return 'bg-slate-50 text-slate-600 ring-slate-200'

  return classes[type as EventPromotionType]
}

function getPlayerName(promotion: EventPromotion) {
  return promotion.user.name || promotion.user.email
}

function isPromotionUsed(promotion: EventPromotion) {
  return promotion.promotion?.used
}
</script>

<template>
  <UiDataTable
    :columns="columns"
    :rows="promotions"
    row-key="participantId"
    min-width="1050px"
    empty-text="Акции не найдены"
  >
    <template #cell-nickname="{ row }">
      <div class="max-w-40 truncate font-medium text-slate-950">
        {{ getPlayerName(row as EventPromotion) }}
      </div>
    </template>

    <template #cell-type="{ row }">
      <span
        class="inline-flex h-6 items-center rounded-full px-2 text-[11px] font-medium ring-1"
        :class="getPromotionTypeClass((row as EventPromotion).promotion?.promotionType)"
      >
        {{ getPromotionTypeLabel((row as EventPromotion).promotion?.promotionType) }}
      </span>
    </template>

    <template #cell-discountPercent="{ row }">
      {{ (row as EventPromotion).promotion?.discountPercent ?? 0 }}%
    </template>

    <template #cell-reason="{ row }">
      <div class="max-w-64 truncate text-slate-600">
        {{ (row as EventPromotion).promotion?.reason || '—' }}
      </div>
    </template>

    <template #cell-used="{ row }">
      <span
        class="inline-flex h-6 items-center rounded-full px-2 text-[11px] font-medium ring-1"
        :class="
          isPromotionUsed(row as EventPromotion)
            ? 'bg-slate-50 text-slate-500 ring-slate-200'
            : 'bg-emerald-50 text-emerald-700 ring-emerald-100'
        "
      >
        {{ isPromotionUsed(row as EventPromotion) }}
      </span>
    </template>

    <template #cell-comment="{ row }">
      <div class="max-w-64 truncate text-slate-600">
        {{ (row as EventPromotion).promotion?.comment || '—' }}
      </div>
    </template>
  </UiDataTable>
</template>
