<script lang="ts" setup>
defineProps<{
  title: string
  description: string
  breadcrumbs: {
    label: string
    to?: string
  }[]
}>()
</script>

<template>
  <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div>
      <UiBreadcrumb :items="breadcrumbs" />

      <h2 class="mt-1 text-xl font-semibold tracking-tight text-slate-950">{{ title }}</h2>

      <p class="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
        {{ description }}
      </p>
    </div>
  </div>
</template>
