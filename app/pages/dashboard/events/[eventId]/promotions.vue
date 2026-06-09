<script setup lang="ts">
import type { PromotionTableRow } from '~/components/promotions/PromotionsTable.vue'
import PromotionsTable from '~/components/promotions/PromotionsTable.vue'
import type { PromotionRow } from '~/types/operations'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

const route = useRoute()
const eventId = computed(() => String(route.params.eventId))

const { events, isLoading: isEventsLoading, error: eventsError } = useEvents()

const event = computed(() => {
  return (
    events.value.find((item) => item.id === eventId.value || item.externalId === eventId.value) ??
    null
  )
})

const promotionsEventId = computed(() => event.value?.externalId ?? eventId.value)

const {
  promotions,
  isLoading: isPromotionsLoading,
  error: promotionsError,
  fetchPromotions,
  updatePromotion,
} = useEventPromotions(promotionsEventId)

const search = ref('')
const savingPromotionId = ref<string | null>(null)
const promotionForms = reactive<
  Record<
    string,
    {
      promotionType: string
      reason: string
      discountPercent: number
      used: number
      comment: string
    }
  >
>({})

const eventTitle = computed(() => event.value?.title || eventId.value)
const isLoading = computed(() => isEventsLoading.value || isPromotionsLoading.value)
const pageError = computed(() => eventsError.value || promotionsError.value)

useHead({
  title: computed(() => `${eventTitle.value} · Promotions | Operations Live`),
})

function getSearchText(promotion: PromotionRow) {
  return [
    promotion.user.name,
    promotion.user.email,
    promotion.user.phone,
    promotion.user.telegramId,
    promotion.user.badge,
    promotion.promotion?.promotionType,
    promotion.promotion?.reason,
    promotion.promotion?.comment,
  ]
    .filter((value) => value != null)
    .join(' ')
    .toLowerCase()
}

function getPlayerName(promotion: PromotionRow) {
  return promotion.user.name || promotion.user.email || '—'
}

function getForm(promotion: PromotionRow) {
  const existing = promotionForms[promotion.participantId]

  if (existing) return existing

  const form = {
    promotionType: promotion.promotion?.promotionType ?? 'DISCOUNT',
    reason: promotion.promotion?.reason ?? '',
    discountPercent: promotion.promotion?.discountPercent ?? 0,
    used: promotion.promotion?.used ?? 0,
    comment: promotion.promotion?.comment ?? '',
  }

  promotionForms[promotion.participantId] = form

  return form
}

const promotionRows = computed<PromotionTableRow[]>(() => {
  return promotions.value.map((promotion) => {
    const form = getForm(promotion)

    return {
      participantId: promotion.participantId,
      nickname: getPlayerName(promotion),
      promotionType: form.promotionType,
      reason: form.reason,
      discountPercent: form.discountPercent,
      used: form.used,
      comment: form.comment,
    }
  })
})

const filteredPromotions = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) return promotionRows.value

  return promotionRows.value.filter((row) => {
    const original = promotions.value.find(
      (promotion) => promotion.participantId === row.participantId,
    )

    if (!original) return false

    return getSearchText(original).includes(query)
  })
})

function getFormFallback(promotion: PromotionTableRow) {
  return {
    promotionType: promotion.promotionType,
    reason: promotion.reason,
    discountPercent: promotion.discountPercent,
    used: promotion.used,
    comment: promotion.comment,
  }
}

function setPromotionType(promotion: PromotionTableRow, value: string) {
  promotionForms[promotion.participantId] = {
    ...(promotionForms[promotion.participantId] ?? getFormFallback(promotion)),
    promotionType: value,
  }
}

function setReason(promotion: PromotionTableRow, value: string) {
  promotionForms[promotion.participantId] = {
    ...(promotionForms[promotion.participantId] ?? getFormFallback(promotion)),
    reason: value,
  }
}

function setDiscountPercent(promotion: PromotionTableRow, value: number) {
  promotionForms[promotion.participantId] = {
    ...(promotionForms[promotion.participantId] ?? getFormFallback(promotion)),
    discountPercent: Number.isFinite(value) ? value : 0,
  }
}

function setUsed(promotion: PromotionTableRow, value: number) {
  promotionForms[promotion.participantId] = {
    ...(promotionForms[promotion.participantId] ?? getFormFallback(promotion)),
    used: value,
  }
}

function setComment(promotion: PromotionTableRow, value: string) {
  promotionForms[promotion.participantId] = {
    ...(promotionForms[promotion.participantId] ?? getFormFallback(promotion)),
    comment: value,
  }
}

async function savePromotion(promotion: PromotionTableRow) {
  savingPromotionId.value = promotion.participantId

  await updatePromotion(promotion.participantId, {
    promotionType: promotion.promotionType,
    reason: promotion.reason || null,
    discountPercent: promotion.discountPercent,
    used: promotion.used,
    comment: promotion.comment || null,
  })

  savingPromotionId.value = null
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <p class="text-xs font-medium text-slate-500">Акции и скидки</p>

          <span class="size-1 rounded-full bg-slate-300" />

          <p class="text-xs text-slate-400">{{ eventTitle }}</p>
        </div>

        <h2 class="mt-1 text-xl font-semibold tracking-tight text-slate-950">Промо игроков</h2>

        <p class="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
          Бесплатные входы, скидки, сертификаты, дилерство, 5-й визит и Ladies Day.
        </p>
      </div>
    </div>

    <UiCard>
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 class="text-sm font-semibold tracking-tight text-slate-950">Список промо</h3>

          <p class="mt-1 text-xs text-slate-500">
            Найдено {{ filteredPromotions.length }} из {{ promotionRows.length }} записей.
          </p>
        </div>

        <div class="w-full md:w-72">
          <UiSearchInput v-model="search" placeholder="Поиск: игрок, email, промо" />
        </div>
      </div>

      <div v-if="isLoading" class="space-y-3">
        <div v-for="index in 5" :key="index" class="h-10 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div
        v-else-if="pageError"
        class="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center"
      >
        <p class="text-sm font-semibold text-red-700">{{ pageError }}</p>

        <button
          type="button"
          class="mt-3 h-9 rounded-xl bg-red-700 px-4 text-xs font-semibold text-white transition hover:bg-red-800"
          @click="fetchPromotions"
        >
          Повторить
        </button>
      </div>

      <PromotionsTable
        v-else
        :promotions="filteredPromotions"
        :saving-id="savingPromotionId"
        @save="savePromotion"
        @update-comment="setComment"
        @update-discount="setDiscountPercent"
        @update-reason="setReason"
        @update-type="setPromotionType"
        @update-used="setUsed"
      />
    </UiCard>
  </div>
</template>
