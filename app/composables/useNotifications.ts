export type NotificationType = 'error' | 'info' | 'success'

export type AppNotification = {
  id: string
  type: NotificationType
  title: string
  message?: string
}

type NotifyOptions = {
  message?: string
  timeout?: number
  title: string
  type?: NotificationType
}

const notificationTimers = new Map<string, ReturnType<typeof setTimeout>>()

export function useNotifications() {
  const notifications = useState<AppNotification[]>('app-notifications', () => [])

  function dismiss(id: string) {
    const timer = notificationTimers.get(id)

    if (timer) {
      clearTimeout(timer)
      notificationTimers.delete(id)
    }

    notifications.value = notifications.value.filter((notification) => notification.id !== id)
  }

  function notify({ message, timeout = 5000, title, type = 'info' }: NotifyOptions) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`

    notifications.value = [
      ...notifications.value,
      {
        id,
        message,
        title,
        type,
      },
    ]

    if (import.meta.client && timeout > 0) {
      notificationTimers.set(
        id,
        setTimeout(() => dismiss(id), timeout),
      )
    }

    return id
  }

  function notifyError(title: string, message?: string) {
    return notify({
      message,
      title,
      type: 'error',
    })
  }

  return {
    dismiss,
    notifications,
    notify,
    notifyError,
  }
}
