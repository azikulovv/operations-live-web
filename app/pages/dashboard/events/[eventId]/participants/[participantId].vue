<script setup lang="ts">
import { useEventsApi } from '~/services/event.api'
import type { EventItem, EventParticipant, UpdateEventParticipantPayload } from '~/types/event'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()
const api = useEventsApi()
const eventSocket = useEventSocket()
let realtimeSocket: ReturnType<typeof eventSocket.connect> = null
let stopParticipantsSocketWatch: (() => void) | null = null

const eventId = computed(() => String(route.params.eventId))
const participantId = computed(() => String(route.params.participantId))

const { events, isLoading: isEventsLoading, error: eventsError } = useEvents()

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

const participant = computed(() => {
  return participants.value.find((item) => item.id === participantId.value) ?? null
})

const form = reactive({
  userBadge: '',
  tournament: 0,
  bar: 0,
  games: 0,
  paid: 0,
})

const isSaving = ref(false)
const saveError = ref<string | null>(null)
const saveMessage = ref('')

const pageError = computed(() => eventsError.value || participantsError.value || saveError.value)
const isLoading = computed(() => isEventsLoading.value || isParticipantsLoading.value)

const eventTitle = computed(() => event.value?.title || eventId.value)
const participantTitle = computed(() => {
  if (!participant.value) return 'Участник'

  return participant.value.user.username || participant.value.user.email
})

function syncForm(value: EventParticipant | null) {
  if (!value) return

  form.userBadge = value.userBadge == null ? '' : String(value.userBadge)
  form.tournament = value.payment?.tournament ?? 0
  form.bar = value.payment?.bar ?? 0
  form.games = value.payment?.games ?? 0
  form.paid = value.payment?.paid ?? 0
}

function getPayloadData<T>(payload: T[] | { data?: T[] } | null | undefined) {
  if (Array.isArray(payload)) return payload

  return Array.isArray(payload?.data) ? payload.data : []
}

function handleParticipantsUpdated(
  payload: { eventId?: string; data?: EventParticipant[] } | EventParticipant[],
) {
  if (!Array.isArray(payload) && payload.eventId && payload.eventId !== participantEventId.value) {
    return
  }

  participants.value = getPayloadData(payload)
}

function handleActiveEventsUpdated(payload: { data?: EventItem[] } | EventItem[]) {
  events.value = getPayloadData(payload)
}

watch(participant, syncForm, {
  immediate: true,
})

async function saveParticipant() {
  if (!participant.value) return

  isSaving.value = true
  saveError.value = null
  saveMessage.value = ''

  const body: UpdateEventParticipantPayload = {
    userBadge: form.userBadge === '' ? null : Number(form.userBadge),
    payment: {
      tournament: Number(form.tournament) || 0,
      bar: Number(form.bar) || 0,
      games: Number(form.games) || 0,
      paid: Number(form.paid) || 0,
    },
  }

  try {
    await api.updateEventParticipant(participant.value.id, body)
    saveMessage.value = 'Изменения сохранены'
  } catch {
    saveError.value = 'Не удалось сохранить изменения.'
  } finally {
    isSaving.value = false
  }
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

useHead({
  title: computed(() => `${participantTitle.value} · ${eventTitle.value} | Operations Live`),
})
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-4">
      <UiBreadcrumb
        :items="[
          {
            label: 'События',
            to: '/dashboard/events',
          },
          {
            label: eventTitle,
            to: `/dashboard/events/${eventId}/today`,
          },
          {
            label: participantTitle,
          },
        ]"
      />

      <h2 class="mt-1 text-xl font-semibold tracking-tight text-slate-950">
        {{ participantTitle }}
      </h2>

      <p class="mt-1 text-xs text-slate-500">Badge и оплаты участника.</p>
    </div>

    <UiCard>
      <div v-if="isLoading" class="space-y-3">
        <div v-for="index in 6" :key="index" class="h-10 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div
        v-else-if="pageError"
        class="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center"
      >
        <p class="text-sm font-semibold text-red-700">{{ pageError }}</p>

        <button
          type="button"
          class="mt-3 h-9 rounded-xl bg-red-700 px-4 text-xs font-semibold text-white transition hover:bg-red-800"
          @click="fetchParticipants"
        >
          Повторить
        </button>
      </div>

      <div v-else-if="!participant">
        <p class="text-sm font-semibold text-slate-950">Участник не найден</p>
        <p class="mt-1 text-xs text-slate-500">Возможно, он был удален из события.</p>
      </div>

      <form v-else class="space-y-5" @submit.prevent="saveParticipant">
        <div class="grid gap-4 md:grid-cols-2">
          <label class="block">
            <span class="text-xs font-medium text-slate-500">Badge</span>
            <input
              v-model="form.userBadge"
              type="number"
              min="0"
              placeholder="Не задан"
              class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 transition outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </label>

          <div>
            <p class="text-xs font-medium text-slate-500">Игрок</p>
            <p class="mt-2 truncate text-sm font-semibold text-slate-950">
              {{ participant.user.username || participant.user.email }}
            </p>
            <p class="mt-1 truncate text-xs text-slate-500">{{ participant.user.email }}</p>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-4">
          <label class="block">
            <span class="text-xs font-medium text-slate-500">Турнир</span>
            <input
              v-model.number="form.tournament"
              type="number"
              min="0"
              class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </label>

          <label class="block">
            <span class="text-xs font-medium text-slate-500">Бар</span>
            <input
              v-model.number="form.bar"
              type="number"
              min="0"
              class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </label>

          <label class="block">
            <span class="text-xs font-medium text-slate-500">Игры</span>
            <input
              v-model.number="form.games"
              type="number"
              min="0"
              class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </label>

          <label class="block">
            <span class="text-xs font-medium text-slate-500">Оплачено</span>
            <input
              v-model.number="form.paid"
              type="number"
              min="0"
              class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </label>
        </div>

        <div class="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
          <button
            type="submit"
            class="h-10 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSaving"
          >
            {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
          </button>

          <NuxtLink
            :to="`/dashboard/events/${eventId}/today`"
            class="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
          >
            Назад
          </NuxtLink>

          <p v-if="saveMessage" class="text-xs font-medium text-emerald-700">
            {{ saveMessage }}
          </p>
        </div>
      </form>
    </UiCard>
  </div>
</template>
