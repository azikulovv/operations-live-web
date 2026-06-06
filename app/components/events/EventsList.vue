<script setup lang="ts">
import type { EventItem } from '~/types/event'
import EventCard from './EventCard.vue'

defineProps<{
  events: EventItem[]
}>()

const emit = defineEmits<{
  open: [event: EventItem]
}>()
</script>

<template>
  <div class="grid gap-3">
    <EventCard
      v-for="event in events"
      :key="event.id"
      :event="event"
      @open="emit('open', $event)"
    />

    <div
      v-if="events.length === 0"
      class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center"
    >
      <p class="text-sm font-medium text-slate-700">События не найдены</p>
      <p class="mt-1 text-xs text-slate-500">Попробуйте изменить фильтр или поиск.</p>
    </div>
  </div>
</template>
