<script setup lang="ts">
import type { HostessVisit } from '~/components/today/HostessVisitsTable.vue'
import HostessVisitsTable from '~/components/today/HostessVisitsTable.vue'
import type { EventItem, EventParticipant } from '~/types/event'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()

const eventId = computed(() => String(route.params.eventId))
const eventSocket = useEventSocket()
let realtimeSocket: ReturnType<typeof eventSocket.connect> = null
let stopParticipantsSocketWatch: (() => void) | null = null

const { events, isLoading: isEventsLoading, error: eventsError, fetchEvents } = useEvents()

const event = computed(() => {
  return (
    events.value.find((item) => item.id === eventId.value || item.externalId === eventId.value) ??
    null
  )
})

const participantEventId = computed(() => event.value?.externalId ?? eventId.value)

const {
  participants,
  isLoading: isParticipantsLoading,
  error: participantsError,
  fetchParticipants,
} = useEventParticipants(participantEventId)

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
    badge: participant.userBadge ?? participant.position ?? index + 1,
    nickname: participant.user.username || participant.user.email,
    email: participant.user.email,
    phone: participant.user.phone ?? '',
    registeredAt: formatDateTime(participant.createdAt),
    tournament: eventTitle.value,
    source: 'app',
    status: getParticipantStatus(participant),
    tableNumber: participant.tableNumber,
    seatNumber: participant.seatNumber,
    tournamentAmount: participant.payment?.tournament ?? 0,
    barAmount: participant.payment?.bar ?? 0,
    dartsAmount: participant.payment?.games ?? 0,
    totalAmount:
      (participant.payment?.tournament ?? 0) +
      (participant.payment?.bar ?? 0) +
      (participant.payment?.games ?? 0),
    paidAmount: participant.payment?.paid ?? 0,
    isClosed: Boolean(participant.closed),
    debtComment:
      participant.tableNumber && participant.seatNumber
        ? `Стол ${participant.tableNumber}, место ${participant.seatNumber}`
        : '',
  }))
})

function handleActiveEventsUpdated(payload: { data?: EventItem[] } | EventItem[]) {
  events.value = getApiData(payload)
}

function handleParticipantsUpdated(
  payload: { eventId?: string; data?: EventParticipant[] } | EventParticipant[],
) {
  if (!Array.isArray(payload) && payload.eventId && payload.eventId !== participantEventId.value) {
    return
  }

  participants.value = getApiData(payload)
}

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
  await fetchEvents()
  await fetchParticipants()
}

onMounted(() => {
  const socket = eventSocket.connect()

  if (!socket) return

  realtimeSocket = socket
  socket.on('events:active:updated', handleActiveEventsUpdated)
  socket.on('events:participants:updated', handleParticipantsUpdated)
  socket.emit('events:active:subscribe')

  stopParticipantsSocketWatch = watch(
    participantEventId,
    (newEventId, oldEventId) => {
      if (oldEventId) {
        socket.emit('events:participants:unsubscribe', {
          eventId: oldEventId,
        })
      }

      if (newEventId) {
        socket.emit('events:participants:subscribe', {
          eventId: newEventId,
        })
      }
    },
    {
      immediate: true,
    },
  )
})

onBeforeUnmount(() => {
  stopParticipantsSocketWatch?.()

  if (!realtimeSocket) return

  realtimeSocket.emit('events:active:unsubscribe')
  realtimeSocket.emit('events:participants:unsubscribe', {
    eventId: participantEventId.value,
  })
  realtimeSocket.off('events:active:updated', handleActiveEventsUpdated)
  realtimeSocket.off('events:participants:updated', handleParticipantsUpdated)
})
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <template v-if="event || isEventsLoading">
      <SharedPageHeader
        class="mb-4"
        title="Хостес"
        description="Регистрации, бейджи, статусы, начисления и закрытие визита."
        :breadcrumbs="[
          { label: 'Сегодня' },
          { label: eventTitle },
          { label: formatDateTime(event?.startsAt) },
        ]"
      />

      <UiCard>
        <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 class="text-sm font-semibold tracking-tight text-slate-950">Список игроков</h3>

            <p class="mt-1 text-xs text-slate-500">
              {{ participants.length }} игроков зарегистрировано на событие.
            </p>
          </div>

          <div class="w-full md:w-72">
            <UiSearchInput v-model="search" placeholder="Поиск: бейдж, имя пользователя" />
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
