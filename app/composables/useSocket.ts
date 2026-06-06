import type { Socket } from 'socket.io-client'

export function useSocket() {
  const { $socket } = useNuxtApp()

  const socket = $socket as Socket

  function connect() {
    if (!socket.connected) {
      socket.connect()
    }
  }

  function disconnect() {
    if (socket.connected) {
      socket.disconnect()
    }
  }

  return {
    socket,
    connect,
    disconnect,
  }
}
