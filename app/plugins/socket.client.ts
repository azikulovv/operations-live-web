import { io } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const socket = io(config.public.apiBaseUrl.replace('/api', ''), {
    transports: ['websocket'],
    withCredentials: true,
  })

  return {
    provide: {
      socket,
    },
  }
})
