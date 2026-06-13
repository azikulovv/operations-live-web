<script setup lang="ts">
const { dismiss, notifications } = useNotifications()

function getNotificationClass(type: string) {
  if (type === 'error') return 'border-red-100 bg-red-50 text-red-900'
  if (type === 'success') return 'border-emerald-100 bg-emerald-50 text-emerald-900'

  return 'border-slate-200 bg-white text-slate-900'
}

function getDotClass(type: string) {
  if (type === 'error') return 'bg-red-500'
  if (type === 'success') return 'bg-emerald-500'

  return 'bg-slate-400'
}
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed top-4 right-4 z-[10000] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3"
      role="status"
      aria-live="polite"
    >
      <TransitionGroup
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-2 opacity-0"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto rounded-xl border px-4 py-3 shadow-lg shadow-slate-950/10"
          :class="getNotificationClass(notification.type)"
        >
          <div class="flex items-start gap-3">
            <span
              class="mt-1 size-2 shrink-0 rounded-full"
              :class="getDotClass(notification.type)"
            />

            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold">{{ notification.title }}</p>
              <p v-if="notification.message" class="mt-1 text-xs leading-5 opacity-80">
                {{ notification.message }}
              </p>
            </div>

            <button
              type="button"
              class="-mr-1 flex size-6 shrink-0 items-center justify-center rounded-md text-base leading-none opacity-60 transition hover:bg-black/5 hover:opacity-100"
              aria-label="Закрыть уведомление"
              @click="dismiss(notification.id)"
            >
              x
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
