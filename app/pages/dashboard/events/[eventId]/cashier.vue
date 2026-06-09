<script setup lang="ts">
import type { CashierVisit } from '~/components/cashier/CashierVisitsTable.vue'
import CashierVisitsTable from '~/components/cashier/CashierVisitsTable.vue'
import type { PaymentRow, PaymentStatus } from '~/types/operations'

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
const { dashboard, pending: dashboardPending } = useShiftDashboard(paymentsEventId)

const {
  payments,
  isLoading: isPaymentsLoading,
  error: paymentsError,
  fetchPayments,
  updatePayment,
} = useEventPayments(paymentsEventId)

const search = ref('')
const savingPaymentId = ref<string | null>(null)
const paymentForms = reactive<
  Record<string, { comment: string; paidAmount: number; totalAmount: number }>
>({})

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

function getPaymentStatus(visit: CashierVisit): PaymentStatus {
  if (visit.payableAmount <= 0) return 'PAID'
  if (visit.paidAmount >= visit.payableAmount) return 'PAID'
  if (visit.paidAmount <= 0) return 'UNPAID'

  return 'PARTIALLY_PAID'
}

function getPlayerName(payment: PaymentRow) {
  return payment.user.name || payment.user.email || '—'
}

function getForm(payment: PaymentRow) {
  const existing = paymentForms[payment.participantId]

  if (existing) return existing

  const form = {
    totalAmount: payment.payment?.accruedAmount ?? 0,
    paidAmount: payment.payment?.paidAmount ?? 0,
    comment: payment.payment?.comment ?? '',
  }

  paymentForms[payment.participantId] = form

  return form
}

const visits = computed<CashierVisit[]>(() => {
  return payments.value.map((payment) => {
    const form = getForm(payment)
    const discountPercent = payment.promotion?.discountPercent ?? 0
    const discountAmount = form.totalAmount * (discountPercent / 100)
    const payableAmount = Math.max(form.totalAmount - discountAmount, 0)

    return {
      id: payment.payment?.id ?? payment.participantId,
      participantId: payment.participantId,
      badge: payment.user.badge ?? payment.position ?? 0,
      nickname: getPlayerName(payment),
      tournament: eventTitle.value,
      totalAmount: form.totalAmount,
      discountAmount: payment.promotion?.discountPercent ?? 0,
      payableAmount: payableAmount,
      paidAmount: form.paidAmount,
      paymentStatus: mapPaymentStatus(payment.payment?.status),
      comment: form.comment,
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

function setPaidAmount(visit: CashierVisit, value: number) {
  paymentForms[visit.participantId] = {
    ...(paymentForms[visit.participantId] ?? {
      comment: visit.comment,
      totalAmount: visit.totalAmount,
    }),
    paidAmount: Number.isFinite(value) ? value : 0,
  }
}

function setTotalAmount(visit: CashierVisit, value: number) {
  paymentForms[visit.participantId] = {
    ...(paymentForms[visit.participantId] ?? {
      comment: visit.comment,
      paidAmount: visit.paidAmount,
    }),
    totalAmount: Number.isFinite(value) ? value : 0,
  }
}

function setComment(visit: CashierVisit, value: string) {
  paymentForms[visit.participantId] = {
    ...(paymentForms[visit.participantId] ?? {
      paidAmount: visit.paidAmount,
      totalAmount: visit.totalAmount,
    }),
    comment: value,
  }
}

async function savePayment(visit: CashierVisit) {
  savingPaymentId.value = visit.participantId

  await updatePayment(visit.participantId, {
    accruedAmount: visit.totalAmount,
    toPayAmount: visit.payableAmount,
    paidAmount: visit.paidAmount,
    status: getPaymentStatus(visit),
    comment: visit.comment || null,
  })

  savingPaymentId.value = null
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <p class="text-xs font-medium text-slate-500">Касса</p>

          <span class="size-1 rounded-full bg-slate-300" />

          <p class="text-xs text-slate-400">{{ eventTitle }}</p>
        </div>

        <h2 class="mt-1 text-xl font-semibold tracking-tight text-slate-950">Оплата игроков</h2>

        <p class="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
          Проверка начислений, фиксация оплаты и контроль долга.
        </p>
      </div>
    </div>

    <ShiftDashboardSummary :dashboard="dashboard" :pending="dashboardPending" />

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

      <CashierVisitsTable
        v-else
        :visits="filteredVisits"
        :saving-id="savingPaymentId"
        @save="savePayment"
        @update-comment="setComment"
        @update-paid="setPaidAmount"
        @update-total="setTotalAmount"
      />
    </UiCard>
  </div>
</template>
