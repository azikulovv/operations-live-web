<script setup lang="ts">
import SignInForm from '~/components/auth/SignInForm.vue'

definePageMeta({
  middleware: 'guest',
})

useHead({
  title: 'Вход | Operations Live',
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-950">
    <section class="flex min-h-screen items-center justify-center px-5 py-10">
      <div class="w-full max-w-md">
        <UiCard>
          <div>
            <p class="text-sm font-medium text-slate-500">Добро пожаловать</p>

            <h2 class="mt-2 text-2xl font-semibold tracking-tight">Вход в аккаунт</h2>
          </div>

          <SignInForm />
        </UiCard>

        <p class="mt-6 text-center text-xs text-slate-400">
          © {{ new Date().getFullYear() }} Operations Live
        </p>
      </div>
    </section>
  </main>
</template>
