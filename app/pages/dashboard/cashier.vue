<script setup lang="ts">
import type { CashierVisit } from '~/components/cashier/CashierVisitsTable.vue'
import CashierVisitsTable from '~/components/cashier/CashierVisitsTable.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

useHead({
  title: 'Касса | Operations Live',
})

const visits = ref<CashierVisit[]>([
  {
    id: '1',
    badge: 17,
    nickname: 'Shark77',
    tournament: 'Friday Ducks',
    totalAmount: 15000,
    discountAmount: 0,
    payableAmount: 15000,
    paidAmount: 0,
    paymentStatus: 'unpaid',
    comment: 'Ожидает оплату',
  },
  {
    id: '2',
    badge: 24,
    nickname: 'AceKing',
    tournament: 'Friday Ducks',
    totalAmount: 15000,
    discountAmount: 5000,
    payableAmount: 10000,
    paidAmount: 10000,
    paymentStatus: 'paid',
    comment: 'Скидка по промо',
  },
  {
    id: '3',
    badge: 31,
    nickname: 'LuckyOne',
    tournament: 'Friday Ducks',
    totalAmount: 15000,
    discountAmount: 0,
    payableAmount: 15000,
    paidAmount: 5000,
    paymentStatus: 'partial',
    comment: 'Остаток позже',
  },
])

const search = ref('')

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
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <p class="text-xs font-medium text-slate-500">Касса</p>

          <span class="size-1 rounded-full bg-slate-300" />

          <p class="text-xs text-slate-400">Закрытие визита</p>
        </div>

        <h2 class="mt-1 text-xl font-semibold tracking-tight text-slate-950">Оплата игроков</h2>

        <p class="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
          Проверка начислений, фиксация оплаты и контроль долга.
        </p>
      </div>

      <button
        type="button"
        class="h-9 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        Принять оплату
      </button>
    </div>

    <UiCard>
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 class="text-sm font-semibold tracking-tight text-slate-950">Список оплат</h3>

          <p class="mt-1 text-xs text-slate-500">Badge возвращается физически при закрытии.</p>
        </div>

        <div class="w-full md:w-72">
          <input
            v-model.trim="search"
            type="text"
            placeholder="Поиск: Badge, Nickname, турнир"
            class="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-950 transition outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </div>
      </div>

      <CashierVisitsTable :visits="filteredVisits" />
    </UiCard>
  </div>
</template>
