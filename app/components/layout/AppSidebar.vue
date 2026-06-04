<script setup lang="ts">
import { dashboardNavigation } from '~/constants/navigation'

defineProps<{
  collapsed: boolean
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
  <aside
    class="sticky top-0 left-0 hidden h-screen min-h-screen shrink-0 border-r border-slate-200 bg-white transition-all duration-300 lg:flex lg:flex-col"
    :class="collapsed ? 'w-20' : 'w-72'"
  >
    <div
      class="flex h-16 items-center border-b border-slate-200 px-4"
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

    <nav class="flex-1 space-y-1 px-3 py-4">
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
          class="pointer-events-none absolute left-full z-50 ml-3 rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition group-hover:opacity-100"
        >
          {{ item.label }}
        </span>
      </NuxtLink>
    </nav>

    <div class="border-t border-slate-200 p-4">
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
