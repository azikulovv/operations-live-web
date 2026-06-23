export type EventFilterStatus = 'active' | 'completed' | 'upcoming'
export type OperationEventStatus = Exclude<EventFilterStatus, 'upcoming'>
export type EventStatus = OperationEventStatus | 'cancelled' | 'draft' | 'published'

export type ApiResponse<T> = {
  data: T
}

export type ApiMaybeResponse<T> = ApiResponse<T> | T

export type UpdateEventParticipantPayload = {
  arrived?: boolean
  badge?: string | null
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

export type UpdateEventPromotionPayload = Partial<{
  promotionType: EventPromotionType | string
  reason: string | null
  discountPercent: number
  used: number
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
  participantLimit: number | null
  initialDepositAmount: number
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
  name?: string | null
  badge?: number | string | null
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
  externalId?: string | null
  userId?: string
  externalUserId?: string | null
  eventId: string
  status: string
  arrived: boolean
  createdAt: string
  registeredAt?: string | null
  cancelledAt: string | null
  position: number | null
  badge?: string | null
  userBadge?: number | null
  initialDepositAmount?: number
  tableNumber: number | null
  seatNumber: number | null
  userName?: string | null
  userEmail?: string | null
  userPhone?: string | null
  userTelegramId?: string | null
  userAvatarUrl?: string | null
  user?: ParticipantUser
  closed?: boolean
  bartenderSale?: {
    id: string
    participantId: string
    amount: number
    comment: string | null
    createdAt: string
    updatedAt: string
  } | null
  debt?: {
    id: string
    participantId: string
    amount: number
    comment: string | null
    closed: boolean
    createdAt: string
    updatedAt: string
  } | null
  payment?: EventParticipantPayment | null
  promotion?: EventPromotionDetails | null
  tournament?: {
    id: string
    participantId: string
    reEntry: number
    addon: number
    knockouts: number
    bustoutOrder: number
    status: string
    createdAt: string
    updatedAt: string
  } | null
}

export interface EventParticipantPayment {
  id: string
  participantId: string
  tournament?: number
  accruedAmount?: number
  discountAmount?: number
  toPayAmount?: number
  bar?: number
  barComment?: string | null
  games?: number
  paid?: number
  paidAmount?: number
  status?: EventPaymentStatus | string
  comment?: string | null
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
  barAmount: number
  totalToPayAmount: number
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
  initialDepositAmount: number
  user: EventPaymentUser
  payment: EventPaymentDetails | null
  promotion: EventPromotionDetails | null
}
