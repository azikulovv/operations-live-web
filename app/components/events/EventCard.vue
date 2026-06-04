<script setup lang="ts">
import type { OperationEvent, OperationEventStatus } from '~/types/event'

defineProps<{
  event: OperationEvent
}>()

const emit = defineEmits<{
  open: [event: OperationEvent]
}>()

function formatMoney(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value)
}

function getEventStatusLabel(status: OperationEventStatus) {
  const labels: Record<OperationEventStatus, string> = {
    active: 'Активное',
    completed: 'Прошедшее',
  }

  return labels[status]
}

function getEventStatusClass(status: OperationEventStatus) {
  const classes: Record<OperationEventStatus, string> = {
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    completed: 'bg-slate-50 text-slate-500 ring-slate-200',
  }

  return classes[status]
}
</script>

<template>
  <button
    type="button"
    class="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
    @click="emit('open', event)"
  >
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="truncate text-sm font-semibold text-slate-950">
            {{ event.title }}
          </h3>

          <span
            class="inline-flex h-6 items-center rounded-full px-2 text-[11px] font-medium ring-1"
            :class="getEventStatusClass(event.status)"
          >
            {{ getEventStatusLabel(event.status) }}
          </span>
        </div>

        <p class="mt-1 text-xs text-slate-500">
          {{ event.date }} · {{ event.time }} · {{ event.registrationsCount }} регистраций
        </p>
      </div>

      <div class="grid grid-cols-3 gap-3 text-right md:min-w-90">
        <div>
          <p class="text-[11px] text-slate-400">Начислено</p>
          <p class="mt-1 text-xs font-semibold text-slate-950">
            {{ formatMoney(event.totalAmount) }} ₸
          </p>
        </div>

        <div>
          <p class="text-[11px] text-slate-400">Оплачено</p>
          <p class="mt-1 text-xs font-semibold text-emerald-700">
            {{ formatMoney(event.paidAmount) }} ₸
          </p>
        </div>

        <div>
          <p class="text-[11px] text-slate-400">Долг</p>
          <p
            class="mt-1 text-xs font-semibold"
            :class="event.debtAmount > 0 ? 'text-red-600' : 'text-slate-950'"
          >
            {{ formatMoney(event.debtAmount) }} ₸
          </p>
        </div>
      </div>
    </div>
  </button>
</template>
