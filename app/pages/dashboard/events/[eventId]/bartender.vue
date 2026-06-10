<script setup lang="ts">
import type { UpdateBartenderSaleDto } from '~/types/bartender-sales'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()
const eventId = String(route.params.eventId)

const { rows, pending, error, updateSale, fetchList } = useBartenderSales(eventId)

async function onChange(participantId: string, payload: UpdateBartenderSaleDto) {
  try {
    await updateSale(participantId, payload)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <SharedPageHeader
      class="mb-4"
      title="Бармен"
      description="Учет оплат по бару: бейдж, имя пользователя, сумма, комментарий и время обновления."
      :breadcrumbs="[
        {
          label: 'Бар',
        },
      ]"
    />

    <UiCard>
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 class="text-sm font-semibold tracking-tight text-slate-950">Список оплат</h3>

          <p class="mt-1 text-xs text-slate-500">{{ rows.length }} записей по бару на событие.</p>
        </div>
      </div>

      <div v-if="pending" class="space-y-3">
        <div v-for="index in 4" :key="index" class="h-10 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div
        v-else-if="error"
        class="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center"
      >
        <p class="text-sm font-semibold text-red-700">{{ error }}</p>

        <button
          type="button"
          class="mt-3 h-9 rounded-xl bg-red-700 px-4 text-xs font-semibold text-white transition hover:bg-red-800"
          @click="fetchList"
        >
          Повторить
        </button>
      </div>

      <BartenderPaymentsTable
        v-else
        :payments="
          rows.map((row) => ({
            participantId: row.participantId,
            badge: row.user.badge,
            nickname: row.user.name,
            amount: row.bartenderSale.amount,
            comment: row.bartenderSale.comment,
            updatedAt: row.bartenderSale.updatedAt,
          }))
        "
        @change="onChange"
      />
    </UiCard>
  </div>
</template>
