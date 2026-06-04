<script setup lang="ts">
import type { HostessVisit } from '~/components/today/HostessVisitsTable.vue'
import HostessVisitsTable from '~/components/today/HostessVisitsTable.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

useHead({
  title: 'Сегодня | Operations Live',
})

const visits = ref<HostessVisit[]>([
  {
    id: '1',
    badge: 17,
    nickname: 'Shark77',
    tournament: 'Friday Ducks',
    source: 'app',
    registeredAt: '18:05',
    status: 'in_tournament',
    tournamentAmount: 0,
    barAmount: 0,
    dartsAmount: 0,
    totalAmount: 0,
    paidAmount: 0,
    isClosed: false,
    debtComment: 'Пример строки',
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
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm font-medium text-slate-500">Сегодня</p>

        <h2 class="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Рабочий экран хостес
        </h2>

        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Сюда попадают регистрации из приложения. Хостес выдаёт Badge, отмечает статус, видит
          начисления и закрытие визита.
        </p>
      </div>

      <button
        type="button"
        class="h-11 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Добавить игрока
      </button>
    </div>

    <UiCard>
      <div class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 class="text-lg font-semibold tracking-tight text-slate-950">Список игроков</h3>

          <p class="mt-1 text-sm text-slate-500">
            Основной идентификатор игрока внутри смены — Badge.
          </p>
        </div>

        <div class="w-full md:w-80">
          <input
            v-model.trim="search"
            type="text"
            placeholder="Поиск по Badge, Nickname, турниру"
            class="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 transition outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </div>
      </div>

      <HostessVisitsTable :visits="filteredVisits" />
    </UiCard>
  </div>
</template>
