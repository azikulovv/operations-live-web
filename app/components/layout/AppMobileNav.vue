<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { dashboardNavigation } from '~/constants/navigation'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const authStore = useAuthStore()

function isActive(path: string) {
  if (path === '/dashboard') {
    return route.path === path
  }

  return route.path.startsWith(path)
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

        <nav class="flex-1 space-y-1 px-3 py-4">
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
            @click="emit('close')"
          >
            <component :is="item.icon" class="size-4" />

            <span>{{ item.label }}</span>
          </NuxtLink>
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
              @click="authStore.signOut"
            >
              Выйти
            </button>
          </div>
        </div>
      </aside>
    </div>
  </Teleport>
</template>
