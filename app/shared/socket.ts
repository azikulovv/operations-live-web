import { io } from 'socket.io-client'

export const socket = io('http://localhost:3001', {
  withCredentials: true,
  autoConnect: true,
})

socket.on('connected', (payload) => {
  console.log(payload.message)
})
