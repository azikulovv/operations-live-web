import type { EventItem, EventParticipant, EventPayment, EventPromotion } from '~/types/event'

const mockEventId = 'mock-friday-ducks-2026-06-12'

export const mockEvents: EventItem[] = [
  {
    id: mockEventId,
    externalId: mockEventId,
    imageUrl: null,
    imageHash: null,
    title: 'Friday Ducks',
    city: 'Almaty',
    address: 'Ducks Game Club',
    features: 'Mock event for offline operations screens',
    gameRules: null,
    gameType: 'Poker',
    startsAt: '2026-06-12T18:00:00.000Z',
    endsAt: null,
    participantLimit: 48,
    seatsPerTable: 8,
    tableCount: 6,
    status: 'published',
    createdAt: '2026-06-01T10:00:00.000Z',
    updatedAt: '2026-06-09T10:00:00.000Z',
    registrationCount: 3,
    registrationsCount: 3,
  },
]

export const mockEventParticipants: EventParticipant[] = [
  {
    id: 'mock-participant-1',
    userId: 'mock-user-1',
    eventId: mockEventId,
    status: 'PARTICIPANT',
    createdAt: '2026-06-09T14:10:00.000Z',
    cancelledAt: null,
    position: 1,
    userBadge: 101,
    tableNumber: 1,
    seatNumber: 3,
    closed: false,
    user: {
      id: 'mock-user-1',
      email: 'alex@example.com',
      phone: '+77010000001',
      telegramId: '@alex_duck',
      username: 'AlexDuck',
      role: 'player',
      createdAt: '2026-05-01T10:00:00.000Z',
      updatedAt: '2026-06-09T10:00:00.000Z',
    },
    payment: {
      id: 'mock-participant-payment-1',
      participantId: 'mock-participant-1',
      tournament: 15000,
      bar: 4500,
      games: 2000,
      paid: 15000,
      barComment: 'Лимонад и сэндвич',
      createdAt: '2026-06-09T14:10:00.000Z',
      updatedAt: '2026-06-09T15:20:00.000Z',
    },
  },
  {
    id: 'mock-participant-2',
    userId: 'mock-user-2',
    eventId: mockEventId,
    status: 'IN_TOURNAMENT',
    createdAt: '2026-06-09T14:25:00.000Z',
    cancelledAt: null,
    position: 2,
    userBadge: 102,
    tableNumber: 2,
    seatNumber: 5,
    closed: false,
    user: {
      id: 'mock-user-2',
      email: 'mira@example.com',
      phone: '+77010000002',
      telegramId: '@mira_cards',
      username: 'MiraCards',
      role: 'player',
      createdAt: '2026-05-02T10:00:00.000Z',
      updatedAt: '2026-06-09T10:00:00.000Z',
    },
    payment: {
      id: 'mock-participant-payment-2',
      participantId: 'mock-participant-2',
      tournament: 15000,
      bar: 0,
      games: 1000,
      paid: 8000,
      createdAt: '2026-06-09T14:25:00.000Z',
      updatedAt: '2026-06-09T15:30:00.000Z',
    },
  },
  {
    id: 'mock-participant-3',
    userId: 'mock-user-3',
    eventId: mockEventId,
    status: 'PARTICIPANT',
    createdAt: '2026-06-09T14:40:00.000Z',
    cancelledAt: null,
    position: 3,
    userBadge: 103,
    tableNumber: null,
    seatNumber: null,
    closed: true,
    user: {
      id: 'mock-user-3',
      email: 'timur@example.com',
      phone: '+77010000003',
      telegramId: null,
      username: 'TimurKZ',
      role: 'player',
      createdAt: '2026-05-03T10:00:00.000Z',
      updatedAt: '2026-06-09T10:00:00.000Z',
    },
    payment: {
      id: 'mock-participant-payment-3',
      participantId: 'mock-participant-3',
      tournament: 15000,
      bar: 2500,
      games: 0,
      paid: 17500,
      barComment: 'Кофе',
      createdAt: '2026-06-09T14:40:00.000Z',
      updatedAt: '2026-06-09T16:05:00.000Z',
    },
  },
]

