<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'
import UiDataTable from '~/components/ui/UiDataTable.vue'
import type { UpdateEventParticipantPayload } from '~/types/event'
import EditableCellInput from '../ui/EditableCellInput.vue'

export type VisitStatus = 'registered' | 'in_tournament' | 'completed' | 'cancelled'
export type VisitSource = 'app' | 'manual'

export type HostessVisit = {
  id: string
  badge: string | number | null
  nickname: string
  tournament: string
  source: VisitSource
  registeredAt: string
  status: VisitStatus
  arrived: boolean
  isArrivalUpdating: boolean
  arrivalError: string | null
  tableNumber: number | null
  seatNumber: number | null
  reEntry: number
  addon: number
  barAmount: number
  dartsAmount: number
  totalAmount: number
  paidAmount: number
  isClosed: boolean
  debtComment: string
}

defineProps<{
  visits: HostessVisit[]
}>()

const emit = defineEmits<{
  change: [participantId: string, payload: UpdateEventParticipantPayload]
}>()

const columns: DataTableColumn[] = [
  {
    key: 'badge',
    label: 'Бейдж',
    stickyLeft: '0px',
    width: '68px',
  },
  {
    key: 'nickname',
    label: 'Имя пользователя',
    stickyLeft: '68px',
    width: '150px',
  },
  {
    key: 'tournament',
    label: 'Турнир',
    width: '150px',
  },
  {
    key: 'source',
    label: 'Источник',
    width: '100px',
  },
  {
    key: 'registeredAt',
    label: 'Время',
    width: '90px',
    cellClass: 'tabular-nums text-slate-600',
  },
  {
    key: 'status',
    label: 'Статус',
    width: '130px',
  },
  {
    key: 'arrived',
    label: 'Присутствие',
    width: '130px',
  },
  {
    key: 'tableNumber',
    label: 'Стол',
    align: 'center',
    width: '70px',
  },
  {
    key: 'seatNumber',
    label: 'Место',
    align: 'center',
    width: '80px',
  },
  {
    key: 'reEntry',
    label: 'Re-Entry',
    width: '110px',
  },
  {
    key: 'addon',
    label: 'Addon',
    width: '100px',
  },
  {
    key: 'barAmount',
    label: 'Бар',
    align: 'right',
    width: '90px',
    cellClass: 'bg-emerald-50/50 tabular-nums text-slate-700',
  },
  {
    key: 'dartsAmount',
    label: 'Игры',
    align: 'right',
    width: '90px',
    cellClass: 'bg-emerald-50/50 tabular-nums text-slate-700',
  },
  {
    key: 'totalAmount',
    label: 'Итого',
    align: 'right',
    width: '100px',
    cellClass: 'bg-emerald-50/70 font-semibold tabular-nums text-slate-950',
  },
  {
    key: 'paidAmount',
    label: 'Оплачено',
    align: 'right',
    width: '100px',
    cellClass: 'font-medium tabular-nums text-slate-950',
  },
  {
    key: 'isClosed',
    label: 'Закрыт',
    width: '90px',
  },
  {
    key: 'debtComment',
    label: 'Комментарий',
    width: '220px',
  },
]

function getStatusLabel(status: VisitStatus) {
  const labels: Record<VisitStatus, string> = {
    registered: 'Зарегистрирован',
    in_tournament: 'В турнире',
    completed: 'Завершён',
    cancelled: 'Отменил',
  }

  return labels[status]
}

function getSourceLabel(source: VisitSource) {
  const labels: Record<VisitSource, string> = {
    app: 'App',
    manual: 'Вручную',
  }

  return labels[source]
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value)
}
</script>

