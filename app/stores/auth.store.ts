import { defineStore } from 'pinia'
import type { AuthUser, SignInResponse } from '~/types/auth'

type LoginPayload = {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('access_token', {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  })

  const user = ref<AuthUser | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))
  const userRole = computed(() => user.value?.role ?? null)

  async function signIn(payload: LoginPayload) {
    isLoading.value = true

    try {
      const api = useApi()

      const response = await api<SignInResponse>('/auth/signin', {
        method: 'POST',
        body: payload,
      })

      token.value = response.accessToken
      user.value = response.user

      return response
    } finally {
      isLoading.value = false
    }
  }

  function signOut() {
    token.value = null
    user.value = null

    return navigateTo('/signin')
  }

  return {
    token,
    user,
    userRole,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
  }
})
