<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error.statusCode || 500)

const errorTitle = computed(() => {
  const titles: Record<number, string> = {
    400: 'Некорректный запрос',
    401: 'Требуется авторизация',
    403: 'Доступ запрещён',
    404: 'Страница не найдена',
    500: 'Ошибка сервера',
  }

  return titles[statusCode.value] || 'Что-то пошло не так'
})

const errorDescription = computed(() => {
  const descriptions: Record<number, string> = {
    400: 'Запрос был сформирован неправильно. Проверьте данные и попробуйте снова.',
    401: 'Для доступа к этой странице необходимо войти в систему.',
    403: 'У вас нет прав для просмотра этой страницы.',
    404: 'Страница была удалена, перемещена или такой ссылки не существует.',
    500: 'На сервере произошла ошибка. Попробуйте обновить страницу немного позже.',
  }

  return descriptions[statusCode.value] || 'Произошла непредвиденная ошибка.'
})

function handleGoHome() {
  clearError({
    redirect: '/dashboard/events',
  })
}

function handleGoLogin() {
  clearError({
    redirect: '/signin',
  })
}

function handleReload() {
  clearError()
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-950">
    <section class="flex min-h-screen items-center justify-center px-5 py-10">
      <div class="w-full max-w-md">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm md:p-8">
          <div
            class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white"
          >
            {{ statusCode }}
          </div>

          <div class="mt-6">
            <p class="text-xs font-medium text-slate-500">Operations Live</p>

            <h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {{ errorTitle }}
            </h1>

            <p class="mt-3 text-sm leading-6 text-slate-500">
              {{ errorDescription }}
            </p>
          </div>

          <div
            v-if="error.message"
            class="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left"
          >
            <p class="text-xs font-medium text-slate-500">Детали ошибки</p>

            <p class="mt-1 line-clamp-3 text-xs leading-5 text-slate-600">
              {{ error.message }}
            </p>
          </div>

          <div class="mt-6 grid gap-2">
            <button
              type="button"
              class="flex h-10 w-full items-center justify-center rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
              @click="handleGoHome"
            >
              Перейти в дашборд
            </button>

            <button
              v-if="statusCode === 401 || statusCode === 403"
              type="button"
              class="flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
              @click="handleGoLogin"
            >
              Войти заново
            </button>

            <button
              type="button"
              class="flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
              @click="handleReload"
            >
              Обновить страницу
            </button>
          </div>
        </div>

        <p class="mt-6 text-center text-xs text-slate-400">
          © {{ new Date().getFullYear() }} Operations Live
        </p>
      </div>
    </section>
  </main>
</template>
