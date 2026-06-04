<script setup lang="ts">
import type { HostessVisit } from '~/components/today/HostessVisitsTable.vue'
import HostessVisitsTable from '~/components/today/HostessVisitsTable.vue'
import { operationEvents } from '~/constants/events'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()

const eventId = computed(() => String(route.params.eventId))

const event = computed(() => {
  return operationEvents.find((item) => item.id === eventId.value)
})

useHead({
  title: computed(() => `${event.value?.title || 'Событие'} · Сегодня | Operations Live`),
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
    <template v-if="event">
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div class="flex items-center gap-2">
            <p class="text-xs font-medium text-slate-500">Сегодня</p>

            <span class="size-1 rounded-full bg-slate-300" />

            <p class="text-xs text-slate-400">
              {{ event.title }} · {{ event.date }} · {{ event.time }}
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

            <p class="mt-1 text-xs text-slate-500">Основной идентификатор смены — Badge.</p>
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

        <HostessVisitsTable :visits="filteredVisits" />
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
