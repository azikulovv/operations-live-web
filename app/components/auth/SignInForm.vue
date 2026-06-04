<script setup lang="ts">
import { signInSchema, type SignInSchema } from '~/schemas/auth.schema'

const authStore = useAuthStore()

const form = reactive<SignInSchema>({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
  general: '',
})

const isPasswordVisible = ref(false)
const isSubmitting = computed(() => authStore.isLoading)

function resetErrors() {
  errors.email = ''
  errors.password = ''
  errors.general = ''
}

async function handleSubmit() {
  resetErrors()

  const validation = validateSchema(signInSchema, form)

  if (!validation.success) {
    errors.email = validation.errors.email ?? ''
    errors.password = validation.errors.password ?? ''

    return
  }

  try {
    await authStore.signIn(validation.data)
    await navigateTo('/dashboard/guide')
  } catch (error) {
    console.error(error)

    errors.general = 'Неверный email или пароль'
  }
}
</script>

<template>
  <form class="mt-7 space-y-5" @submit.prevent="handleSubmit">
    <UiInput
      id="email"
      v-model.trim="form.email"
      label="Email"
      type="email"
      autocomplete="email"
      placeholder="manager@duck.local"
      :error="errors.email"
    />

    <div>
      <div class="mb-2 flex items-center justify-between">
        <label for="password" class="block text-sm font-medium text-slate-700"> Пароль </label>

        <button
          type="button"
          class="text-xs font-medium text-slate-500 transition hover:text-slate-950"
          @click="isPasswordVisible = !isPasswordVisible"
        >
          {{ isPasswordVisible ? 'Скрыть' : 'Показать' }}
        </button>
      </div>

      <UiInput
        id="password"
        v-model="form.password"
        :type="isPasswordVisible ? 'text' : 'password'"
        autocomplete="current-password"
        placeholder="Введите пароль"
        :error="errors.password"
      />
    </div>

    <div
      v-if="errors.general"
      class="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {{ errors.general }}
    </div>

    <UiButton type="submit" :loading="isSubmitting"> Войти </UiButton>
  </form>
</template>
