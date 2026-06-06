<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { operationEvents } from '~/constants/events'
import { dashboardNavigation, eventNavigation } from '~/constants/navigation'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
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

function closeMenu() {
  emit('close')
}

function signOut() {
  closeMenu()
  return authStore.signOut()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        class="absolute inset-0 bg-slate-950/40"
        aria-label="Закрыть меню"
        @click="emit('close')"
      />

      <aside class="relative flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-xl">
        <div class="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white"
            >
              OL
            </div>

            <div>
              <p class="text-sm font-semibold text-slate-950">Operations Live</p>
              <p class="text-xs text-slate-500">Work panel</p>
            </div>
          </div>

          <button
            type="button"
            class="flex size-10 items-center justify-center rounded-2xl border border-slate-200"
            @click="emit('close')"
          >
            <X class="size-5" />
          </button>
        </div>

        <nav class="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4">
          <div class="space-y-1">
            <NuxtLink
              v-for="item in dashboardNavigation"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition"
              :class="
                isActive(item.to)
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              "
              @click="closeMenu"
            >
              <component :is="item.icon" class="size-4 shrink-0" />

              <span class="truncate">{{ item.label }}</span>
            </NuxtLink>
          </div>

          <div v-if="hasSelectedEvent" class="mt-5 border-t border-slate-200 pt-4">
            <div class="mb-3 px-3">
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
                class="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition"
                :class="
                  isEventPageActive(item.segment)
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                "
                @click="closeMenu"
              >
                <component :is="item.icon" class="size-4 shrink-0" />

                <span class="truncate">{{ item.label }}</span>
              </NuxtLink>
            </div>

            <NuxtLink
              to="/dashboard/events"
              class="mt-3 flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              @click="closeMenu"
            >
              Сменить событие
            </NuxtLink>
          </div>
        </nav>

        <div class="border-t border-slate-200 p-4">
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm font-medium text-slate-950">
              {{ authStore.user?.email || 'Пользователь' }}
            </p>

            <p class="mt-1 text-xs text-slate-500">
              {{ authStore.user?.role || 'Role' }}
            </p>

            <button
              type="button"
              class="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              @click="signOut"
            >
              Выйти
            </button>
          </div>
        </div>
      </aside>
    </div>
  </Teleport>
</template>
