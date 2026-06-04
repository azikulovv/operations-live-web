<script setup lang="ts">
type BreadcrumbItem = {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center gap-2">
    <template v-for="(item, index) in items" :key="`${item.label}-${index}`">
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="text-xs font-medium text-slate-500 transition hover:text-slate-950"
      >
        {{ item.label }}
      </NuxtLink>

      <span v-else class="text-xs text-slate-400">
        {{ item.label }}
      </span>

      <span v-if="index < items.length - 1" class="size-1 rounded-full bg-slate-300" />
    </template>
  </nav>
</template>