<template>
  <UiDataTable
    :columns="columns"
    :rows="visits"
    row-key="id"
    min-width="1600px"
    empty-text="Игроки не найдены"
  >
    <template #cell-badge="{ row }">
      <EditableCellInput
        :model-value="(row as HostessVisit).badge ?? ''"
        type="text"
        inputmode="numeric"
        class="w-16 text-center"
        @update:model-value="
          emit('change', (row as HostessVisit).id, {
            badge: String($event).trim() || null,
          })
        "
      />
    </template>

    <template #cell-nickname="{ row }">
      <div class="max-w-32 truncate font-medium text-slate-950">
        {{ (row as HostessVisit).nickname }}
      </div>
    </template>

    <template #cell-tournament="{ row }">
      <div class="max-w-36 truncate text-slate-600">
        {{ (row as HostessVisit).tournament }}
      </div>
    </template>

    <template #cell-source="{ row }">
      <span
        class="inline-flex h-6 items-center rounded-full bg-sky-50 px-2 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100"
      >
        {{ getSourceLabel((row as HostessVisit).source) }}
      </span>
    </template>

    <template #cell-status="{ row }">
      <span
        class="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100"
      >
        {{ getStatusLabel((row as HostessVisit).status) }}
      </span>
    </template>

    <template #cell-arrived="{ row }">
      <div class="flex flex-col items-start gap-1">
        <button
          type="button"
          class="inline-flex h-7 min-w-24 items-center justify-center rounded-full px-3 text-[11px] font-semibold ring-1 transition disabled:cursor-wait disabled:opacity-70"
          :class="
            (row as HostessVisit).arrived
              ? 'bg-emerald-50 text-emerald-700 ring-emerald-100 hover:bg-emerald-100'
              : 'bg-slate-50 text-slate-500 ring-slate-200 hover:bg-slate-100'
          "
          :disabled="(row as HostessVisit).isArrivalUpdating"
          :aria-pressed="(row as HostessVisit).arrived"
          @click="
            emit('change', (row as HostessVisit).id, {
              arrived: !(row as HostessVisit).arrived,
            })
          "
        >
          {{
            (row as HostessVisit).isArrivalUpdating
              ? 'Сохраняем'
              : (row as HostessVisit).arrived
                ? 'Пришел'
                : 'Не пришел'
          }}
        </button>

        <span
          v-if="(row as HostessVisit).arrivalError"
          class="max-w-28 text-[10px] leading-3 text-red-600"
        >
          {{ (row as HostessVisit).arrivalError }}
        </span>
      </div>
    </template>

    <template #cell-tableNumber="{ row }">
      {{ (row as HostessVisit).tableNumber ?? '—' }}
    </template>

    <template #cell-seatNumber="{ row }">
      {{ (row as HostessVisit).seatNumber ?? '—' }}
    </template>

    <template #cell-reEntry="{ row }">
      {{ (row as HostessVisit).reEntry }}
    </template>

    <template #cell-addon="{ row }">
      {{ (row as HostessVisit).addon }}
    </template>

    <template #cell-barAmount="{ row }">
      {{ formatMoney((row as HostessVisit).barAmount) }}
    </template>

    <template #cell-dartsAmount="{ row }">
      {{ formatMoney((row as HostessVisit).dartsAmount) }}
    </template>

    <template #cell-totalAmount="{ row }">
      {{ formatMoney((row as HostessVisit).totalAmount) }}
    </template>

    <template #cell-paidAmount="{ row }">
      {{ formatMoney((row as HostessVisit).paidAmount) }}
    </template>

    <template #cell-isClosed="{ row }">
      <span
        class="inline-flex h-6 items-center rounded-full px-2 text-[11px] font-medium ring-1"
        :class="
          (row as HostessVisit).isClosed
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
            : 'bg-slate-50 text-slate-500 ring-slate-200'
        "
      >
        {{ (row as HostessVisit).isClosed ? 'Да' : 'Нет' }}
      </span>
    </template>

    <template #cell-debtComment="{ row }">
      <div class="max-w-52 truncate text-slate-600">
        {{ (row as HostessVisit).debtComment || '—' }}
      </div>
    </template>
  </UiDataTable>
</template>
