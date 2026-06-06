export type EventFilterStatus = 'active' | 'completed'
export type EventStatus = EventFilterStatus | 'published'

export type OperationEventStatus = EventFilterStatus

export type ApiResponse<T> = {
  data: T
}

export type ApiMaybeResponse<T> = ApiResponse<T> | T

export type UpdateEventParticipantPayload = {
  userBadge?: number | null
  closed?: boolean
  payment?: Partial<{
    tournament: number
    bar: number
    games: number
    paid: number
  }>
}

export type OperationEvent = {
  id: string
  title: string
  date: string
  time: string
  status: OperationEventStatus
  registrationsCount: number
  totalAmount: number
  paidAmount: number
  debtAmount: number
}

export type EventItem = {
  id: string
  externalId?: string
  imageUrl: string
  imageHash: string
  title: string
  city: string
  address: string
  features: string
  gameRules: string
  gameType: string
  startsAt: string
  endsAt: string | null
  participantLimit: number
  status: EventStatus
  createdAt: string
  updatedAt: string
  registrationCount: number
}

export interface ParticipantUser {
  id: string
  avatarUrl: string
  avatarHash: string
  email: string
  phone?: string | null
  telegramId?: string | null
  username: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface EventParticipant {
  id: string
  userId: string
  eventId: string
  status: string
  createdAt: string
  cancelledAt: string | null
  position: number | null
  userBadge?: number | null
  tableNumber: number | null
  seatNumber: number | null
  user: ParticipantUser
  closed: boolean
  payment?: EventParticipantPayment | null
}

export interface EventParticipantPayment {
  id: string
  participantId: string
  tournament: number
  bar: number
  games: number
  paid: number
  createdAt: string
  updatedAt: string
}
