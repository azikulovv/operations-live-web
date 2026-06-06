import { io, type Socket } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const socket: Socket = io(config.public.apiBaseUrl.replace('/api', ''), {
    transports: ['websocket'],
    autoConnect: false,
    withCredentials: true,
  })

  return {
    provide: {
      socket,
    },
  }
})
