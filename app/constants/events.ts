import type { OperationEvent } from '~/types/event'

export const operationEvents: OperationEvent[] = [
  {
    id: 'friday-ducks-2026-06-04',
    title: 'Friday Ducks',
    date: '04.06.2026',
    time: '18:00',
    status: 'active',
    registrationsCount: 17,
    totalAmount: 150000,
    paidAmount: 95000,
    debtAmount: 55000,
  },
  {
    id: 'sunday-poker-2026-06-01',
    title: 'Sunday Poker',
    date: '01.06.2026',
    time: '19:00',
    status: 'completed',
    registrationsCount: 42,
    totalAmount: 420000,
    paidAmount: 410000,
    debtAmount: 10000,
  },
  {
    id: 'duck-night-2026-05-29',
    title: 'Duck Night',
    date: '29.05.2026',
    time: '20:00',
    status: 'completed',
    registrationsCount: 31,
    totalAmount: 310000,
    paidAmount: 310000,
    debtAmount: 0,
  },
]
