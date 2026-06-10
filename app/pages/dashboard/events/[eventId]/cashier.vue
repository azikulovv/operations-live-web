<script setup lang="ts">
import type { CashierVisit } from '~/components/cashier/CashierVisitsTable.vue'
import CashierVisitsTable from '~/components/cashier/CashierVisitsTable.vue'
import type { PaymentRow, UpdatePaymentDto } from '~/types/operations'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()
const eventId = computed(() => String(route.params.eventId))

const { events, isLoading: isEventsLoading, error: eventsError } = useEvents()

const event = computed(() => {
  return (
    events.value.find((item) => item.id === eventId.value || item.externalId === eventId.value) ??
    null
  )
})

const paymentsEventId = computed(() => event.value?.externalId ?? eventId.value)

const {
  payments,
  isLoading: isPaymentsLoading,
  error: paymentsError,
  fetchPayments,
  updatePayment,
} = useEventPayments(paymentsEventId)

const search = ref('')

const eventTitle = computed(() => event.value?.title || eventId.value)
const isLoading = computed(() => isEventsLoading.value || isPaymentsLoading.value)
const pageError = computed(() => eventsError.value || paymentsError.value)

useHead({
  title: computed(() => `${eventTitle.value} · Касса | Operations Live`),
})

function mapPaymentStatus(status: string | undefined): CashierVisit['paymentStatus'] {
  if (status === 'PAID') return 'paid'
  if (status === 'PARTIALLY_PAID') return 'partial'

  return 'unpaid'
}

function getPlayerName(payment: PaymentRow) {
  return payment.user.name || payment.user.email || '—'
}

const visits = computed<CashierVisit[]>(() => {
  return payments.value.map((payment) => {
    const totalAmount = payment.payment?.accruedAmount ?? 0
    const paidAmount = payment.payment?.paidAmount ?? 0
    const comment = payment.payment?.comment ?? ''
    const discountPercent = payment.promotion?.discountPercent ?? 0
    const discountAmount = totalAmount * (discountPercent / 100)
    const payableAmount = Math.max(totalAmount - discountAmount, 0)

    return {
      id: payment.payment?.id ?? payment.participantId,
      participantId: payment.participantId,
      badge: payment.user.badge ?? payment.position ?? 0,
      nickname: getPlayerName(payment),
      tournament: eventTitle.value,
      totalAmount,
      discountAmount: payment.promotion?.discountPercent ?? 0,
      payableAmount: payableAmount,
      paidAmount,
      paymentStatus: mapPaymentStatus(payment.payment?.status),
      comment,
    }
  })
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

async function onChange(participantId: string, payload: UpdatePaymentDto) {
  try {
    await updatePayment(participantId, payload)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <SharedPageHeader
      class="mb-4"
      title="Оплата игроков"
      description="Проверка начислений, фиксация оплаты и контроль долга."
      :breadcrumbs="[
        {
          label: 'Касса',
        },
      ]"
    />

    <UiCard>
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 class="text-sm font-semibold tracking-tight text-slate-950">Список оплат</h3>

          <p class="mt-1 text-xs text-slate-500">
            Найдено {{ filteredVisits.length }} из {{ visits.length }} записей.
          </p>
        </div>

        <div class="w-full md:w-72">
          <UiSearchInput v-model="search" placeholder="Поиск: Badge, Nickname, турнир" />
        </div>
      </div>

      <div v-if="isLoading" class="space-y-3">
        <div v-for="index in 5" :key="index" class="h-10 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div
        v-else-if="pageError"
        class="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center"
      >
        <p class="text-sm font-semibold text-red-700">{{ pageError }}</p>

        <button
          type="button"
          class="mt-3 h-9 rounded-xl bg-red-700 px-4 text-xs font-semibold text-white transition hover:bg-red-800"
          @click="fetchPayments"
        >
          Повторить
        </button>
      </div>

      <CashierVisitsTable v-else :visits="filteredVisits" @change="onChange" />
    </UiCard>
  </div>
</template>
