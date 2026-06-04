<script setup lang="ts">
import type { Promotion } from '~/components/promotions/PromotionsTable.vue'
import PromotionsTable from '~/components/promotions/PromotionsTable.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

useHead({
  title: 'Promotions | Operations Live',
})

const promotions = ref<Promotion[]>([
  {
    id: '1',
    nickname: 'Shark77',
    type: 'free_entry',
    reason: 'Сертификат',
    discountPercent: 100,
    used: false,
    comment: 'Бесплатный вход',
  },
  {
    id: '2',
    nickname: 'AceKing',
    type: 'fifth_visit',
    reason: '5-й визит',
    discountPercent: 100,
    used: true,
    comment: 'Использовано на Friday Ducks',
  },
  {
    id: '3',
    nickname: 'LadyLuck',
    type: 'ladies_day',
    reason: 'Ladies Day',
    discountPercent: 50,
    used: false,
    comment: 'Действует только сегодня',
  },
])

const search = ref('')

const filteredPromotions = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) return promotions.value

  return promotions.value.filter((promotion) => {
    return (
      promotion.nickname.toLowerCase().includes(query) ||
      promotion.reason.toLowerCase().includes(query) ||
      promotion.comment.toLowerCase().includes(query)
    )
  })
})
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <p class="text-xs font-medium text-slate-500">Акции и скидки</p>
        </div>

        <h2 class="mt-1 text-xl font-semibold tracking-tight text-slate-950">Промо игроков</h2>

        <p class="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
          Бесплатные входы, скидки, сертификаты, дилерство, 5-й визит и Ladies Day.
        </p>
      </div>

      <button
        type="button"
        class="h-9 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        Добавить промо
      </button>
    </div>

    <UiCard>
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 class="text-sm font-semibold tracking-tight text-slate-950">Список промо</h3>

          <p class="mt-1 text-xs text-slate-500">
            Промо учитываются в кассе при расчёте суммы к оплате.
          </p>
        </div>

        <div class="w-full md:w-72">
          <input
            v-model.trim="search"
            type="text"
            placeholder="Поиск: Nickname, причина, комментарий"
            class="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-950 transition outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </div>
      </div>

      <PromotionsTable :promotions="filteredPromotions" />
    </UiCard>
  </div>
</template>
