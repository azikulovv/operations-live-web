export type EventFilterStatus = 'active' | 'completed'
export type EventStatus = EventFilterStatus | 'cancelled' | 'draft' | 'published'

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

export type UpdateEventPaymentPayload = Partial<{
  accruedAmount: number
  discountAmount: number
  toPayAmount: number
  paidAmount: number
  status: EventPaymentStatus
  comment: string | null
}>

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
  externalId?: string | null
  imageUrl?: string | null
  imageHash?: string | null
  title: string
  city: string
  address: string
  features?: string | null
  gameRules?: string | null
  gameType: string
  startsAt: string
  endsAt: string | null
  participantLimit: number
  seatsPerTable?: number | null
  tableCount?: number | null
  status: EventStatus
  createdAt: string
  updatedAt: string
  registrationCount?: number
  registrationsCount?: number
}

export interface ParticipantUser {
  id: string
  avatarUrl?: string | null
  avatarHash?: string | null
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

export type EventPromotionType =
  | 'CERTIFICATE'
  | 'DEALER'
  | 'DISCOUNT'
  | 'FIFTH_VISIT'
  | 'FREE_ENTRY'
  | 'LADIES_DAY'
  | 'VIP'

export type EventPromotionUser = {
  name: string
  email: string
  phone?: string | null
  telegramId?: string | null
  avatarUrl?: string | null
  badge?: number | null
}

export type EventPromotionDetails = {
  id: string
  promotionType: EventPromotionType | string
  reason: string | null
  discountPercent: number
  used: number
  comment: string | null
  updatedAt: string
}

export type EventPromotion = {
  participantId: string
  externalParticipantId: string
  externalUserId: string
  status: string
  tableNumber: number | null
  seatNumber: number | null
  position: number | null
  user: EventPromotionUser
  promotion: EventPromotionDetails | null
}

export type EventPaymentStatus = 'PAID' | 'PARTIALLY_PAID' | 'UNPAID'

export type EventPaymentUser = {
  name: string
  email: string
  phone?: string | null
  telegramId?: string | null
  avatarUrl?: string | null
  badge?: number | null
}

export type EventPaymentDetails = {
  id: string
  accruedAmount: number
  discountAmount: number
  toPayAmount: number
  paidAmount: number
  status: EventPaymentStatus | string
  comment: string | null
  updatedAt: string
}

export type EventPayment = {
  participantId: string
  externalParticipantId: string
  externalUserId: string
  participantStatus: string
  tableNumber: number | null
  seatNumber: number | null
  position: number | null
  user: EventPaymentUser
  payment: EventPaymentDetails | null
}
