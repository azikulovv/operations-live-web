<script setup lang="ts">
import type { BartenderPayment } from '~/components/bartender/BartenderPaymentsTable.vue'
import BartenderPaymentsTable from '~/components/bartender/BartenderPaymentsTable.vue'
import type { EventItem, EventParticipant } from '~/types/event'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

useHead({
  title: computed(() => `${event.value?.title || 'Событие'} · Бармен | Operations Live`),
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

/**
 * ВАЖНО:
 * Сейчас сумма бара берется из participant.payment?.bar.
 * Если на backend будет отдельная модель bartender payments,
 * лучше будет заменить этот computed на отдельный useBartenderPayments(eventId).
 */
const payments = computed<BartenderPayment[]>(() => {
  return participants.value
    .filter((participant) => {
      return Number(participant.payment?.bar ?? 0) > 0
    })
    .map((participant, index) => ({
      id: participant.id,
      badge: participant.userBadge ?? participant.position ?? index + 1,
      nickname: participant.user.username || participant.user.email,
      amount: participant.payment?.bar ?? 0,
      comment: participant.payment?.barComment ?? '',
      createdAt: formatDateTime(participant.payment?.updatedAt ?? participant.createdAt),
    }))
})

const filteredPayments = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) return payments.value

  return payments.value.filter((payment) => {
    return (
      payment.nickname.toLowerCase().includes(query) ||
      String(payment.badge).includes(query) ||
      payment.comment?.toLowerCase().includes(query)
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
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div class="flex items-center gap-2">
            <p class="text-xs font-medium text-slate-500">Бар</p>

            <span class="size-1 rounded-full bg-slate-300" />

            <p class="text-xs text-slate-400">
              {{ eventTitle }} · {{ formatDateTime(event?.startsAt) }}
            </p>
          </div>

          <h2 class="mt-1 text-xl font-semibold tracking-tight text-slate-950">Бармен</h2>

          <p class="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
            Учет оплат по бару: Badge, Nickname, сумма, комментарий и время создания записи.
          </p>
        </div>
      </div>

      <UiCard>
        <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 class="text-sm font-semibold tracking-tight text-slate-950">Список оплат</h3>

            <p class="mt-1 text-xs text-slate-500">
              {{ payments.length }} записей по бару на событие.
            </p>
          </div>

          <div class="w-full md:w-72">
            <UiSearchInput v-model="search" placeholder="Поиск: Badge, Nickname, Comment" />
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

        <BartenderPaymentsTable v-else :payments="filteredPayments" />
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
