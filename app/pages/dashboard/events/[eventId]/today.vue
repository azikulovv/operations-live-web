<script setup lang="ts">
import type { HostessVisit } from '~/components/today/HostessVisitsTable.vue'
import HostessVisitsTable from '~/components/today/HostessVisitsTable.vue'
import type { EventParticipant, UpdateEventParticipantPayload } from '~/types/event'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()

const eventId = computed(() => String(route.params.eventId))
const { rows, pending, error, fetchList, updateParticipant } = useEventParticipants(eventId)

useHead({
  title: computed(() => `${eventId.value} · Сегодня | Operations Live`),
})

const search = ref('')
const arrivalPending = ref<Record<string, boolean>>({})
const arrivalErrors = ref<Record<string, string>>({})

const eventTitle = computed(() => eventId.value)

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
  if (participant.cancelledAt) return 'cancelled'

  return participant.status === 'PARTICIPANT' ? 'registered' : 'in_tournament'
}

const visits = computed<HostessVisit[]>(() => {
  return rows.value.map((participant) => ({
    id: participant.id,
    badge: participant.badge ?? '',
    nickname:
      participant.userName ||
      participant.user?.username ||
      participant.user?.name ||
      participant.userEmail ||
      participant.user?.email ||
      '—',
    email: participant.userEmail ?? participant.user?.email ?? '',
    phone: participant.userPhone ?? participant.user?.phone ?? '',
    registeredAt: formatDateTime(participant.registeredAt ?? participant.createdAt),
    tournament: eventTitle.value,
    source: 'app',
    status: getParticipantStatus(participant),
    arrived: participant.arrived,
    isArrivalUpdating: Boolean(arrivalPending.value[participant.id]),
    arrivalError: arrivalErrors.value[participant.id] ?? null,
    tableNumber: participant.tableNumber,
    seatNumber: participant.seatNumber,
    tournamentAmount: participant.payment?.accruedAmount ?? participant.payment?.tournament ?? 0,
    barAmount: participant.bartenderSale?.amount ?? participant.payment?.bar ?? 0,
    dartsAmount: participant.payment?.games ?? 0,
    totalAmount:
      (participant.payment?.accruedAmount ?? participant.payment?.tournament ?? 0) +
      (participant.bartenderSale?.amount ?? participant.payment?.bar ?? 0) +
      (participant.payment?.games ?? 0),
    paidAmount: participant.payment?.paidAmount ?? participant.payment?.paid ?? 0,
    isClosed: Boolean(participant.debt?.closed ?? participant.closed),
    debtComment:
      participant.debt?.comment ??
      (participant.tableNumber && participant.seatNumber
        ? `Стол ${participant.tableNumber}, место ${participant.seatNumber}`
        : ''),
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
  await fetchList()
}

async function onChange(participantId: string, payload: UpdateEventParticipantPayload) {
  const isArrivalUpdate = 'arrived' in payload

  try {
    if (isArrivalUpdate) {
      arrivalPending.value = {
        ...arrivalPending.value,
        [participantId]: true,
      }
      const { [participantId]: _discarded, ...restErrors } = arrivalErrors.value
      arrivalErrors.value = restErrors
    }

    await updateParticipant(participantId, payload)
  } catch (error) {
    if (isArrivalUpdate) {
      arrivalErrors.value = {
        ...arrivalErrors.value,
        [participantId]:
          error instanceof Error ? error.message : 'Не удалось сохранить отметку присутствия.',
      }
    }

    console.log(error)
  } finally {
    if (isArrivalUpdate) {
      const { [participantId]: _discarded, ...restPending } = arrivalPending.value
      arrivalPending.value = restPending
    }
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <SharedPageHeader
      class="mb-4"
      title="Хостес"
      description="Регистрации, бейджи, статусы, начисления и закрытие визита."
      :breadcrumbs="[
        {
          label: 'Сегодня',
        },
      ]"
    />

    <UiCard>
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 class="text-sm font-semibold tracking-tight text-slate-950">Список игроков</h3>

          <p class="mt-1 text-xs text-slate-500">
            {{ rows.length }} игроков зарегистрировано на событие.
          </p>
        </div>

        <div class="w-full md:w-72">
          <UiSearchInput v-model="search" placeholder="Поиск: бейдж, имя пользователя" />
        </div>
      </div>

      <div v-if="pending" class="space-y-3">
        <div v-for="index in 4" :key="index" class="h-10 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div
        v-else-if="error"
        class="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center"
      >
        <p class="text-sm font-semibold text-red-700">{{ error }}</p>

        <button
          type="button"
          class="mt-3 h-9 rounded-xl bg-red-700 px-4 text-xs font-semibold text-white transition hover:bg-red-800"
          @click="refreshPage"
        >
          Повторить
        </button>
      </div>

      <HostessVisitsTable v-else :visits="filteredVisits" @change="onChange" />
    </UiCard>
  </div>
</template>
