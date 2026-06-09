<script setup lang="ts">
import type { ShiftDashboard } from '~/types/operations'

defineProps<{
  dashboard: ShiftDashboard | null
  pending?: boolean
}>()

const moneyFormat = new Intl.NumberFormat('ru-RU')

function formatMoney(value: number | undefined) {
  return moneyFormat.format(value ?? 0)
}
</script>

<template>
  <div class="mb-4 grid gap-3 md:grid-cols-4">
    <div
      v-for="item in [
        { label: 'В списке', value: dashboard?.playersInList ?? 0 },
        { label: 'В турнире', value: dashboard?.playersInTournament ?? 0 },
        { label: 'Оплачено', value: formatMoney(dashboard?.paidAmount) },
        { label: 'Текущий долг', value: formatMoney(dashboard?.currentDebt) },
      ]"
      :key="item.label"
      class="rounded-xl border border-slate-200 bg-white px-4 py-3"
    >
      <p class="text-[11px] font-medium text-slate-500">{{ item.label }}</p>

      <div v-if="pending" class="mt-2 h-6 w-20 animate-pulse rounded bg-slate-100" />

      <p v-else class="mt-1 text-lg font-semibold tracking-tight text-slate-950">
        {{ item.value }}
      </p>
    </div>
  </div>
</template>
