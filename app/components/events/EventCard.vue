<script setup lang="ts">
import { CalendarDays, Clock, MapPin, Trophy, Users } from 'lucide-vue-next'
import type { EventItem, EventStatus } from '~/types/event'

const props = defineProps<{
  event: EventItem
}>()

const emit = defineEmits<{
  open: [event: EventItem]
}>()

function getEventStatusLabel(status: EventStatus) {
  const labels: Record<EventStatus, string> = {
    active: 'Активное',
    cancelled: 'Отменено',
    completed: 'Прошедшее',
    draft: 'Черновик',
    published: 'Опубликовано',
  }

  return labels[status]
}

function getEventStatusClass(status: EventStatus) {
  const classes: Record<EventStatus, string> = {
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    cancelled: 'bg-red-50 text-red-700 ring-red-100',
    completed: 'bg-slate-50 text-slate-500 ring-slate-200',
    draft: 'bg-amber-50 text-amber-700 ring-amber-100',
    published: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  }

  return classes[status]
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return 'Не указано'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const registrationsCount = computed(() => {
  return props.event.registrationCount ?? props.event.registrationsCount ?? 0
})

function formatRegistrations(value: number) {
  const form = new Intl.PluralRules('ru-RU').select(value)

  if (form === 'one') return `${value} регистрация`
  if (form === 'few') return `${value} регистрации`

  return `${value} регистраций`
}

const tableInfo = computed(() => {
  const tableCount = props.event.tableCount ?? 0
  const seatsPerTable = props.event.seatsPerTable ?? 0

  if (!tableCount && !seatsPerTable) return 'Не задано'
  if (!tableCount) return `${seatsPerTable} мест/стол`
  if (!seatsPerTable) return `${tableCount} столов`

  return `${tableCount} x ${seatsPerTable}`
})
</script>

<template>
  <button
    type="button"
    class="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50 focus:ring-4 focus:ring-slate-100 focus:outline-none"
    @click="emit('open', event)"
  >
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex min-w-0 gap-3">
        <NuxtImg
          v-if="event.imageUrl"
          :src="event.imageUrl"
          :alt="event.title"
          class="size-16 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
        />

        <div
          v-else
          class="flex size-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 ring-1 ring-slate-200"
        >
          <Trophy class="size-6" />
        </div>

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

          <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span class="inline-flex items-center gap-1">
              <CalendarDays class="size-3.5" />
              {{ formatDateTime(event.startsAt) }}
            </span>

            <span class="inline-flex items-center gap-1">
              <Clock class="size-3.5" />
              {{ formatDateTime(event.endsAt) }}
            </span>

            <span class="inline-flex min-w-0 items-center gap-1">
              <MapPin class="size-3.5 shrink-0" />
              <span class="truncate">{{ event.city }}, {{ event.address }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 text-left sm:grid-cols-4 lg:min-w-110 lg:text-right">
        <div>
          <p class="text-[11px] text-slate-400">Регистрации</p>
          <p class="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-950">
            <Users class="size-3.5 lg:hidden" />
            {{ formatRegistrations(registrationsCount) }}
          </p>
        </div>

        <div>
          <p class="text-[11px] text-slate-400">Лимит</p>
          <p class="mt-1 text-xs font-semibold text-slate-950">
            {{
              event.participantLimit == null ? 'Не задано' : `${event.participantLimit} игроков`
            }}
          </p>
        </div>

        <div>
          <p class="text-[11px] text-slate-400">Формат</p>
          <p class="mt-1 truncate text-xs font-semibold text-slate-950">
            {{ event.gameType }}
          </p>
        </div>

        <div>
          <p class="text-[11px] text-slate-400">Столы</p>
          <p class="mt-1 truncate text-xs font-semibold text-slate-950">
            {{ tableInfo }}
          </p>
        </div>
      </div>
    </div>
  </button>
</template>
