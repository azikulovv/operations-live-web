<script setup lang="ts">
import { dashboardNavigation } from '~/constants/navigation'

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
    class="sticky top-0 left-0 hidden h-screen min-h-screen w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col"
  >
    <div class="flex h-16 items-center border-b border-slate-200 px-6">
      <NuxtLink to="/dashboard" class="flex items-center gap-3">
        <div
          class="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white"
        >
          LIVE
        </div>

        <div>
          <p class="text-sm font-semibold text-slate-950">Operations Live</p>
          <p class="text-xs text-slate-500">Рабочая панель</p>
        </div>
      </NuxtLink>
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
          @click="authStore.signOut()"
        >
          Выйти
        </button>
      </div>
    </div>
  </aside>
</template>