export const mockEventPayments: EventPayment[] = [
  {
    participantId: 'mock-participant-1',
    externalParticipantId: 'mock-participant-1',
    externalUserId: 'mock-user-1',
    participantStatus: 'PARTICIPANT',
    tableNumber: 1,
    seatNumber: 3,
    position: 1,
    user: {
      name: 'AlexDuck',
      email: 'alex@example.com',
      phone: '+77010000001',
      telegramId: '@alex_duck',
      avatarUrl: null,
      badge: 101,
    },
    payment: {
      id: 'mock-payment-1',
      accruedAmount: 21500,
      discountAmount: 0,
      toPayAmount: 21500,
      paidAmount: 15000,
      status: 'PARTIALLY_PAID',
      comment: 'Долг за бар',
      updatedAt: '2026-06-09T15:20:00.000Z',
    },
    promotion: null,
  },
  {
    participantId: 'mock-participant-2',
    externalParticipantId: 'mock-participant-2',
    externalUserId: 'mock-user-2',
    participantStatus: 'IN_TOURNAMENT',
    tableNumber: 2,
    seatNumber: 5,
    position: 2,
    user: {
      name: 'MiraCards',
      email: 'mira@example.com',
      phone: '+77010000002',
      telegramId: '@mira_cards',
      avatarUrl: null,
      badge: 102,
    },
    payment: {
      id: 'mock-payment-2',
      accruedAmount: 16000,
      discountAmount: 1600,
      toPayAmount: 14400,
      paidAmount: 8000,
      status: 'PARTIALLY_PAID',
      comment: '',
      updatedAt: '2026-06-09T15:30:00.000Z',
    },
    promotion: {
      id: 'mock-promotion-2',
      promotionType: 'DISCOUNT',
      reason: 'Early registration',
      discountPercent: 10,
      used: 1,
      comment: '',
      updatedAt: '2026-06-09T15:30:00.000Z',
    },
  },
]

export const mockEventPromotions: EventPromotion[] = [
  {
    participantId: 'mock-participant-1',
    externalParticipantId: 'mock-participant-1',
    externalUserId: 'mock-user-1',
    status: 'PARTICIPANT',
    tableNumber: 1,
    seatNumber: 3,
    position: 1,
    user: {
      name: 'AlexDuck',
      email: 'alex@example.com',
      phone: '+77010000001',
      telegramId: '@alex_duck',
      avatarUrl: null,
      badge: 101,
    },
    promotion: null,
  },
  {
    participantId: 'mock-participant-2',
    externalParticipantId: 'mock-participant-2',
    externalUserId: 'mock-user-2',
    status: 'IN_TOURNAMENT',
    tableNumber: 2,
    seatNumber: 5,
    position: 2,
    user: {
      name: 'MiraCards',
      email: 'mira@example.com',
      phone: '+77010000002',
      telegramId: '@mira_cards',
      avatarUrl: null,
      badge: 102,
    },
    promotion: {
      id: 'mock-promotion-2',
      promotionType: 'DISCOUNT',
      reason: 'Early registration',
      discountPercent: 10,
      used: 1,
      comment: '',
      updatedAt: '2026-06-09T15:30:00.000Z',
    },
  },
]

function cloneMock<T>(value: T): T {
  return structuredClone(value)
}

// TODO: replace mock with real API
export function getMockEvents() {
  return cloneMock(mockEvents)
}

// TODO: replace mock with real API
export function getMockEventParticipants(eventId: string) {
  return cloneMock(mockEventParticipants).map((participant) => ({
    ...participant,
    eventId,
  }))
}

// TODO: replace mock with real API
export function getMockEventPayments() {
  return cloneMock(mockEventPayments)
}

// TODO: replace mock with real API
export function getMockEventPromotions() {
  return cloneMock(mockEventPromotions)
}
