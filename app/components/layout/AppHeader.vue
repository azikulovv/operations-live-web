<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

defineProps<{
  title?: string
}>()

const emit = defineEmits<{
  openMenu: []
}>()
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
    <div class="flex h-16 items-center justify-between px-5 lg:px-8">
      <div>
        <p class="text-xs font-medium text-slate-500">Operations Live</p>

        <h1 class="text-lg font-semibold tracking-tight text-slate-950">
          {{ title || 'Панель управления' }}
        </h1>
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
