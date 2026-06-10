<script setup lang="ts">
import type { UpdateEventTableDto } from '~/types/operations'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()
const eventId = computed(() => String(route.params.eventId))
const search = ref('')

const { rows, pending, error, fetchList, updateTable } = useEventTables(eventId)

const filteredRows = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return rows.value

  return rows.value.filter((row) =>
    [row.tableNumber, row.status, row.comment]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(query),
  )
})

async function onChange(tableNumber: number, payload: UpdateEventTableDto) {
  try {
    await updateTable(tableNumber, payload)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <SharedPageHeader
      class="mb-4"
      title="Посадка по столам"
      description="Статусы столов, места и комментарии по текущему событию."
      :breadcrumbs="[
        {
          label: 'Столы',
        },
      ]"
    />

    <UiCard>
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 class="text-sm font-semibold tracking-tight text-slate-950">Список столов</h3>
          <p class="mt-1 text-xs text-slate-500">
            Найдено {{ filteredRows.length }} из {{ rows.length }} записей.
          </p>
        </div>

        <div class="w-full md:w-72">
          <UiSearchInput v-model="search" placeholder="Поиск: номер, статус, комментарий" />
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

      <EventTablesTable v-else :tables="filteredRows" @change="onChange" />
    </UiCard>
  </div>
</template>
