<script setup lang="ts">
import { guideItems } from '~/constants/guide'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

useHead({
  title: 'Инструкция | Operations Live',
})
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-6">
      <h2 class="text-2xl font-semibold tracking-tight text-slate-950">
        DUCKS Operations LIVE 1.0
      </h2>

      <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
        Рабочая версия для смены. Краткая инструкция по ролям, вкладкам и основным правилам работы
        персонала.
      </p>
    </div>

    <UiCard>
      <div
        class="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h3 class="text-lg font-semibold tracking-tight text-slate-950">Рабочие правила</h3>

          <p class="mt-1 text-sm text-slate-500">
            Основные принципы работы системы и распределение ответственности по ролям.
          </p>
        </div>

        <div
          class="w-fit rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500"
        >
          Версия 1.0
        </div>
      </div>

      <div class="divide-y divide-slate-100">
        <article
          v-for="item in guideItems"
          :key="item.title"
          class="grid gap-3 py-5 md:grid-cols-[220px_1fr] md:gap-8"
        >
          <h4 class="text-sm font-semibold text-sky-900">
            {{ item.title }}
          </h4>

          <p class="text-sm leading-6 text-slate-700 md:text-base md:leading-7">
            {{ item.description }}
          </p>
        </article>
      </div>
    </UiCard>
  </div>
</template>
