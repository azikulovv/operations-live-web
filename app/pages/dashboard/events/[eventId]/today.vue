<script setup lang="ts">
import type { HostessVisit } from '~/components/today/HostessVisitsTable.vue'
import HostessVisitsTable from '~/components/today/HostessVisitsTable.vue'
import type { EventParticipant } from '~/types/event'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()

const eventId = computed(() => String(route.params.eventId))

const { events, isLoading: isEventsLoading, error: eventsError } = useEvents()

const {
  participants,
  isLoading: isParticipantsLoading,
  error: participantsError,
  fetchParticipants,
} = useEventParticipants(eventId)

const event = computed(() => {
  return events.value.find((item) => item.id === eventId.value) ?? null
})

useHead({
  title: computed(() => `${event.value?.title || 'Событие'} · Сегодня | Operations Live`),
})

const search = ref('')

const pageError = computed(() => eventsError.value || participantsError.value)
const isLoading = computed(() => isEventsLoading.value || isParticipantsLoading.value)

const eventTitle = computed(() => event.value?.title || eventId.value)

function formatDateTime(value: string | null | undefined) {
  if (!value) return 'Дата не указана'

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

function getParticipantStatus(participant: EventParticipant): HostessVisit['status'] {
  if (participant.cancelledAt) return 'completed'

  return participant.status === 'PARTICIPANT' ? 'registered' : 'in_tournament'
}

const visits = computed<HostessVisit[]>(() => {
  return participants.value.map((participant, index) => ({
    id: participant.id,
    badge: participant.position ?? index + 1,
    nickname: participant.user.username || participant.user.email,
    registeredAt: formatDateTime(participant.createdAt),
    tournament: eventTitle.value,
    source: 'app',
    status: getParticipantStatus(participant),
    tournamentAmount: 0,
    barAmount: 0,
    dartsAmount: 0,
    totalAmount: 0,
    paidAmount: 0,
    isClosed: Boolean(participant.cancelledAt),
    debtComment: '',
  }))
})

const filteredVisits = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) return visits.value

  return visits.value.filter((visit) => {
    return (
      visit.nickname.toLowerCase().includes(query) ||
      String(visit.badge).includes(query) ||
      visit.tournament.toLowerCase().includes(query)
    )
  })
})

async function refreshPage() {
  await Promise.all([fetchParticipants()])
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <template v-if="event || isEventsLoading">
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div class="flex items-center gap-2">
            <p class="text-xs font-medium text-slate-500">Сегодня</p>

            <span class="size-1 rounded-full bg-slate-300" />

            <p class="text-xs text-slate-400">
              {{ eventTitle }} · {{ formatDateTime(event?.startsAt) }}
            </p>
          </div>

          <h2 class="mt-1 text-xl font-semibold tracking-tight text-slate-950">Хостес</h2>

          <p class="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
            Регистрации, Badge, статусы, начисления и закрытие визита.
          </p>
        </div>

        <button
          type="button"
          class="h-9 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          Добавить игрока
        </button>
      </div>

      <UiCard>
        <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 class="text-sm font-semibold tracking-tight text-slate-950">Список игроков</h3>

            <p class="mt-1 text-xs text-slate-500">
              {{ participants.length }} игроков зарегистрировано на событие.
            </p>
          </div>

          <div class="w-full md:w-72">
            <input
              v-model.trim="search"
              type="text"
              placeholder="Поиск: Badge, Nickname, email, телефон"
              class="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-950 transition outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </div>
        </div>

        <div v-if="isLoading" class="space-y-3">
          <div v-for="index in 4" :key="index" class="h-10 animate-pulse rounded-xl bg-slate-100" />
        </div>

        <div
          v-else-if="pageError"
          class="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center"
        >
          <p class="text-sm font-semibold text-red-700">{{ pageError }}</p>

          <button
            type="button"
            class="mt-3 h-9 rounded-xl bg-red-700 px-4 text-xs font-semibold text-white transition hover:bg-red-800"
            @click="refreshPage"
          >
            Повторить
          </button>
        </div>

        <HostessVisitsTable v-else :visits="filteredVisits" />
      </UiCard>
    </template>

    <UiCard v-else>
      <p class="text-sm font-semibold text-slate-950">Событие не найдено</p>

      <p class="mt-1 text-xs text-slate-500">Возможно, событие было удалено или ссылка устарела.</p>

      <NuxtLink
        to="/dashboard/events"
        class="mt-4 inline-flex h-9 items-center rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white"
      >
        Вернуться к событиям
      </NuxtLink>
    </UiCard>
  </div>
</template>
