<script setup lang="ts">
import { dashboardNavigation, eventNavigation } from '~/constants/navigation'
import { operationEvents } from '~/constants/events'

defineProps<{
  collapsed: boolean
}>()

const route = useRoute()
const authStore = useAuthStore()

const currentEventId = computed(() => {
  const value = route.params.eventId

  if (!value) return null

  return String(value)
})

const currentEvent = computed(() => {
  if (!currentEventId.value) return null

  return operationEvents.find((event) => event.id === currentEventId.value) ?? null
})

const hasSelectedEvent = computed(() => Boolean(currentEventId.value))

function isActive(path: string) {
  if (path === '/dashboard') {
    return route.path === path
  }

  return route.path.startsWith(path)
}

function getEventPagePath(segment: string) {
  if (!currentEventId.value) {
    return '/dashboard/events'
  }

  return `/dashboard/events/${currentEventId.value}/${segment}`
}

function isEventPageActive(segment: string) {
  if (!currentEventId.value) return false

  return route.path === `/dashboard/events/${currentEventId.value}/${segment}`
}
</script>

<template>
  <aside
    class="sticky top-0 left-0 z-40 hidden h-screen min-h-0 shrink-0 overflow-visible border-r border-slate-200 bg-white transition-all duration-300 lg:flex lg:flex-col"
    :class="collapsed ? 'w-20' : 'w-72'"
  >
    <div
      class="flex h-16 shrink-0 items-center border-b border-slate-200 px-4"
      :class="collapsed ? 'justify-center' : 'justify-between'"
    >
      <NuxtLink to="/dashboard" class="flex min-w-0 items-center gap-3">
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-xs font-bold text-white"
        >
          LIVE
        </div>

        <div v-if="!collapsed" class="min-w-0">
          <p class="truncate text-sm font-semibold text-slate-950">Operations Live</p>
          <p class="truncate text-xs text-slate-500">Рабочая панель</p>
        </div>
      </NuxtLink>
    </div>

    <nav
      class="min-h-0 flex-1 px-3 py-4"
      :class="collapsed ? 'overflow-visible' : 'overflow-x-hidden overflow-y-auto'"
    >
      <div class="space-y-1">
        <NuxtLink
          v-for="item in dashboardNavigation"
          :key="item.to"
          :to="item.to"
          class="group relative flex items-center rounded-2xl px-3 py-2.5 text-sm font-medium transition"
          :class="[
            collapsed ? 'justify-center' : 'gap-3',
            isActive(item.to)
              ? 'bg-slate-950 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
          ]"
        >
          <component :is="item.icon" class="size-4 shrink-0" />

          <span v-if="!collapsed" class="truncate">
            {{ item.label }}
          </span>

          <span
            v-if="collapsed"
            class="pointer-events-none absolute top-1/2 left-full z-9999 ml-3 -translate-y-1/2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition group-hover:opacity-100"
          >
            {{ item.label }}
          </span>
        </NuxtLink>
      </div>

      <div v-if="hasSelectedEvent" class="mt-5 border-t border-slate-200 pt-4">
        <div v-if="!collapsed" class="mb-3 px-3">
          <p class="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
            Текущее событие
          </p>

          <p class="mt-1 truncate text-xs font-semibold text-slate-800">
            {{ currentEvent?.title || currentEventId }}
          </p>
        </div>

        <div class="space-y-1">
          <NuxtLink
            v-for="item in eventNavigation"
            :key="item.segment"
            :to="getEventPagePath(item.segment)"
            class="group relative flex items-center rounded-2xl px-3 py-2.5 text-sm font-medium transition"
            :class="[
              collapsed ? 'justify-center' : 'gap-3',
              isEventPageActive(item.segment)
                ? 'bg-slate-950 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
            ]"
          >
            <component :is="item.icon" class="size-4 shrink-0" />

            <span v-if="!collapsed" class="truncate">
              {{ item.label }}
            </span>

            <span
              v-if="collapsed"
              class="pointer-events-none absolute top-1/2 left-full z-9999 ml-3 -translate-y-1/2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition group-hover:opacity-100"
            >
              {{ item.label }}
            </span>
          </NuxtLink>
        </div>

        <NuxtLink
          v-if="!collapsed"
          to="/dashboard/events"
          class="mt-3 flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
        >
          Сменить событие
        </NuxtLink>
      </div>
    </nav>

    <div class="shrink-0 border-t border-slate-200 p-4">
      <div class="rounded-2xl bg-slate-50" :class="collapsed ? 'flex justify-center p-2' : 'p-4'">
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
        >
          {{ authStore.user?.email?.[0]?.toUpperCase() || 'U' }}
        </div>

        <div v-if="!collapsed" class="mt-3">
          <p class="truncate text-sm font-medium text-slate-950">
            {{ authStore.user?.email || 'Пользователь' }}
          </p>

          <p class="mt-1 truncate text-xs text-slate-500">
            {{ authStore.user?.role || 'Role' }}
          </p>

          <button
            type="button"
            class="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            @click="authStore.signOut()"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
