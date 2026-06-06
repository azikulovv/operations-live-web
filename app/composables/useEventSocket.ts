import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

function getSocketUrl(apiBaseUrl: string | undefined) {
  if (!apiBaseUrl) return undefined

  return apiBaseUrl.replace(/\/api\/?$/, '')
}

export const useEventSocket = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('access_token')

  function connect() {
    if (!import.meta.client) return null

    if (!socket) {
      socket = io(getSocketUrl(config.public.apiBaseUrl), {
        autoConnect: false,
        transports: ['websocket', 'polling'],
        withCredentials: true,
      })
    }

    socket.auth = {
      token: token.value,
    }

    if (!socket.connected) {
      socket.connect()
    }

    return socket
  }

  return {
    connect,
  }
}
