export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (!authStore.user) {
    void (await authStore.fetchMe())
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/signin')
  }
})
