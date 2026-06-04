<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})

useHead({
  title: 'Инструкция | Operations Live',
})

type GuideItem = {
  title: string
  description: string
}

const guideItems: GuideItem[] = [
  {
    title: 'Главный принцип',
    description:
      'Персонал работает только в своих вкладках. Технические листы в конце книги нужны для контроля и будущей CRM.',
  },
  {
    title: 'Хостес',
    description:
      'Работает с «01 Сегодня - Хостес» и «02 Касса». Видит регистрацию, Badge, начисления, оплату и долг.',
  },
  {
    title: 'Админ турнира',
    description:
      'Работает с «03 Турнир - Админ», «04 Столы - Админ», «05 Финальный стол». Основной номер турнира — Badge.',
  },
  {
    title: 'Бармен',
    description: 'Работает только с «06 Бар». Вносит сумму по Badge или Nickname.',
  },
  {
    title: 'Управляющий',
    description: 'Смотрит «07 Дашборд», контролирует долги, выручку, акции и работу смены.',
  },
  {
    title: 'Badge',
    description:
      'Временный номер внутри турнира. Выдаётся на старте, не меняется при Re-Entry, сдаётся на выходе, в таблице возврат отдельно не отмечается.',
  },
  {
    title: 'Nickname',
    description:
      'Основной идентификатор игрока клуба. ФИО и лишние персональные данные не используются.',
  },
  {
    title: 'Долги',
    description:
      'Игрок может уйти с долгом только с разрешения администрации. Система хранит долг, но не блокирует игрока автоматически.',
  },
  {
    title: 'Promotions',
    description:
      'Бесплатные входы, скидки, сертификаты, дилерство, 5-й визит бесплатно и Ladies Day оформляются через Promotions.',
  },
  {
    title: 'Регистрация из приложения',
    description:
      'Данные из Mini App должны попадать в «01 Сегодня - Хостес» со статусом «Зарегистрирован».',
  },
]
</script>

<template>
  <div class="mx-auto max-w-6xl">
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
