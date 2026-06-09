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
    <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <p class="text-xs font-medium text-slate-500">Бар</p>

          <span class="size-1 rounded-full bg-slate-300" />

          <!-- <p class="text-xs text-slate-400">{{ eventTitle }} · {{ event?.startsAt }}</p> -->
        </div>

        <h2 class="mt-1 text-xl font-semibold tracking-tight text-slate-950">Бармен</h2>

        <p class="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
          Учет оплат по бару: Badge, Nickname, сумма, комментарий и время создания записи.
        </p>
      </div>
    </div>

    <UiCard>
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 class="text-sm font-semibold tracking-tight text-slate-950">Список оплат</h3>

          <p class="mt-1 text-xs text-slate-500">{{ rows.length }} записей по бару на событие.</p>
        </div>

        <!-- <div class="w-full md:w-72">
          <UiSearchInput v-model="search" placeholder="Поиск: Badge, Nickname, Comment" />
        </div> -->
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

    <!-- <UiCard v-else>
      <p class="text-sm font-semibold text-slate-950">Событие не найдено</p>

      <p class="mt-1 text-xs text-slate-500">Возможно, событие было удалено или ссылка устарела.</p>

      <NuxtLink
        to="/dashboard/events"
        class="mt-4 inline-flex h-9 items-center rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white"
      >
        Вернуться к событиям
      </NuxtLink>
    </UiCard> -->
  </div>
</template>
