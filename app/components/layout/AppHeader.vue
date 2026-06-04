<script setup lang="ts">
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title?: string
    sidebarCollapsed?: boolean
  }>(),
  {
    title: 'Панель управления',
    sidebarCollapsed: false,
  },
)

const emit = defineEmits<{
  openMenu: []
  toggleSidebar: []
}>()
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
    <div class="flex h-16 items-center justify-between px-5 lg:px-8">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="hidden size-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:flex"
          @click="emit('toggleSidebar')"
        >
          <PanelLeftOpen v-if="sidebarCollapsed" class="size-5" />
          <PanelLeftClose v-else class="size-5" />
        </button>

        <div>
          <p class="text-xs font-medium text-slate-500">Operations Live</p>

          <h1 class="text-lg font-semibold tracking-tight text-slate-950">
            {{ title }}
          </h1>
        </div>
      </div>

      <button
        type="button"
        class="flex size-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 lg:hidden"
        @click="emit('openMenu')"
      >
        <Menu class="size-5" />
      </button>
    </div>
  </header>
</template>
