<script setup lang="ts">
import type { DataTableColumn } from '~/components/ui/UiDataTable.vue'
import UiDataTable from '~/components/ui/UiDataTable.vue'

export type VisitStatus = 'registered' | 'in_tournament' | 'completed'
export type VisitSource = 'app' | 'manual'

export type HostessVisit = {
  id: string
  badge: number
  nickname: string
  email: string
  phone: string
  tournament: string
  source: VisitSource
  registeredAt: string
  status: VisitStatus
  tableNumber: number | null
  seatNumber: number | null
  tournamentAmount: number
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

const columns: DataTableColumn[] = [
  {
    key: 'badge',
    label: 'Badge',
    stickyLeft: '0px',
    width: '68px',
  },
  {
    key: 'nickname',
    label: 'Nickname',
    stickyLeft: '68px',
    width: '150px',
  },
  {
    key: 'email',
    label: 'Email',
    width: '190px',
  },
  {
    key: 'phone',
    label: 'Телефон',
    width: '130px',
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
    key: 'tournamentAmount',
    label: 'Турнир',
    align: 'right',
    width: '100px',
    cellClass: 'bg-emerald-50/50 tabular-nums text-slate-700',
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
  {
    key: 'actions',
    label: '',
    align: 'right',
    width: '110px',
  },
]

function getStatusLabel(status: VisitStatus) {
  const labels: Record<VisitStatus, string> = {
    registered: 'Зарегистрирован',
    in_tournament: 'В турнире',
    completed: 'Завершён',
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
    min-width="1580px"
    empty-text="Игроки не найдены"
  >
    <template #cell-badge="{ row }">
      <span
        class="inline-flex h-7 min-w-9 items-center justify-center rounded-xl bg-slate-100 px-2 text-xs font-semibold text-slate-800"
      >
        {{ (row as HostessVisit).badge }}
      </span>
    </template>

    <template #cell-nickname="{ row }">
      <div class="max-w-32 truncate font-medium text-slate-950">
        {{ (row as HostessVisit).nickname }}
      </div>
    </template>

    <template #cell-email="{ row }">
      <div class="max-w-44 truncate text-slate-600">
        {{ (row as HostessVisit).email || '—' }}
      </div>
    </template>

    <template #cell-phone="{ row }">
      <div class="max-w-28 truncate text-slate-600">
        {{ (row as HostessVisit).phone || '—' }}
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

    <template #cell-tableNumber="{ row }">
      {{ (row as HostessVisit).tableNumber ?? '—' }}
    </template>

    <template #cell-seatNumber="{ row }">
      {{ (row as HostessVisit).seatNumber ?? '—' }}
    </template>

    <template #cell-tournamentAmount="{ row }">
      {{ formatMoney((row as HostessVisit).tournamentAmount) }}
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

    <template #cell-actions="{ row }">
      <NuxtLink
        :to="`/dashboard/events/${$route.params.eventId}/participants/${(row as HostessVisit).id}`"
        class="inline-flex h-8 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
      >
        Изменить
      </NuxtLink>
    </template>
  </UiDataTable>
</template>
