export type EventFilterStatus = 'active' | 'completed'
export type EventStatus = EventFilterStatus | 'published'

export type OperationEventStatus = EventFilterStatus

export type ApiResponse<T> = {
  data: T
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
  reminderSent1h: boolean
  reminderSent10m: boolean
  participantLimit: number
  seatsPerTable: number
  pointsForParticipation: number
  status: EventStatus
  createdAt: string
  updatedAt: string
  _count: {
    registrations: number
  }
}
