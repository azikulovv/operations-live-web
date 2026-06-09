<script setup lang="ts">
import type { UpdateTournamentDto } from '~/types/operations'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()
const eventId = computed(() => String(route.params.eventId))
const search = ref('')

const { rows, pending, error, fetchList, updateTournament } = useTournament(eventId)

const tableRows = computed(() =>
  rows.value.map((row) => ({
    participantId: row.participantId,
    badge: row.user.badge,
    nickname: row.user.name || row.user.email,
    tableNumber: row.tableNumber,
    seatNumber: row.seatNumber,
    points: row.tournament.points,
    place: row.tournament.place,
    comment: row.tournament.comment,
    updatedAt: row.tournament.updatedAt,
  })),
)

const filteredRows = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return tableRows.value

  return tableRows.value.filter((row) =>
    [row.badge, row.nickname, row.comment].filter(Boolean).join(' ').toLowerCase().includes(query),
  )
})

async function onChange(participantId: string, payload: UpdateTournamentDto) {
  try {
    await updateTournament(participantId, payload)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <p class="text-xs font-medium text-slate-500">Турнир</p>
          <span class="size-1 rounded-full bg-slate-300" />
          <p class="text-xs text-slate-400">{{ eventId }}</p>
        </div>

        <h2 class="mt-1 text-xl font-semibold tracking-tight text-slate-950">Турнирная таблица</h2>

        <p class="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
          Очки, место, стол и комментарии участников турнира.
        </p>
      </div>
    </div>

    <UiCard>
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 class="text-sm font-semibold tracking-tight text-slate-950">Игроки</h3>
          <p class="mt-1 text-xs text-slate-500">
            Найдено {{ filteredRows.length }} из {{ tableRows.length }} записей.
          </p>
        </div>

        <div class="w-full md:w-72">
          <UiSearchInput v-model="search" placeholder="Поиск: Badge, Nickname, Comment" />
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
          @click="fetchList"
        >
          Повторить
        </button>
      </div>

      <TournamentTable v-else :players="filteredRows" @change="onChange" />
    </UiCard>
  </div>
</template>
