export type OperationUserInfo = {
  name: string | null
  email: string | null
  phone: string | null
  telegramId: string | null
  avatarUrl: string | null
  badge: string | number | null
}

export type OperationParticipantRow = {
  participantId: string
  externalParticipantId: string
  externalUserId: string
  status?: string
  participantStatus?: string
  tableNumber: number | null
  seatNumber: number | null
  position: number | null
  initialDepositAmount: number
  user: OperationUserInfo
}

export type ModuleListUpdatedPayload<T> = {
  eventId: string
  data: T[]
}

export type NullableModuleRecord = {
  id: string | null
  updatedAt: string | null
  [key: string]: boolean | number | string | null
}

export type PaymentStatus = 'PAID' | 'PARTIALLY_PAID' | 'UNPAID'

export type PaymentRow = OperationParticipantRow & {
  payment:
    | (NullableModuleRecord & {
        accruedAmount: number
        discountAmount: number
        toPayAmount: number
        barAmount: number
        totalToPayAmount: number
        paidAmount: number
        status: PaymentStatus | string
        comment: string | null
      })
    | null
  promotion:
    | (NullableModuleRecord & {
        promotionType: string | null
        discountPercent: number
      })
    | null
}

export type UpdatePaymentDto = Partial<{
  accruedAmount: number
  discountAmount: number
  toPayAmount: number
  paidAmount: number
  status: PaymentStatus
  comment: string | null
}>

export type PromotionRow = OperationParticipantRow & {
  promotion:
    | (NullableModuleRecord & {
        promotionType: string
        reason: string | null
        discountPercent: number
        used: number
        comment: string | null
      })
    | null
}

export type UpdatePromotionDto = Partial<{
  promotionType: string
  reason: string | null
  discountPercent: number
  used: number
  comment: string | null
}>

export type BartenderSaleRow = OperationParticipantRow & {
  bartenderSale: NullableModuleRecord & {
    amount: number
    comment: string | null
  }
}

export type UpdateBartenderSaleDto = Partial<{
  amount: number
  comment: string | null
}>

export type DebtRow = OperationParticipantRow & {
  debt: NullableModuleRecord & {
    amount: number
    comment: string | null
    closed: boolean
  }
}

export type UpdateDebtDto = Partial<{
  amount: number
  comment: string | null
  closed: boolean
}>

export type TournamentRow = OperationParticipantRow & {
  tournament: NullableModuleRecord & {
    reEntry: number
    addon: number
    knockouts: number
    bustoutOrder: number
    status: string
  }
}

export type UpdateTournamentDto = Partial<{
  reEntry: number
  addon: number
  knockouts: number
  bustoutOrder: number
  status: string
}>

export type FinalTableRow = {
  id: string
  participantId: string
  externalParticipantId: string
  externalUserId: string
  seat: number | null
  email: string
  badge: string | number | null
  nickname: string | null
  stack: number
  updatedAt: string | null
}

export type UpdateFinalTableDto = Partial<{
  seat: number | null
  stack: number
}>

export type TableSeat = {
  participantId: string | null
  seatNumber: number
  user?: OperationUserInfo | null
}

export type EventTableRow = {
  tableNumber: number
  playersCount?: number | null
  status?: string | null
  comment?: string | null
  seats?: TableSeat[]
  updatedAt?: string | null
  [key: string]: unknown
}

export type UpdateEventTableDto = Partial<{
  tableNumber: number
  playersCount: number
  status: string | null
  comment: string | null
}>

export type ShiftDashboard = {
  playersInList: number
  playersInTournament: number
  accruals: {
    tournament: number
    bar: number
    dartsBilliards: number
    total: number
  }
  paidAmount: number
  currentDebt: number
  playersWithDebt: number
}
