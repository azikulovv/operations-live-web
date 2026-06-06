<script setup lang="ts">
import UiTabs from '~/components/ui/UiTabs.vue'
import EventsList from '~/components/events/EventsList.vue'
import UiSearchInput from '~/components/ui/UiSearchInput.vue'
import type { EventFilterStatus, EventItem } from '~/types/event'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

useHead({
  title: 'События | Operations Live',
})

const selectedStatus = ref<EventFilterStatus>('active')
const search = ref('')

const { filteredEvents, statusCounts, isLoading, error, fetchEvents } = useEvents({
  filters: {
    search,
    status: selectedStatus,
  },
})

const tabs = computed<
  Array<{
    label: string
    value: EventFilterStatus
  }>
>(() => [
  {
    label: `Активные ${statusCounts.value.active}`,
    value: 'active',
  },
  // {
  //   label: `Прошедшие ${statusCounts.value.completed}`,
  //   value: 'completed',
  // },
])

function openEvent(event: EventItem) {
  return navigateTo(`/dashboard/events/${event.externalId ?? event.id}/today`)
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <UiBreadcrumb
          :items="[
            {
              label: 'События',
              to: '/dashboard/events',
            },
            {
              label: 'Выбор рабочей смены',
            },
          ]"
        />

        <h2 class="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          Активные и прошедшие события
        </h2>

        <p class="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
          Выберите событие, чтобы открыть рабочие экраны: хостес, касса, promotions, бар и турнир.
        </p>
      </div>

      <!-- В будущем добавим сюда кнопку для создания события -->
      <!-- <button
        type="button"
        class="h-9 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        Создать событие
      </button> -->
    </div>

    <UiCard>
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <UiTabs v-model="selectedStatus" :items="tabs" />

        <div class="w-full md:w-72">
          <UiSearchInput v-model="search" placeholder="Поиск: название, город или дата" />
        </div>
      </div>

      <div v-if="isLoading" class="grid gap-3">
        <div
          v-for="index in 3"
          :key="index"
          class="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-50"
        />
      </div>

      <div
        v-else-if="error"
        class="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center"
      >
        <p class="text-sm font-semibold text-red-700">{{ error }}</p>

        <button
          type="button"
          class="mt-3 h-9 rounded-xl bg-red-700 px-4 text-xs font-semibold text-white transition hover:bg-red-800"
          @click="fetchEvents"
        >
          Повторить
        </button>
      </div>

      <EventsList v-else :events="filteredEvents" @open="openEvent" />
    </UiCard>
  </div>
</template>
