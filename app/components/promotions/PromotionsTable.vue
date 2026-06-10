<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'
import type { EventPromotionType } from '~/types/event'
import type { UpdatePromotionDto } from '~/types/operations'

export type PromotionTableRow = {
  participantId: string
  badge: string | number | null
  nickname: string
  promotionType: EventPromotionType | string
  reason: string
  discountPercent: number
  used: number
  comment: string
}

type Props = {
  promotions: PromotionTableRow[]
}

defineProps<Props>()

const emit = defineEmits<{
  change: [participantId: string, payload: UpdatePromotionDto]
}>()

const columns: DataTableColumn[] = [
  {
    key: 'badge',
    label: 'Бейдж',
    width: '90px',
  },
  {
    key: 'nickname',
    label: 'Имя пользователя',
    stickyLeft: '0px',
    width: '180px',
  },
  {
    key: 'type',
    label: 'Тип промо',
    width: '150px',
  },
  {
    key: 'reason',
    label: 'Причина',
    width: '190px',
  },
  {
    key: 'discountPercent',
    label: 'Скидка %',
    align: 'right',
    width: '110px',
    cellClass: 'font-semibold tabular-nums text-slate-950',
  },
  {
    key: 'used',
    label: 'Использовано',
    width: '100px',
  },
  {
    key: 'comment',
    label: 'Комментарий',
    width: '260px',
  },
]

const promotionTypeOptions: Array<{ value: EventPromotionType; label: string }> = [
  { value: 'CERTIFICATE', label: 'Сертификат' },
  { value: 'DEALER', label: 'Дилер' },
  { value: 'DISCOUNT', label: 'Скидка' },
  { value: 'FIFTH_VISIT', label: '5-й визит' },
  { value: 'FREE_ENTRY', label: 'Free Entry' },
  { value: 'LADIES_DAY', label: 'Ladies Day' },
  { value: 'VIP', label: 'VIP' },
]

function isPromotionUsed(promotion: PromotionTableRow) {
  return promotion.used
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
    <template #cell-badge="{ row }">
      <span class="font-semibold text-slate-950">
        {{ (row as PromotionTableRow).badge ?? '—' }}
      </span>
    </template>

    <template #cell-nickname="{ row }">
      <div class="max-w-40 truncate font-medium text-slate-950">
        {{ (row as PromotionTableRow).nickname }}
      </div>
    </template>

    <template #cell-type="{ row }">
      <div class="flex items-center gap-2">
        <select
          :value="(row as PromotionTableRow).promotionType"
          class="h-8 min-w-28 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          @change="
            emit('change', (row as PromotionTableRow).participantId, {
              promotionType: ($event.target as HTMLSelectElement).value,
            })
          "
        >
          <option v-for="option in promotionTypeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </template>

    <template #cell-discountPercent="{ row }">
      <input
        :value="(row as PromotionTableRow).discountPercent"
        type="number"
        min="0"
        max="100"
        class="h-8 w-20 rounded-lg border border-slate-200 bg-white px-2 text-right text-xs font-semibold text-slate-950 transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        @input="
          emit('change', (row as PromotionTableRow).participantId, {
            discountPercent: Number(($event.target as HTMLInputElement).value),
          })
        "
      />
    </template>

    <template #cell-reason="{ row }">
      <input
        :value="(row as PromotionTableRow).reason"
        type="text"
        class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        placeholder="Причина"
        @input="
          emit('change', (row as PromotionTableRow).participantId, {
            reason: ($event.target as HTMLInputElement).value || null,
          })
        "
      />
    </template>

    <template #cell-used="{ row }">
      <label class="inline-flex items-center gap-2 text-xs text-slate-600">
        <input
          :value="isPromotionUsed(row as PromotionTableRow)"
          type="number"
          min="0"
          max="100"
          class="h-8 w-20 rounded-lg border border-slate-200 bg-white px-2 text-right text-xs font-semibold text-slate-950 transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          @change="
            emit('change', (row as PromotionTableRow).participantId, {
              used: Number(($event.target as HTMLInputElement).value),
            })
          "
        />
      </label>
    </template>

    <template #cell-comment="{ row }">
      <input
        :value="(row as PromotionTableRow).comment"
        type="text"
        class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        placeholder="Комментарий"
        @input="
          emit('change', (row as PromotionTableRow).participantId, {
            comment: ($event.target as HTMLInputElement).value || null,
          })
        "
      />
    </template>
  </UiDataTable>
</template>
