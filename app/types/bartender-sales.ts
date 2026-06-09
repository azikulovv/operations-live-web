export type UserInfo = {
  name: string | null
  email: string | null
  phone: string | null
  telegramId: string | null
  avatarUrl: string | null
  badge: string | null
}

export type BartenderSaleRow = {
  participantId: string
  externalParticipantId: string
  externalUserId: string
  status: string
  tableNumber: number | null
  seatNumber: number | null
  position: number | null
  user: UserInfo
  bartenderSale: {
    id: string
    amount: number
    comment: string | null
    createdAt: string
    updatedAt: string | null
  }
}

export type BartenderSalesListUpdatedPayload = {
  eventId: string
  data: BartenderSaleRow[]
}

export type UpdateBartenderSaleDto = {
  amount?: number
  comment?: string | null
}
